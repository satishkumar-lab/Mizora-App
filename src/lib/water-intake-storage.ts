import AsyncStorage from '@react-native-async-storage/async-storage';

import { localTodayDateKey } from '@/lib/localDate';
import {
  emptyWaterHourlyMl,
  migrateHourlyFromLoggedTotal,
  normalizeWaterHourlyMl,
  sumWaterHourlyMl,
  trimWaterHourlyToMax,
} from '@/lib/water-hourly';
import { clampWaterGoalMl, WATER_GOAL_MIN_ML } from '@/lib/water-recommendation';

const STORAGE_KEY = '@mizora/water_intake_v2';

export type WaterIntakeSnapshot = {
  dateKey: string;
  loggedMl: number;
  goalMl: number;
  hourlyMl: number[];
};

export function activeWaterDateKey(): string {
  return localTodayDateKey();
}

export function defaultWaterIntakeSnapshot(): WaterIntakeSnapshot {
  return {
    dateKey: activeWaterDateKey(),
    loggedMl: 0,
    goalMl: clampWaterGoalMl(WATER_GOAL_MIN_ML),
    hourlyMl: emptyWaterHourlyMl(),
  };
}

function normalizeSnapshot(raw: Partial<WaterIntakeSnapshot> | null): WaterIntakeSnapshot {
  const defaults = defaultWaterIntakeSnapshot();
  if (!raw || raw.dateKey !== activeWaterDateKey()) {
    return defaults;
  }
  const goalMl =
    typeof raw.goalMl === 'number' && raw.goalMl > 0
      ? clampWaterGoalMl(raw.goalMl)
      : defaults.goalMl;
  const loggedRaw =
    typeof raw.loggedMl === 'number' && raw.loggedMl >= 0 ? raw.loggedMl : defaults.loggedMl;
  let hourlyMl = migrateHourlyFromLoggedTotal(normalizeWaterHourlyMl(raw.hourlyMl), loggedRaw);
  hourlyMl = trimWaterHourlyToMax(hourlyMl, goalMl);
  const loggedMl = Math.min(sumWaterHourlyMl(hourlyMl), goalMl);
  return {
    dateKey: activeWaterDateKey(),
    loggedMl,
    goalMl,
    hourlyMl,
  };
}

export async function loadWaterIntakeSnapshot(): Promise<WaterIntakeSnapshot> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultWaterIntakeSnapshot();
  try {
    return normalizeSnapshot(JSON.parse(raw) as Partial<WaterIntakeSnapshot>);
  } catch {
    return defaultWaterIntakeSnapshot();
  }
}

export async function saveWaterIntakeSnapshot(snapshot: WaterIntakeSnapshot): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}
