import type { StepsWeekDay } from '@/constants/stepsToday';
import { activeCaloriesFromSteps } from '@/lib/calories-estimate';
import type { HourlyStepSlot } from '@/constants/hourlySteps';
import {
  peakWalkWindowFromSlots,
  weeklyPeakWalkNotificationCopy,
} from '@/lib/health/peakHourLabel';

export type WeeklyHealthSummary = {
  totalSteps: number;
  totalActiveKcal: number;
  totalWaterMl: number;
  peakWalkWindow: string;
  peakWalkNotification: string;
  bestStepsDay: StepsWeekDay | null;
};

export function summarizeWeeklyHealth(
  week: readonly StepsWeekDay[],
  todayWaterMl: number,
  hourlySlots: readonly HourlyStepSlot[],
): WeeklyHealthSummary {
  const totalSteps = week.reduce((sum, day) => sum + day.steps, 0);
  const totalActiveKcal = week.reduce((sum, day) => sum + activeCaloriesFromSteps(day.steps), 0);
  const totalWaterMl = week.reduce((sum, day) => sum + (day.isToday ? todayWaterMl : 0), 0);

  const bestStepsDay =
    week.reduce<StepsWeekDay | null>((best, day) => {
      if (!best || day.steps > best.steps) return day;
      return best;
    }, null) ?? null;

  const peakWalkWindow = peakWalkWindowFromSlots(hourlySlots);
  const peakWalkNotification = weeklyPeakWalkNotificationCopy(peakWalkWindow);

  return {
    totalSteps,
    totalActiveKcal,
    totalWaterMl,
    peakWalkWindow,
    peakWalkNotification,
    bestStepsDay,
  };
}

export function formatWeeklyInboxStatLine(summary: WeeklyHealthSummary): string {
  const steps = summary.totalSteps.toLocaleString();
  const kcal = Math.round(summary.totalActiveKcal).toLocaleString();
  const liters =
    summary.totalWaterMl >= 1000
      ? `${(summary.totalWaterMl / 1000).toFixed(1)} L water`
      : summary.totalWaterMl > 0
        ? `${summary.totalWaterMl} ml water`
        : '— water';
  return `${steps} steps · ${kcal} kcal · ${liters}`;
}
