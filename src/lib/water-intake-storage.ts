import AsyncStorage from '@react-native-async-storage/async-storage';

import { STREAK_DISPLAY_TODAY } from '@/constants/streakHistory';
import { todayWaterGoalMl, todayWaterMl } from '@/constants/waterToday';
import { clampWaterGoalMl } from '@/lib/water-recommendation';

const STORAGE_KEY = '@mizora/water_intake_v1';

export type WaterIntakeSnapshot = {
  dateKey: string;
  loggedMl: number;
  goalMl: number;
};

/** Demo “today” key — swap to real local date when live Health/history ships. */
export function activeWaterDateKey(): string {
  const t = STREAK_DISPLAY_TODAY;
  return `${t.year}-${String(t.month).padStart(2, '0')}-${String(t.day).padStart(2, '0')}`;
}

export function defaultWaterIntakeSnapshot(): WaterIntakeSnapshot {
  return {
    dateKey: activeWaterDateKey(),
    loggedMl: todayWaterMl(),
    goalMl: todayWaterGoalMl(),
  };
}

function normalizeSnapshot(raw: Partial<WaterIntakeSnapshot> | null): WaterIntakeSnapshot {
  const defaults = defaultWaterIntakeSnapshot();
  if (!raw || raw.dateKey !== activeWaterDateKey()) {
    return defaults;
  }
  const loggedMl =
    typeof raw.loggedMl === 'number' && raw.loggedMl >= 0 ? raw.loggedMl : defaults.loggedMl;
  const goalMl =
    typeof raw.goalMl === 'number' && raw.goalMl > 0
      ? clampWaterGoalMl(raw.goalMl)
      : defaults.goalMl;
  return {
    dateKey: activeWaterDateKey(),
    loggedMl: Math.min(loggedMl, goalMl),
    goalMl,
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
