import AsyncStorage from '@react-native-async-storage/async-storage';

import { buildRollingWeekDays, dateKeyForRollingDay, localTodayDateKey } from '@/lib/localDate';
import {
  emptyWaterHourlyMl,
  migrateHourlyFromLoggedTotal,
  normalizeWaterHourlyMl,
  sumWaterHourlyMl,
  trimWaterHourlyToMax,
} from '@/lib/water-hourly';
import { clampWaterGoalMl, WATER_GOAL_MIN_ML } from '@/lib/water-recommendation';

const STORAGE_KEY_V3 = '@mizora/water_intake_v3';
const LEGACY_STORAGE_KEY_V2 = '@mizora/water_intake_v2';

export type WaterDayRecord = {
  loggedMl: number;
  hourlyMl: number[];
};

export type WaterIntakeStore = {
  goalMl: number;
  days: Record<string, WaterDayRecord>;
};

export type WaterIntakeSnapshot = {
  dateKey: string;
  loggedMl: number;
  goalMl: number;
  hourlyMl: number[];
};

export function activeWaterDateKey(): string {
  return localTodayDateKey();
}

function emptyDayRecord(): WaterDayRecord {
  return { loggedMl: 0, hourlyMl: emptyWaterHourlyMl() };
}

function normalizeDayRecord(
  raw: Partial<WaterDayRecord> | undefined,
  goalMl: number,
): WaterDayRecord {
  const defaults = emptyDayRecord();
  const loggedRaw =
    typeof raw?.loggedMl === 'number' && raw.loggedMl >= 0 ? raw.loggedMl : defaults.loggedMl;
  let hourlyMl = migrateHourlyFromLoggedTotal(normalizeWaterHourlyMl(raw?.hourlyMl), loggedRaw);
  hourlyMl = trimWaterHourlyToMax(hourlyMl, goalMl);
  const loggedMl = Math.min(sumWaterHourlyMl(hourlyMl), goalMl);
  return { loggedMl, hourlyMl };
}

function defaultStore(): WaterIntakeStore {
  return {
    goalMl: clampWaterGoalMl(WATER_GOAL_MIN_ML),
    days: {},
  };
}

function pruneOldDays(
  days: Record<string, WaterDayRecord>,
  keepDateKeys: Set<string>,
): Record<string, WaterDayRecord> {
  const next: Record<string, WaterDayRecord> = {};
  for (const key of keepDateKeys) {
    if (days[key]) {
      next[key] = days[key];
    }
  }
  return next;
}

function rollingWeekDateKeys(anchor = new Date()): string[] {
  return Array.from({ length: 7 }, (_, i) => dateKeyForRollingDay(anchor, i));
}

async function migrateLegacyV2IntoStore(store: WaterIntakeStore): Promise<WaterIntakeStore> {
  const raw = await AsyncStorage.getItem(LEGACY_STORAGE_KEY_V2);
  if (!raw) return store;
  try {
    const legacy = JSON.parse(raw) as Partial<WaterIntakeSnapshot>;
    const legacyKey =
      typeof legacy.dateKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(legacy.dateKey)
        ? legacy.dateKey
        : activeWaterDateKey();
    if (!store.days[legacyKey]) {
      const day = normalizeDayRecord(
        { loggedMl: legacy.loggedMl, hourlyMl: legacy.hourlyMl },
        store.goalMl,
      );
      if (day.loggedMl > 0 || day.hourlyMl.some((value) => value > 0)) {
        store.days[legacyKey] = day;
      }
    }
    if (typeof legacy.goalMl === 'number' && legacy.goalMl > 0) {
      store.goalMl = clampWaterGoalMl(legacy.goalMl);
    }
    await AsyncStorage.removeItem(LEGACY_STORAGE_KEY_V2);
  } catch {
    // ignore corrupt legacy
  }
  return store;
}

export async function loadWaterIntakeStore(): Promise<WaterIntakeStore> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY_V3);
  let store = defaultStore();
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<WaterIntakeStore>;
      const goalMl =
        typeof parsed.goalMl === 'number' && parsed.goalMl > 0
          ? clampWaterGoalMl(parsed.goalMl)
          : store.goalMl;
      const days: Record<string, WaterDayRecord> = {};
      if (parsed.days && typeof parsed.days === 'object') {
        for (const [key, value] of Object.entries(parsed.days)) {
          days[key] = normalizeDayRecord(value as Partial<WaterDayRecord>, goalMl);
        }
      }
      store = { goalMl, days };
    } catch {
      store = defaultStore();
    }
  }
  store = await migrateLegacyV2IntoStore(store);
  const keep = new Set(rollingWeekDateKeys());
  keep.add(activeWaterDateKey());
  store.days = pruneOldDays(store.days, keep);
  return store;
}

export async function saveWaterIntakeStore(store: WaterIntakeStore): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY_V3, JSON.stringify(store));
}

export async function loadWaterIntakeSnapshot(): Promise<WaterIntakeSnapshot> {
  const store = await loadWaterIntakeStore();
  const todayKey = activeWaterDateKey();
  const day = store.days[todayKey] ?? emptyDayRecord();
  const normalized = normalizeDayRecord(day, store.goalMl);
  return {
    dateKey: todayKey,
    loggedMl: normalized.loggedMl,
    goalMl: store.goalMl,
    hourlyMl: normalized.hourlyMl,
  };
}

export async function saveWaterIntakeSnapshot(snapshot: WaterIntakeSnapshot): Promise<void> {
  const store = await loadWaterIntakeStore();
  const todayKey = activeWaterDateKey();
  const goalMl = clampWaterGoalMl(snapshot.goalMl);
  const day = normalizeDayRecord(
    { loggedMl: snapshot.loggedMl, hourlyMl: snapshot.hourlyMl },
    goalMl,
  );
  const keep = new Set(rollingWeekDateKeys());
  keep.add(todayKey);
  const days = { ...store.days, [todayKey]: day };
  await saveWaterIntakeStore({
    goalMl,
    days: pruneOldDays(days, keep),
  });
}

export function loggedMlForDateKey(store: WaterIntakeStore, dateKey: string): number {
  return store.days[dateKey]?.loggedMl ?? 0;
}

/** Mon–Sun glasses/ml for charts — missing days are zero. */
export function waterMlForRollingWeek(
  store: WaterIntakeStore,
  anchor = new Date(),
): { dateKey: string; ml: number; isToday: boolean; weekday: string; day: string }[] {
  return buildRollingWeekDays(anchor).map((row, index) => {
    const dateKey = dateKeyForRollingDay(anchor, index);
    return {
      dateKey,
      ml: loggedMlForDateKey(store, dateKey),
      isToday: row.isToday,
      weekday: row.weekday,
      day: row.day,
    };
  });
}

export function totalWaterMlForRollingWeek(store: WaterIntakeStore, anchor = new Date()): number {
  return waterMlForRollingWeek(store, anchor).reduce((sum, row) => sum + row.ml, 0);
}

export function defaultWaterIntakeSnapshot(): WaterIntakeSnapshot {
  return {
    dateKey: activeWaterDateKey(),
    loggedMl: 0,
    goalMl: clampWaterGoalMl(WATER_GOAL_MIN_ML),
    hourlyMl: emptyWaterHourlyMl(),
  };
}
