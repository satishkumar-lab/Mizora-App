import type { OnboardingGender } from '@/components/onboarding/OnboardingGenderSelect';
import { recommendedDailyWaterMl } from '@/lib/water-recommendation';

export type OnboardingRecommendationInput = {
  gender: OnboardingGender;
  heightCm: number;
  weightKg: number;
};

const STEP_MIN = 5_000;
const STEP_MAX = 12_000;
const STEP_ROUND = 500;

/**
 * Heuristic daily step target from onboarding body metrics (not medical advice).
 * Tuned so male/female and height/weight produce visibly different targets.
 */
export function recommendOnboardingDailySteps({
  gender,
  heightCm,
  weightKg,
}: OnboardingRecommendationInput): number {
  let steps = 7_000;
  steps += Math.round((heightCm - 168) * 28);
  steps += gender === 'male' ? 700 : -500;

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  if (bmi >= 28) steps -= 600;
  else if (bmi <= 19) steps += 400;

  steps = Math.round(steps / STEP_ROUND) * STEP_ROUND;
  return Math.min(STEP_MAX, Math.max(STEP_MIN, steps));
}

/** Liters — reuses profile water heuristic (weight + moderate activity bump). */
export function recommendOnboardingDailyWaterLiters(input: OnboardingRecommendationInput): number {
  const ml = recommendedDailyWaterMl({
    weightKg: input.weightKg,
    heightCm: input.heightCm,
    activityLevel: 'moderate',
  });
  if (ml == null) return 2;
  return Math.round((ml / 1000) * 10) / 10;
}

export function formatRecommendationWaterLiters(liters: number): string {
  return `${liters.toFixed(1)} L`;
}

export function formatRecommendationSteps(steps: number): string {
  return steps.toLocaleString('en-US');
}

export function parseOnboardingRecommendationInput(
  gender: OnboardingGender | null,
  heightText: string,
  weightText: string,
): OnboardingRecommendationInput | null {
  if (gender == null) return null;
  const heightCm = parseInt(heightText.trim(), 10);
  const weightKg = parseFloat(weightText.trim().replace(',', '.'));
  if (!Number.isFinite(heightCm) || heightCm < 120 || heightCm > 220) return null;
  if (!Number.isFinite(weightKg) || weightKg < 35 || weightKg > 180) return null;
  return { gender, heightCm, weightKg };
}
