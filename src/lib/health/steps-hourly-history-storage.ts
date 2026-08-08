import AsyncStorage from '@react-native-async-storage/async-storage';

import { dateKeyForRollingDay, localTodayDateKey } from '@/lib/localDate';

const STORAGE_KEY = '@mizora/steps_hourly_history_v1';

export type StepsHourlyHistory = Record<string, number[]>;

function emptyBuckets(): number[] {
  return Array.from({ length: 24 }, () => 0);
}

function normalizeBuckets(raw: unknown): number[] {
  if (!Array.isArray(raw) || raw.length !== 24) {
    return emptyBuckets();
  }
  return raw.map((value) =>
    typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.round(value) : 0,
  );
}

function rollingWeekDateKeys(anchor = new Date()): string[] {
  return Array.from({ length: 7 }, (_, i) => dateKeyForRollingDay(anchor, i));
}

function pruneHistory(record: StepsHourlyHistory, keep: Set<string>): StepsHourlyHistory {
  const next: StepsHourlyHistory = {};
  for (const key of keep) {
    if (record[key]) {
      next[key] = record[key];
    }
  }
  return next;
}

export async function loadStepsHourlyHistory(): Promise<StepsHourlyHistory> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as StepsHourlyHistory;
    if (!parsed || typeof parsed !== 'object') return {};
    const normalized: StepsHourlyHistory = {};
    for (const [key, buckets] of Object.entries(parsed)) {
      normalized[key] = normalizeBuckets(buckets);
    }
    const keep = new Set(rollingWeekDateKeys());
    keep.add(localTodayDateKey());
    const pruned = pruneHistory(normalized, keep);
    if (Object.keys(pruned).length !== Object.keys(normalized).length) {
      await saveStepsHourlyHistory(pruned);
    }
    return pruned;
  } catch {
    return {};
  }
}

export async function saveStepsHourlyHistory(record: StepsHourlyHistory): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(record));
}

export async function upsertTodayHourlyBuckets(
  buckets: readonly number[],
): Promise<StepsHourlyHistory> {
  return upsertHourlyBucketsForDateKey(localTodayDateKey(), buckets);
}

export async function upsertHourlyBucketsForDateKey(
  dateKey: string,
  buckets: readonly number[],
): Promise<StepsHourlyHistory> {
  const history = await loadStepsHourlyHistory();
  const keep = new Set(rollingWeekDateKeys());
  keep.add(localTodayDateKey());
  keep.add(dateKey);
  history[dateKey] = normalizeBuckets(buckets);
  const pruned = pruneHistory(history, keep);
  await saveStepsHourlyHistory(pruned);
  return pruned;
}

export function bucketsForDateKey(history: StepsHourlyHistory, dateKey: string): number[] {
  return history[dateKey] ? [...history[dateKey]] : emptyBuckets();
}
