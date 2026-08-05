import { buildRollingWeekDays } from '@/lib/localDate';
import { formatLitersValueFromMl, WATER_GOAL_MIN_ML } from '@/lib/water-recommendation';

/** Glass size for quick log UI */
export const ML_PER_GLASS = 250;

function buildWaterWeek() {
  return buildRollingWeekDays().map((row) => ({
    ...row,
    glasses: 0,
    streak: false as boolean | undefined,
  }));
}

export const WATER_TODAY = {
  glassesLogged: 0,
  glassGoal: Math.round(WATER_GOAL_MIN_ML / ML_PER_GLASS),
  mlPerGlass: ML_PER_GLASS,
  vsYesterdayGlasses: 0,
  hourlyMl: Array.from({ length: 24 }, () => 0),
  week: buildWaterWeek(),
} as const;

export function waterMlFromGlasses(glasses: number): number {
  return glasses * ML_PER_GLASS;
}

export function todayWaterMl(): number {
  return waterMlFromGlasses(WATER_TODAY.glassesLogged);
}

export function todayWaterGoalMl(): number {
  return waterMlFromGlasses(WATER_TODAY.glassGoal);
}

/** Home Health Overview — liters, synced with Water Tracker. */
export function formatHomeWaterDisplay(
  loggedMl: number,
  goalMl: number,
): { value: string; unit: 'L' } {
  return {
    value: `${formatLitersValueFromMl(loggedMl)}/${formatLitersValueFromMl(goalMl)}`,
    unit: 'L',
  };
}

/** @deprecated Use `useWaterIntake().homeDisplay` for live totals. */
export function homeWaterTrackerDisplay(): { value: string; unit: 'L' } {
  return formatHomeWaterDisplay(todayWaterMl(), todayWaterGoalMl());
}
