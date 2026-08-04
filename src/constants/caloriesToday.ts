import { STEPS_TODAY } from '@/constants/stepsToday';
import { activeCaloriesFromSteps } from '@/lib/calories-estimate';

/** Active kcal from today’s steps (what Mizora tracks). */
export function todayActiveCaloriesFromSteps(): number {
  return activeCaloriesFromSteps(STEPS_TODAY.steps);
}

/** Active kcal difference vs yesterday’s step count. */
export function activeCaloriesVsYesterday(): number {
  const todaySteps = STEPS_TODAY.steps;
  const yesterdaySteps = Math.max(0, todaySteps - STEPS_TODAY.vsYesterday);
  return activeCaloriesFromSteps(todaySteps) - activeCaloriesFromSteps(yesterdaySteps);
}

export function weekActiveCaloriesFromSteps(): {
  weekday: string;
  kcal: number;
  isToday: boolean;
}[] {
  return STEPS_TODAY.week.map((day) => ({
    weekday: day.weekday,
    kcal: activeCaloriesFromSteps(day.steps),
    isToday: day.isToday,
  }));
}
