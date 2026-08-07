import type { MetricBadgeKind } from '@/components/icons/MetricBadgeIcon';
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

  const maxSteps = computeMaxStepsInHistory();

  const values: Record<string, string> = {
    steps: `${maxSteps.toLocaleString()} steps`,
    time: formatActiveTime(estimateActiveMinutesFromSteps(getTodayStepsLive())),
    distance: `${estimateDistanceKmFromSteps(getTodayStepsLive()).toFixed(1)} km`,
    calories: `${Math.round(maxSteps * 0.04).toLocaleString()} kcal`,
  };

  return MOCK_PERSONAL_RECORDS.map((row) => ({
    ...row,
    value: values[row.id] ?? '—',
  }));
}
