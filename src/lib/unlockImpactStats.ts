import type { RewardAppItem } from '@/constants/unlockRewards';
import type { AppBrandId } from '@/components/icons/AppBrandIcon';
import {
  MOCK_UNLOCK_IMPACT_WEEK,
  MOCK_UNLOCK_WEEK_STEP_GOAL,
  MOCK_VS_LAST_WEEK_PCT,
  MOCK_WEEK_SCREEN_TIME_GOAL_MIN,
  UNLOCK_IMPACT_APP_LABEL,
  UNLOCK_IMPACT_APP_ORDER,
  type UnlockImpactWeekDay,
} from '@/constants/unlockImpactWeek';

export type DayAppWalkRow = {
  appId: AppBrandId;
  name: string;
  steps: number;
  sharePct: number;
};

export function sortedDayAppBreakdown(day: UnlockImpactWeekDay): DayAppWalkRow[] {
  const total = Math.max(day.unlockSteps, 1);
  return [...day.stepsByApp]
    .sort((a, b) => b.steps - a.steps)
    .map((row) => ({
      appId: row.appId,
      name: UNLOCK_IMPACT_APP_LABEL[row.appId] ?? row.appId,
      steps: row.steps,
      sharePct: Math.round((row.steps / total) * 100),
    }));
}

export function topAppForDay(day: UnlockImpactWeekDay): DayAppWalkRow | undefined {
  return sortedDayAppBreakdown(day)[0];
}

export function weeklyStepsByApp(weekDays: UnlockImpactWeekDay[]): DayAppWalkRow[] {
  const totals = new Map<AppBrandId, number>();
  for (const day of weekDays) {
    for (const row of day.stepsByApp) {
      totals.set(row.appId, (totals.get(row.appId) ?? 0) + row.steps);
    }
  }
  const grand = [...totals.values()].reduce((a, b) => a + b, 0) || 1;
  return UNLOCK_IMPACT_APP_ORDER.filter((id) => totals.has(id))
    .map((appId) => ({
      appId,
      name: UNLOCK_IMPACT_APP_LABEL[appId] ?? appId,
      steps: totals.get(appId) ?? 0,
      sharePct: Math.round(((totals.get(appId) ?? 0) / grand) * 100),
    }))
    .sort((a, b) => b.steps - a.steps);
}

/** UNLOCK_IMPACT_APP_ORDER re-export for charts */
export { UNLOCK_IMPACT_APP_ORDER, UNLOCK_IMPACT_APP_SEGMENT } from '@/constants/unlockImpactWeek';

/** Default walking pace until Health / profile personalizes (≈3 mph). */
export const DEFAULT_WALKING_STEPS_PER_MIN = 100;

/** Share of walk time modeled as screen time not spent on locked apps. */
export const SCREEN_TIME_SAVED_RATIO = 0.85;

export type UnlockImpactSummary = {
  blockedAppsCount: number;
  unlockStepsThisWeek: number;
  unlockWeekStepGoal: number;
  weekProgressPct: number;
  walkingMinutesThisWeek: number;
  screenTimeSavedMinutesThisWeek: number;
  stepsPerMinute: number;
  minutesPer1kSteps: number;
  screenMinutesSavedPer1kSteps: number;
  vsLastWeekPct: number;
  weekDays: UnlockImpactWeekDay[];
  screenTimeWeekGoalMinutes: number;
  screenTimeWeekProgressPct: number;
};

export type UnlockImpactAppWeekRow = {
  id: RewardAppItem['id'];
  name: string;
  stepsThisWeek: number;
  unlockedToday: boolean;
  goalCompleteToday: boolean;
  userLockedToday: boolean;
};

export function walkingMinutesFromSteps(
  steps: number,
  stepsPerMin: number = DEFAULT_WALKING_STEPS_PER_MIN,
): number {
  if (steps <= 0 || stepsPerMin <= 0) return 0;
  return steps / stepsPerMin;
}

export function screenTimeSavedFromWalkMinutes(walkMinutes: number): number {
  return walkMinutes * SCREEN_TIME_SAVED_RATIO;
}

export function screenTimeSavedMinutesFromSteps(
  steps: number,
  stepsPerMin: number = DEFAULT_WALKING_STEPS_PER_MIN,
): number {
  return screenTimeSavedFromWalkMinutes(walkingMinutesFromSteps(steps, stepsPerMin));
}

export function enrichUnlockWeekWithLiveToday(
  weekDays: UnlockImpactWeekDay[],
  stepsToday: number,
): UnlockImpactWeekDay[] {
  if (stepsToday <= 0) return weekDays;

  return weekDays.map((day) => {
    if (!day.isToday || day.unlockSteps <= 0) return day;

    const scale = stepsToday / day.unlockSteps;
    const stepsByApp = day.stepsByApp.map((row) => ({
      appId: row.appId,
      steps: Math.max(0, Math.round(row.steps * scale)),
    }));

    let sum = stepsByApp.reduce((s, row) => s + row.steps, 0);
    const drift = stepsToday - sum;
    if (drift !== 0 && stepsByApp.length > 0) {
      const topIdx = stepsByApp.reduce(
        (best, row, i, arr) => (row.steps > arr[best]!.steps ? i : best),
        0,
      );
      stepsByApp[topIdx]!.steps += drift;
      sum = stepsToday;
    }

    return {
      ...day,
      unlockSteps: sum,
      stepsByApp,
    };
  });
}

