/**
 * Active calories from walking — Mizora only surfaces burn tied to steps.
 *
 * At 70 kg, moderate walking ≈ **0.045 kcal per step** (~45 kcal / 1,000 steps).
 * Scales linearly with body weight until profile is stored.
 */
export const DEFAULT_BODY_WEIGHT_KG = 70;
const KCAL_PER_STEP_AT_70KG = 0.045;

export function kcalPerStep(weightKg: number = DEFAULT_BODY_WEIGHT_KG): number {
  return KCAL_PER_STEP_AT_70KG * (weightKg / DEFAULT_BODY_WEIGHT_KG);
}

export function activeCaloriesFromSteps(
  steps: number,
  weightKg: number = DEFAULT_BODY_WEIGHT_KG,
): number {
  if (steps <= 0) return 0;
  return Math.round(steps * kcalPerStep(weightKg));
}

export function kcalPerThousandSteps(weightKg: number = DEFAULT_BODY_WEIGHT_KG): number {
  return activeCaloriesFromSteps(1000, weightKg);
}

export function activeCaloriesFromHourlySteps(
  hourlySteps: number,
  weightKg: number = DEFAULT_BODY_WEIGHT_KG,
): number {
  return activeCaloriesFromSteps(hourlySteps, weightKg);
}

/** Default calorie ring goal when user has not set an optional calories goal. */
export function defaultActiveCalorieGoalFromStepGoal(stepGoal: number): number {
  return activeCaloriesFromSteps(stepGoal);
}
