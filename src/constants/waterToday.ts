import { formatLitersValueFromMl } from '@/lib/water-recommendation';

/** Mock water snapshot — replace with storage / Health API */
export const ML_PER_GLASS = 250;

export const WATER_TODAY = {
  glassesLogged: 8,
  glassGoal: 10,
  mlPerGlass: ML_PER_GLASS,
  vsYesterdayGlasses: 1,
  /** Intake by hour (ml) — 6 AM → 11 PM, index 0 = midnight */
  hourlyMl: [
    0, 0, 0, 0, 0, 0, 250, 0, 250, 250, 0, 250, 250, 0, 250, 250, 250, 250, 0, 0, 0, 0, 0, 0,
  ],
  week: [
    { weekday: 'Mon', day: '04', glasses: 9, isToday: false },
    { weekday: 'Tue', day: '05', glasses: 10, isToday: false, streak: true },
    { weekday: 'Wed', day: '06', glasses: 7, isToday: false },
    { weekday: 'Thu', day: '07', glasses: 8, isToday: true },
    { weekday: 'Fri', day: '08', glasses: 0, isToday: false },
    { weekday: 'Sat', day: '09', glasses: 0, isToday: false },
    { weekday: 'Sun', day: '10', glasses: 0, isToday: false },
  ],
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
