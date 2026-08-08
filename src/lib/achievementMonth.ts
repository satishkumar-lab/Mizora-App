import { MOCK_STREAK_STEPS_BY_DATE, getLocalTodayParts } from '@/constants/streakHistory';
import {
  buildMonthGrid,
  computeLongestStreakInMonth,
  isStreakDayComplete,
  stepsForDateKey,
} from '@/lib/streakCalendar';
import { DEFAULT_DAILY_STEP_GOAL } from '@/lib/steps-preferences';

/** Demo month-scoped lock / unlock / water tallies — wire to persistence later. */
export const MOCK_MONTHLY_CHALLENGE_PROGRESS = {
  fullRosterLockDays: 0,
  challengeUnlocks: 0,
  waterGoalDays: 0,
} as const;

export type AchievementMonthContext = {
  year: number;
  month: number;
};

export function activeAchievementMonth(): AchievementMonthContext {
  const t = getLocalTodayParts();
  return {
    year: t.year,
    month: t.month,
  };
}

export function achievementMonthLabel(
  ctx: AchievementMonthContext = activeAchievementMonth(),
): string {
  return new Date(ctx.year, ctx.month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function achievementMonthKey(
  ctx: AchievementMonthContext = activeAchievementMonth(),
): string {
  return `${ctx.year}-${String(ctx.month).padStart(2, '0')}`;
}

function dateKeysInMonth(ctx: AchievementMonthContext): string[] {
  const prefix = achievementMonthKey(ctx);
  return Object.keys(MOCK_STREAK_STEPS_BY_DATE)
    .filter((k) => k.startsWith(prefix))
    .sort();
}

export function maxStepsInMonth(ctx: AchievementMonthContext = activeAchievementMonth()): number {
  const keys = dateKeysInMonth(ctx);
  const fromMock = keys.map((k) => stepsForDateKey(k));
  const today = getLocalTodayParts();
  const todayKey = `${achievementMonthKey(ctx)}-${String(today.day).padStart(2, '0')}`;
  const todaySteps =
    today.year === ctx.year && today.month === ctx.month ? stepsForDateKey(todayKey) : 0;
  return Math.max(0, ...fromMock, todaySteps);
}

export function totalStepsInMonth(ctx: AchievementMonthContext = activeAchievementMonth()): number {
  return dateKeysInMonth(ctx).reduce((sum, k) => sum + stepsForDateKey(k), 0);
}

export function streakGoalDaysInMonth(
  ctx: AchievementMonthContext = activeAchievementMonth(),
  dailyStepGoal: number = DEFAULT_DAILY_STEP_GOAL,
): number {
  return dateKeysInMonth(ctx).filter((k) => isStreakDayComplete(stepsForDateKey(k), dailyStepGoal))
    .length;
}

export function daysWithStepsAtLeastInMonth(
  minSteps: number,
  ctx: AchievementMonthContext = activeAchievementMonth(),
): number {
  return dateKeysInMonth(ctx).filter((k) => stepsForDateKey(k) >= minSteps).length;
}

export function longestStreakRunInMonth(
  ctx: AchievementMonthContext = activeAchievementMonth(),
  dailyStepGoal: number = DEFAULT_DAILY_STEP_GOAL,
): number {
  const weeks = buildMonthGrid(ctx.year, ctx.month);
  return computeLongestStreakInMonth(weeks, dailyStepGoal);
}

/** Rotates flavor copy every month (same difficulty, fresh names). */
export function monthlyChallengeTheme(ctx: AchievementMonthContext = activeAchievementMonth()): {
  tag: string;
  blurb: string;
} {
  const themes = [
    { tag: 'Endurance', blurb: 'Long walks and steady streaks this month.' },
    { tag: 'Discipline', blurb: 'Hit your step goal on more days this month.' },
    { tag: 'Balance', blurb: 'Steps, water, and consistency together.' },
  ];
  const index = (ctx.year * 12 + ctx.month - 1) % themes.length;
  return themes[index] ?? themes[0];
}

export function formatProgress(current: number, target: number): string {
  return `${Math.min(current, target).toLocaleString()} / ${target.toLocaleString()}`;
}
