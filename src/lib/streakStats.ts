import type { MetricBadgeKind } from '@/components/icons/MetricBadgeIcon';
import { activeCaloriesFromSteps } from '@/lib/calories-estimate';
import {
  estimateActiveMinutesFromSteps,
  estimateDistanceKmFromSteps,
} from '@/lib/health/stepEstimates';
import { getStepsHistory, getTodayStepsLive } from '@/lib/steps-live-store';
import { isStreakDayComplete, stepsForDateKey } from '@/lib/streakCalendar';
import { DEFAULT_DAILY_STEP_GOAL } from '@/lib/steps-preferences';

export type StreakPersonalRecord = {
  id: string;
  label: string;
  value: string;
  metric: MetricBadgeKind;
};

const MOCK_PERSONAL_RECORDS: Omit<StreakPersonalRecord, 'value'>[] = [
  { id: 'steps', label: 'Most steps in a day', metric: 'steps' },
  { id: 'time', label: 'Longest active time', metric: 'activeTime' },
  { id: 'distance', label: 'Farthest distance', metric: 'distance' },
  { id: 'calories', label: 'Most calories burned', metric: 'calories' },
];

export function computeMaxStepsInHistory(): number {
  const historyValues = Object.values(getStepsHistory());
  return Math.max(0, ...historyValues, getTodayStepsLive());
}

function computeHistoricalPersonalRecordMaxima(): {
  maxSteps: number;
  maxActiveMinutes: number;
  maxDistanceKm: number;
  maxCalories: number;
} {
  const history = getStepsHistory();
  const stepCounts = [...Object.values(history), getTodayStepsLive()];

  let maxSteps = 0;
  let maxActiveMinutes = 0;
  let maxDistanceKm = 0;
  let maxCalories = 0;

  for (const steps of stepCounts) {
    if (steps <= 0) continue;
    maxSteps = Math.max(maxSteps, steps);
    maxActiveMinutes = Math.max(maxActiveMinutes, estimateActiveMinutesFromSteps(steps));
    maxDistanceKm = Math.max(maxDistanceKm, estimateDistanceKmFromSteps(steps));
    maxCalories = Math.max(maxCalories, activeCaloriesFromSteps(steps));
  }

  return { maxSteps, maxActiveMinutes, maxDistanceKm, maxCalories };
}

export function computeLongestStreakAllTime(goal: number = DEFAULT_DAILY_STEP_GOAL): number {
  const keys = Object.keys(getStepsHistory()).sort();
  let best = 0;
  let run = 0;
  let prevMs: number | null = null;

  for (const key of keys) {
    const parts = key.split('-').map(Number);
    const y = parts[0];
    const m = parts[1];
    const d = parts[2];
    if (!y || !m || !d) continue;

    const ms = new Date(y, m - 1, d).setHours(0, 0, 0, 0);
    const complete = isStreakDayComplete(stepsForDateKey(key), goal);

    if (!complete) {
      run = 0;
      prevMs = null;
      continue;
    }

    if (prevMs !== null && ms - prevMs === 86_400_000) {
      run += 1;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
    prevMs = ms;
  }
  return best;
}

function formatActiveTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

export function buildPersonalRecords(metricsLive = true): StreakPersonalRecord[] {
  if (!metricsLive) {
    return MOCK_PERSONAL_RECORDS.map((row) => ({
      ...row,
      value: '—',
    }));
  }

  const { maxSteps, maxActiveMinutes, maxDistanceKm, maxCalories } =
    computeHistoricalPersonalRecordMaxima();

  const values: Record<string, string> = {
    steps: `${maxSteps.toLocaleString()} steps`,
    time: formatActiveTime(maxActiveMinutes),
    distance: `${maxDistanceKm.toFixed(1)} km`,
    calories: `${maxCalories.toLocaleString()} kcal`,
  };

  return MOCK_PERSONAL_RECORDS.map((row) => ({
    ...row,
    value: values[row.id] ?? '—',
  }));
}
