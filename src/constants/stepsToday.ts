import type { AppBrandId } from '@/components/icons/AppBrandIcon';

/** Mock today snapshot — replace with Health API when wired */
export const STEPS_TODAY = {
  steps: 3245,
  goal: 10_000,
  distanceKm: 2.1,
  activeMinutes: 28,
  vsYesterday: 420,
  peakHourLabel: '12 PM',
  hourlyHeights: [9.141, 13.707, 7.309, 20.104, 31.997, 18.281, 10.964, 25.59, 16.45],
  week: [
    { weekday: 'Mon', day: '04', steps: 8200, isToday: false, streak: false },
    { weekday: 'Tue', day: '05', steps: 9100, isToday: false, streak: true },
    { weekday: 'Wed', day: '06', steps: 7800, isToday: false, streak: false },
    { weekday: 'Thu', day: '07', steps: 3245, isToday: true, streak: false },
    { weekday: 'Fri', day: '08', steps: 0, isToday: false, streak: false },
    { weekday: 'Sat', day: '09', steps: 0, isToday: false, streak: false },
    { weekday: 'Sun', day: '10', steps: 0, isToday: false, streak: false },
  ],
} as const;

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
  progressSteps: 3245,
  unlockMinutes: 30,
};

export function stepsRemainingToGoal(steps: number, goal: number): number {
  return Math.max(goal - steps, 0);
}

export function stepsRemainingForUnlock(unlock: ActiveStepUnlock): number {
  return Math.max(unlock.challengeSteps - unlock.progressSteps, 0);
}
