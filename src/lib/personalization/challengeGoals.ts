import {
  clampStepUnlockGoal,
  clampUnlockWaterGoalMl,
  STEP_UNLOCK_STEP,
} from '@/constants/unlockRewards';
import { clampWaterGoalMl } from '@/lib/water-recommendation';

/** ~15–25% of typical daily movement — achievable unlock without blocking the whole day. */
export function recommendStepUnlockGoal(dailyStepGoal: number, avgStepsLast7Days: number): number {
  const anchor = avgStepsLast7Days > 300 ? avgStepsLast7Days : dailyStepGoal;
  const raw = Math.round((anchor * 0.2) / STEP_UNLOCK_STEP) * STEP_UNLOCK_STEP;
  return clampStepUnlockGoal(raw);
}

/** Roughly one large glass toward the user's daily water target. */
export function recommendWaterUnlockGoalMl(dailyWaterGoalMl: number): number {
  const target = dailyWaterGoalMl > 0 ? dailyWaterGoalMl * 0.35 : 2000;
  return clampUnlockWaterGoalMl(clampWaterGoalMl(Math.round(target)));
}

export function averageStepsFromWeek(weekSteps: number[]): number {
  const values = weekSteps.filter((n) => n > 0);
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}