export function buildUnlockImpactSummary(
  apps: RewardAppItem[],
  weekDays: UnlockImpactWeekDay[] = MOCK_UNLOCK_IMPACT_WEEK,
  stepsPerMinute: number = DEFAULT_WALKING_STEPS_PER_MIN,
  weekStepGoal: number = MOCK_UNLOCK_WEEK_STEP_GOAL,
  screenTimeWeekGoalMinutes: number = MOCK_WEEK_SCREEN_TIME_GOAL_MIN,
  stepsTodayForLiveSplit?: number,
  vsLastWeekPct: number = MOCK_VS_LAST_WEEK_PCT,
): UnlockImpactSummary {
  const week =
    stepsTodayForLiveSplit != null &&
    stepsTodayForLiveSplit > 0 &&
    weekDays.every((d) => !d.isToday || d.unlockSteps === 0)
      ? enrichUnlockWeekWithLiveToday(weekDays, stepsTodayForLiveSplit)
      : weekDays;
  const unlockStepsThisWeek = week.reduce((sum, d) => sum + d.unlockSteps, 0);
  const walkingMinutesThisWeek = walkingMinutesFromSteps(unlockStepsThisWeek, stepsPerMinute);
  const screenTimeSavedMinutesThisWeek = screenTimeSavedFromWalkMinutes(walkingMinutesThisWeek);
  const minutesPer1kSteps = walkingMinutesFromSteps(1000, stepsPerMinute);
  const screenMinutesSavedPer1kSteps = screenTimeSavedFromWalkMinutes(minutesPer1kSteps);
  const weekProgressPct = Math.min(
    100,
    Math.round((unlockStepsThisWeek / Math.max(weekStepGoal, 1)) * 100),
  );
  const screenTimeWeekProgressPct = Math.min(
    100,
    Math.round((screenTimeSavedMinutesThisWeek / Math.max(screenTimeWeekGoalMinutes, 1)) * 100),
  );

  return {
    blockedAppsCount: apps.length,
    unlockStepsThisWeek,
    unlockWeekStepGoal: weekStepGoal,
    weekProgressPct,
    walkingMinutesThisWeek,
    screenTimeSavedMinutesThisWeek,
    stepsPerMinute,
    minutesPer1kSteps,
    screenMinutesSavedPer1kSteps,
    vsLastWeekPct,
    weekDays: week,
    screenTimeWeekGoalMinutes,
    screenTimeWeekProgressPct,
  };
}

/** Mock per-app weekly attribution until event pipeline exists. */
export function buildUnlockImpactAppRows(
  apps: RewardAppItem[],
  weekDays: UnlockImpactWeekDay[] = MOCK_UNLOCK_IMPACT_WEEK,
): UnlockImpactAppWeekRow[] {
  const totals = new Map<AppBrandId, number>();
  for (const day of weekDays) {
    for (const row of day.stepsByApp) {
      totals.set(row.appId, (totals.get(row.appId) ?? 0) + row.steps);
    }
  }

  return apps.map((app) => ({
    id: app.id,
    name: app.name,
    stepsThisWeek: totals.get(app.id) ?? 0,
    unlockedToday: app.unlocked,
    goalCompleteToday: app.goalComplete,
    userLockedToday: app.userLockedToday,
  }));
}

export function formatCompactSteps(steps: number): string {
  if (steps >= 10_000) {
    const k = steps / 1000;
    return `${k % 1 === 0 ? k : k.toFixed(1).replace(/\.0$/, '')}K`;
  }
  return steps.toLocaleString();
}

export function formatDurationShort(totalMinutes: number): string {
  if (totalMinutes < 1) return '0 min';
  if (totalMinutes < 60) return `${Math.round(totalMinutes)} min`;
  const h = Math.floor(totalMinutes / 60);
  const m = Math.round(totalMinutes % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function formatDurationHours(totalMinutes: number): string {
  if (totalMinutes < 60) return formatDurationShort(totalMinutes);
  const h = totalMinutes / 60;
  return `${h.toFixed(1).replace(/\.0$/, '')} hrs`;
}

export function dayChartValue(
  day: UnlockImpactWeekDay,
  mode: 'steps' | 'screen',
  stepsPerMinute: number,
): number {
  if (mode === 'steps') return day.unlockSteps;
  return screenTimeSavedMinutesFromSteps(day.unlockSteps, stepsPerMinute);
}

export function formatChartValue(value: number, mode: 'steps' | 'screen'): string {
  if (mode === 'steps') return value > 0 ? value.toLocaleString() : '—';
  return value > 0 ? formatDurationShort(value) : '—';
}
