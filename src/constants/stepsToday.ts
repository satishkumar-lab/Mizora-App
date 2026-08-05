import type { AppBrandId } from '@/components/icons/AppBrandIcon';
import { buildRollingWeekDays, getLocalTodayParts, localDateKey } from '@/lib/localDate';
import { getStepsHistory } from '@/lib/steps-live-store';
import { DEFAULT_DAILY_STEP_GOAL } from '@/lib/steps-preferences';

function stepsForHistoryKey(dateKey: string, history: Record<string, number>): number {
  return history[dateKey] ?? 0;
}

export type StepsWeekDay = {
  weekday: string;
  day: string;
  steps: number;
  isToday: boolean;
  streak: boolean;
};

export function buildStepsWeek(
  todaySteps: number,
  history: Record<string, number> = getStepsHistory(),
): StepsWeekDay[] {
  const anchor = new Date();
  return buildRollingWeekDays(anchor).map((row, index) => {
    const monday = new Date(anchor);
    monday.setHours(0, 0, 0, 0);
    const column = (monday.getDay() + 6) % 7;
    monday.setDate(monday.getDate() - column + index);
    const dateKey = localDateKey(getLocalTodayParts(monday));
    const steps = row.isToday ? todaySteps : stepsForHistoryKey(dateKey, history);
    return {
      ...row,
      steps,
      streak: false,
    };
  });
}

export type StepsTodaySnapshot = ReturnType<typeof createStepsTodaySnapshot>;

/** Build dashboard snapshot — prefer `useSteps().snapshot` in UI. */
export function createStepsTodaySnapshot(
  todaySteps = 0,
  goal = DEFAULT_DAILY_STEP_GOAL,
  history: Record<string, number> = getStepsHistory(),
) {
  return {
    steps: todaySteps,
    goal,
    distanceKm: 0,
    activeMinutes: 0,
    vsYesterday: 0,
    peakHourLabel: '—',
    hourlyHeights: [0, 0, 0, 0, 0, 0, 0, 0, 0] as number[],
    week: buildStepsWeek(todaySteps, history),
  };
}

/** @deprecated Use `useSteps().snapshot` — kept for legacy imports during migration. */
export const STEPS_TODAY = createStepsTodaySnapshot(0, DEFAULT_DAILY_STEP_GOAL);

export type ActiveStepUnlock = {
  appId: AppBrandId;
  appName: string;
  challengeSteps: number;
  progressSteps: number;
  unlockMinutes: number;
};

export const ACTIVE_STEP_UNLOCK: ActiveStepUnlock = {
  appId: 'whatsapp',
  appName: 'WhatsApp',
  challengeSteps: 5000,
  progressSteps: 0,
  unlockMinutes: 30,
};

export function stepsRemainingToGoal(steps: number, goal: number): number {
  return Math.max(goal - steps, 0);
}

export function stepsRemainingForUnlock(unlock: ActiveStepUnlock): number {
  return Math.max(unlock.challengeSteps - unlock.progressSteps, 0);
}
