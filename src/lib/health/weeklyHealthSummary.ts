import type { StepsWeekDay } from '@/constants/stepsToday';
import { activeCaloriesFromSteps } from '@/lib/calories-estimate';
import type { WeeklyPeakWalkInsight } from '@/lib/health/weeklyPeakWalk';

export type WeeklyHealthSummary = {
  totalSteps: number;
  totalActiveKcal: number;
  totalWaterMl: number;
  peakWalkWindow: string | null;
  peakWalkNotification: string;
  peakWalkStatus: WeeklyPeakWalkInsight['status'];
  bestStepsDay: StepsWeekDay | null;
};

export function summarizeWeeklyHealth(
  week: readonly StepsWeekDay[],
  totalWaterMl: number,
  peak: Pick<WeeklyPeakWalkInsight, 'peakWalkWindow' | 'peakWalkNotification' | 'status'>,
): WeeklyHealthSummary {
  const totalSteps = week.reduce((sum, day) => sum + day.steps, 0);
  const totalActiveKcal = week.reduce((sum, day) => sum + activeCaloriesFromSteps(day.steps), 0);

  const bestStepsDay =
    week.reduce<StepsWeekDay | null>((best, day) => {
      if (day.steps <= 0) return best;
      if (!best || day.steps > best.steps) return day;
      return best;
    }, null) ?? null;

  return {
    totalSteps,
    totalActiveKcal,
    totalWaterMl,
    peakWalkWindow: peak.peakWalkWindow,
    peakWalkNotification: peak.peakWalkNotification,
    peakWalkStatus: peak.status,
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
  return `${steps} steps · ~${kcal} est. kcal · ${liters}`;
}
