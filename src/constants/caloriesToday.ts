import { activeCaloriesFromSteps } from '@/lib/calories-estimate';
import { getTodayStepsLive } from '@/lib/steps-live-store';

/** Active kcal from today’s steps (what Mizora tracks). */
export function todayActiveCaloriesFromSteps(steps = getTodayStepsLive()): number {
  return activeCaloriesFromSteps(steps);
}

/** Active kcal difference vs yesterday’s step count. */
export function activeCaloriesVsYesterday(
  todaySteps = getTodayStepsLive(),
  vsYesterdayDelta: number,
): number {
  const yesterdaySteps = Math.max(0, todaySteps - vsYesterdayDelta);
  return activeCaloriesFromSteps(todaySteps) - activeCaloriesFromSteps(yesterdaySteps);
}

export function weekActiveCaloriesFromSteps(
  week: { weekday: string; kcal?: number; steps?: number; isToday: boolean }[],
): { weekday: string; kcal: number; isToday: boolean }[] {
  return week.map((day) => ({
    weekday: day.weekday,
    kcal: activeCaloriesFromSteps('steps' in day && typeof day.steps === 'number' ? day.steps : 0),
    isToday: day.isToday,
  }));
}
