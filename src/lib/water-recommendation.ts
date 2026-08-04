/** Daily water goal bounds (user-adjustable on tracker; profile-driven later). */
export const WATER_GOAL_STEP_ML = 500;
export const WATER_GOAL_MIN_ML = 1500;
export const WATER_GOAL_MAX_ML = 5000;

export type WaterActivityLevel = 'low' | 'moderate' | 'high';

/** Filled from Settings later — not collected on the tracker screen. */
export type WaterProfileInput = {
  weightKg?: number;
  heightCm?: number;
  ageYears?: number;
  activityLevel?: WaterActivityLevel;
};

export function clampWaterGoalMl(ml: number): number {
  const stepped = Math.round(ml / WATER_GOAL_STEP_ML) * WATER_GOAL_STEP_ML;
  return Math.min(WATER_GOAL_MAX_ML, Math.max(WATER_GOAL_MIN_ML, stepped));
}

/** Whole liters: `3` — fractional: `2.5` (no trailing `.0`). */
export function formatLitersValueFromMl(ml: number): string {
  const liters = ml / 1000;
  const roundedTenth = Math.round(liters * 10) / 10;
  if (Number.isInteger(roundedTenth)) {
    return String(roundedTenth);
  }
  return roundedTenth.toFixed(1);
}

export function formatLitersFromMl(ml: number, digits = 1): string {
  if (digits === 1) {
    return `${formatLitersValueFromMl(ml)} L`;
  }
  return `${(ml / 1000).toFixed(digits)} L`;
}

/**
 * Personalized daily target (ml). Returns null until profile has at least weight.
 * Baseline ~33 ml/kg + activity bump — conservative, not medical advice.
 */
export function recommendedDailyWaterMl(
  profile: WaterProfileInput | null | undefined,
): number | null {
  if (!profile?.weightKg || profile.weightKg <= 0) return null;

  let ml = profile.weightKg * 33;

  switch (profile.activityLevel) {
    case 'moderate':
      ml += 500;
      break;
    case 'high':
      ml += 1000;
      break;
    default:
      break;
  }

  return clampWaterGoalMl(ml);
}

export type HydrationBannerCopy = {
  before: string;
  highlight: string;
  after: string;
};

/** One-line insight for the home-style banner on the water screen. */
export function hydrationBannerCopy(
  goalMl: number,
  profile?: WaterProfileInput | null,
): HydrationBannerCopy {
  const recommended = recommendedDailyWaterMl(profile ?? null);

  if (recommended != null) {
    return {
      before: 'Mizora suggests about ',
      highlight: formatLitersFromMl(recommended),
      after: ` — your target is ${formatLitersFromMl(goalMl)}.`,
    };
  }

  return {
    before: 'Many adults start around ',
    highlight: '2–2.5 L',
    after: ' — tune Daily target to match you.',
  };
}
