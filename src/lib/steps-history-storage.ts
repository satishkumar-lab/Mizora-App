import AsyncStorage from '@react-native-async-storage/async-storage';

import { localTodayDateKey } from '@/lib/localDate';

const STORAGE_KEY = '@mizora/steps_history_v1';

export type StepsHistoryRecord = Record<string, number>;

export async function loadStepsHistory(): Promise<StepsHistoryRecord> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as StepsHistoryRecord;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch {
    return {};
  }
}

export async function saveStepsHistory(record: StepsHistoryRecord): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

export async function upsertTodaySteps(steps: number): Promise<StepsHistoryRecord> {
  const history = await loadStepsHistory();
  const key = localTodayDateKey();
  history[key] = Math.max(0, Math.round(steps));
  await saveStepsHistory(history);
  return history;
}
