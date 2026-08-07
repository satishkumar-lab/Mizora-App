import type { HourlyStepSlot } from '@/constants/hourlySteps';
import { HOURLY_STEP_SLOTS } from '@/constants/hourlySteps';

export type HourlyStepBuckets = readonly [number, ...number[]] & { length: 24 };

export function emptyHourlyBuckets(): number[] {
  return Array.from({ length: 24 }, () => 0);
}

export function sumHourlyBuckets(buckets: readonly number[]): number {
  return buckets.reduce((acc, n) => acc + n, 0);
}

/** Align bucket sum with authoritative daily total (adjust current hour only). */
export function reconcileHourlyBucketsToDailyTotal(
  buckets: readonly number[],
  dailyTotal: number,
  currentHour: number,
): number[] {
  const next = buckets.map((n) => Math.max(0, Math.round(n)));
  const hour = Math.min(23, Math.max(0, currentHour));
  const sum = sumHourlyBuckets(next);
  const diff = Math.round(dailyTotal) - sum;
  if (diff !== 0) {
    next[hour] = Math.max(0, next[hour] + diff);
  }
  return next;
}

/** Apply live step delta to the current hour; earlier hours stay unchanged. */
export function applyLiveDeltaToCurrentHour(
  buckets: readonly number[],
  delta: number,
  currentHour: number,
): number[] | null {
  if (delta === 0) {
    return null;
  }
  const next = [...buckets];
  const hour = Math.min(23, Math.max(0, currentHour));
  next[hour] = Math.max(0, next[hour] + Math.round(delta));
  return next;
}

export function hourlySlotsFromBuckets(buckets: readonly number[]): HourlyStepSlot[] {
  return HOURLY_STEP_SLOTS.map((slot, index) => ({
    label: slot.label,
    hour: slot.hour,
    steps: Math.max(0, Math.round(buckets[index] ?? 0)),
  }));
}

export function hourlyBucketsSignature(buckets: readonly number[]): string {
  return buckets.join(',');
}
