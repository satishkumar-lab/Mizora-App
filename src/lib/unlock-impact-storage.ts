import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AppBrandId } from '@/components/icons/AppBrandIcon';
import { UNLOCK_IMPACT_APP_ORDER, type UnlockImpactWeekDay } from '@/constants/unlockImpactWeek';
import {
  buildRollingWeekDays,
  dateKeyForRollingDay,
  getLocalTodayParts,
  localDateKey,
  localTodayDateKey,
} from '@/lib/localDate';
import type { RewardAppItem } from '@/constants/unlockRewards';

const STORAGE_KEY = '@mizora/unlock_impact_v1';
const MAX_DAY_KEYS = 21;

type DayImpactRecord = {
  stepsByApp: Partial<Record<AppBrandId, number>>;
};

type UnlockImpactStore = {
  days: Record<string, DayImpactRecord>;
};

function emptyStore(): UnlockImpactStore {
  return { days: {} };
}

function pruneOldDays(store: UnlockImpactStore): UnlockImpactStore {
  const keys = Object.keys(store.days).sort();
  if (keys.length <= MAX_DAY_KEYS) return store;
  const keep = new Set(keys.slice(keys.length - MAX_DAY_KEYS));
  const days: Record<string, DayImpactRecord> = {};
  for (const key of keep) {
    days[key] = store.days[key]!;
  }
  return { days };
}

async function loadStore(): Promise<UnlockImpactStore> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyStore();
  try {
    const data = JSON.parse(raw) as UnlockImpactStore;
    if (!data?.days || typeof data.days !== 'object') return emptyStore();
    return pruneOldDays(data);
  } catch {
    return emptyStore();
  }
}

async function saveStore(store: UnlockImpactStore): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pruneOldDays(store)));
}

function stepsForLiveToday(apps: RewardAppItem[]): Partial<Record<AppBrandId, number>> {
  const out: Partial<Record<AppBrandId, number>> = {};
  for (const app of apps) {
    if (app.challenge.kind !== 'steps') continue;
    const earned = app.challenge.earnedSteps;
    if (earned <= 0) continue;
    out[app.id] = earned;
  }
  return out;
}

export function buildUnlockImpactWeekFromStore(
  store: UnlockImpactStore,
  apps: RewardAppItem[],
  anchor: Date = new Date(),
): UnlockImpactWeekDay[] {
  const liveToday = stepsForLiveToday(apps);
  const todayKey = localTodayDateKey();

  return buildRollingWeekDays(anchor).map((row, index) => {
    const dateKey = dateKeyForRollingDay(anchor, index);
    const record = store.days[dateKey];
    const stepsByApp = UNLOCK_IMPACT_APP_ORDER.map((appId) => {
      let steps = record?.stepsByApp?.[appId] ?? 0;
      if (dateKey === todayKey && liveToday[appId] != null) {
        steps = Math.max(steps, liveToday[appId]!);
      }
      return { appId, steps };
    });
    const unlockSteps = stepsByApp.reduce((sum, row) => sum + row.steps, 0);
    return {
      weekday: row.weekday,
      day: row.day,
      isToday: row.isToday,
      unlockSteps,
      stepsByApp,
    };
  });
}

export async function loadUnlockImpactWeekDays(
  apps: RewardAppItem[],
): Promise<UnlockImpactWeekDay[]> {
  const store = await loadStore();
  return buildUnlockImpactWeekFromStore(store, apps);
}

/** Persist steps earned when a step challenge is first completed today. */
export async function recordUnlockStepCompletion(
  appId: AppBrandId,
  earnedSteps: number,
): Promise<void> {
  if (earnedSteps <= 0) return;
  const store = await loadStore();
  const dateKey = localTodayDateKey();
  const day = store.days[dateKey] ?? { stepsByApp: {} };
  const prev = day.stepsByApp[appId] ?? 0;
  if (earnedSteps <= prev) return;
  day.stepsByApp[appId] = earnedSteps;
  store.days[dateKey] = day;
  await saveStore(store);
}

export async function computeVsLastWeekPct(weekDays: UnlockImpactWeekDay[]): Promise<number> {
  const thisWeek = weekDays.reduce((s, d) => s + d.unlockSteps, 0);
  const store = await loadStore();
  const anchor = new Date();
  let lastWeek = 0;
  const prevMonday = new Date(anchor);
  prevMonday.setHours(0, 0, 0, 0);
  const col = (prevMonday.getDay() + 6) % 7;
  prevMonday.setDate(prevMonday.getDate() - col - 7);
  for (let j = 0; j < 7; j++) {
    const day = new Date(prevMonday);
    day.setDate(prevMonday.getDate() + j);
    const dk = localDateKey(getLocalTodayParts(day));
    const rec = store.days[dk];
    if (rec?.stepsByApp) {
      lastWeek += Object.values(rec.stepsByApp).reduce((a, b) => a + (b ?? 0), 0);
    }
  }

  if (lastWeek <= 0) return thisWeek > 0 ? 100 : 0;
  return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
}
