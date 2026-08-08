import type { HourlyStepSlot } from '@/constants/hourlySteps';
import type { StepsWeekDay } from '@/constants/stepsToday';
import { readHourlyStepsForDateKey } from '@/lib/health/readHourlyStepsToday';
import {
  bucketsForDateKey,
  loadStepsHourlyHistory,
  upsertHourlyBucketsForDateKey,
  upsertTodayHourlyBuckets,
} from '@/lib/health/steps-hourly-history-storage';
import {
  formatPeakHourRange,
  weeklyPeakWalkEmptyCopy,
  weeklyPeakWalkInsufficientCopy,
  weeklyPeakWalkNotificationCopy,
} from '@/lib/health/peakHourLabel';
import { dateKeyForRollingDay, localTodayDateKey } from '@/lib/localDate';

export type WeeklyPeakWalkInsight = {
  peakWalkWindow: string | null;
  peakWalkNotification: string;
  status: 'loading' | 'ready' | 'no_steps' | 'insufficient_hourly';
};

function slotsToBuckets(slots: readonly HourlyStepSlot[]): number[] {
  return slots.map((slot) => Math.max(0, Math.round(slot.steps)));
}

function peakHourFromAggregatedDailyBuckets(dailyBuckets: readonly (readonly number[])[]): {
  window: string | null;
  totalHourlySteps: number;
} {
  const hourTotals = Array.from({ length: 24 }, () => 0);
  let totalHourlySteps = 0;
  for (const buckets of dailyBuckets) {
    for (let h = 0; h < 24; h += 1) {
      const value = buckets[h] ?? 0;
      hourTotals[h] += value;
      totalHourlySteps += value;
    }
  }
  if (totalHourlySteps <= 0) {
    return { window: null, totalHourlySteps: 0 };
  }

  let bestHour = 0;
  let bestTotal = hourTotals[0] ?? 0;
  for (let h = 1; h < 24; h += 1) {
    const value = hourTotals[h] ?? 0;
    if (value > bestTotal) {
      bestTotal = value;
      bestHour = h;
    } else if (value === bestTotal && h < bestHour) {
      bestHour = h;
    }
  }

  return { window: formatPeakHourRange(bestHour), totalHourlySteps };
}

function weekDateKeys(anchor = new Date()): string[] {
  return Array.from({ length: 7 }, (_, index) => dateKeyForRollingDay(anchor, index));
}

function stepsByDateKeyFromWeek(
  week: readonly StepsWeekDay[],
  anchor = new Date(),
): Record<string, number> {
  const map: Record<string, number> = {};
  week.forEach((day, index) => {
    map[dateKeyForRollingDay(anchor, index)] = day.steps;
  });
  return map;
}

export async function resolveWeeklyPeakWalkInsight(options: {
  week: readonly StepsWeekDay[];
  hourlySlots: readonly HourlyStepSlot[];
  metricsLive: boolean;
  anchor?: Date;
}): Promise<WeeklyPeakWalkInsight> {
  const anchor = options.anchor ?? new Date();
  const weekStepsTotal = options.week.reduce((sum, day) => sum + day.steps, 0);
  if (weekStepsTotal <= 0) {
    return {
      peakWalkWindow: null,
      peakWalkNotification: weeklyPeakWalkEmptyCopy(),
      status: 'no_steps',
    };
  }

  if (!options.metricsLive) {
    return {
      peakWalkWindow: null,
      peakWalkNotification: weeklyPeakWalkInsufficientCopy(),
      status: 'insufficient_hourly',
    };
  }

  const keys = weekDateKeys(anchor);
  const todayKey = localTodayDateKey();
  const stepsByKey = stepsByDateKeyFromWeek(options.week, anchor);
  const history = await loadStepsHourlyHistory();
  const dailyBuckets: number[][] = [];

  for (const dateKey of keys) {
    if (dateKey === todayKey) {
      const live = slotsToBuckets(options.hourlySlots);
      dailyBuckets.push(live);
      void upsertTodayHourlyBuckets(live);
      continue;
    }

    const stored = bucketsForDateKey(history, dateKey);
    const storedTotal = stored.reduce((sum, value) => sum + value, 0);
    if (storedTotal > 0) {
      dailyBuckets.push(stored);
      continue;
    }

    const daySteps = stepsByKey[dateKey] ?? 0;
    if (daySteps <= 0) {
      dailyBuckets.push(stored);
      continue;
    }

    const read = await readHourlyStepsForDateKey(dateKey);
    if (read.ok) {
      const readTotal = read.buckets.reduce((sum, value) => sum + value, 0);
      if (readTotal > 0) {
        await upsertHourlyBucketsForDateKey(dateKey, read.buckets);
        dailyBuckets.push(read.buckets);
        continue;
      }
    }
    dailyBuckets.push(stored);
  }

  const { window, totalHourlySteps } = peakHourFromAggregatedDailyBuckets(dailyBuckets);
  if (!window || totalHourlySteps <= 0) {
    return {
      peakWalkWindow: null,
      peakWalkNotification: weeklyPeakWalkInsufficientCopy(),
      status: 'insufficient_hourly',
    };
  }

  return {
    peakWalkWindow: window,
    peakWalkNotification: weeklyPeakWalkNotificationCopy(window),
    status: 'ready',
  };
}
