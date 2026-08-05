import type { AppBrandId } from '@/components/icons/AppBrandIcon';

export type StepsChallengeConfig = {
  kind: 'steps';
  goalSteps: number;
};

export type WaterChallengeConfig = {
  kind: 'water';
  goalMl: number;
};

export type UnlockChallengeConfig = StepsChallengeConfig | WaterChallengeConfig;

/** User-editable unlock rule per app (progress computed from today's tracking). */
export type UnlockAppConfig = {
  id: AppBrandId;
  name: string;
  challenge: UnlockChallengeConfig;
  /** When false, app is not locked / not counted toward daily limit. */
  lockEnabled?: boolean;
  /** User chose to lock again today despite completing the challenge. */
  userLockedToday?: boolean;
  /** Daily steps when this challenge started (lock on or goal edit). */
  stepsProgressBaseline?: number;
  /** Water logged (ml) when this challenge started. */
  waterProgressBaselineMl?: number;
};

export const MAX_LOCKED_APPS_PER_DAY = 3;

export type StepsChallenge = StepsChallengeConfig & {
  progress: number;
  /** Steps toward this challenge since baseline. */
  earnedSteps: number;
};

export type WaterChallenge = WaterChallengeConfig & {
  /** Water toward this challenge since baseline (ml). */
  currentMl: number;
};

export type RewardAppItem = {
  id: AppBrandId;
  name: string;
  /** Challenge target met for today. */
  goalComplete: boolean;
  /** User can open the app (goal met and not self-locked). */
  unlocked: boolean;
  userLockedToday: boolean;
  challenge: StepsChallenge | WaterChallenge;
};

export const STEP_UNLOCK_STEP = 250;
export const STEP_UNLOCK_MIN = 500;
export const STEP_UNLOCK_MAX = 25_000;

export const UNLOCK_WATER_STEP_ML = 500;
export const UNLOCK_WATER_MIN_ML = 500;
export const UNLOCK_WATER_MAX_ML = 5000;

export const UNLOCK_APP_CONFIGS: UnlockAppConfig[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    lockEnabled: true,
    challenge: { kind: 'steps', goalSteps: 1500 },
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    lockEnabled: true,
    challenge: { kind: 'steps', goalSteps: 2000 },
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    lockEnabled: true,
    challenge: { kind: 'water', goalMl: 2000 },
  },
  {
    id: 'youtube',
    name: 'YouTube',
    lockEnabled: false,
    challenge: { kind: 'steps', goalSteps: 2000 },
  },
];

/** Mock daily screen time — replace with OS Screen Time / Usage Stats when permitted. */
export const MOCK_DAILY_SCREEN_MINUTES: Record<AppBrandId, number> = {
  instagram: 0,
  youtube: 0,
  whatsapp: 0,
  snapchat: 0,
};

export function isAppLockEnabled(config: UnlockAppConfig): boolean {
  return config.lockEnabled !== false;
}

export function stepsEarnedTowardChallenge(config: UnlockAppConfig, stepsToday: number): number {
  const baseline = config.stepsProgressBaseline ?? 0;
  return Math.max(0, stepsToday - baseline);
}

export function waterEarnedTowardChallenge(config: UnlockAppConfig, waterLoggedMl: number): number {
  const baseline = config.waterProgressBaselineMl ?? 0;
  return Math.max(0, waterLoggedMl - baseline);
}

/** Reset progress baseline to “now” when user starts or edits a challenge. */
export function snapshotChallengeBaselines(
  config: UnlockAppConfig,
  stepsToday: number,
  waterLoggedMl: number,
): Pick<UnlockAppConfig, 'stepsProgressBaseline' | 'waterProgressBaselineMl'> {
  if (config.challenge.kind === 'steps') {
    return { stepsProgressBaseline: stepsToday, waterProgressBaselineMl: undefined };
  }
  return { waterProgressBaselineMl: waterLoggedMl, stepsProgressBaseline: undefined };
}

/** Locked apps without a baseline get one at current totals so UI starts locked/in-progress. */
export function ensureChallengeBaselines(
  configs: UnlockAppConfig[],
  stepsToday: number,
  waterLoggedMl: number,
): UnlockAppConfig[] {
  return configs.map((c) => {
    if (!isAppLockEnabled(c)) return c;
    if (c.challenge.kind === 'steps' && c.stepsProgressBaseline === undefined) {
      return { ...c, stepsProgressBaseline: stepsToday };
    }
    if (c.challenge.kind === 'water' && c.waterProgressBaselineMl === undefined) {
      return { ...c, waterProgressBaselineMl: waterLoggedMl };
    }
    return c;
  });
}

export function clampStepUnlockGoal(steps: number): number {
  const stepped = Math.round(steps / STEP_UNLOCK_STEP) * STEP_UNLOCK_STEP;
  return Math.min(STEP_UNLOCK_MAX, Math.max(STEP_UNLOCK_MIN, stepped));
}

export function clampUnlockWaterGoalMl(ml: number): number {
  const stepped = Math.round(ml / UNLOCK_WATER_STEP_ML) * UNLOCK_WATER_STEP_ML;
  return Math.min(UNLOCK_WATER_MAX_ML, Math.max(UNLOCK_WATER_MIN_ML, stepped));
}

export function buildRewardAppItem(
  config: UnlockAppConfig,
  stepsToday: number,
  waterLoggedMl: number,
): RewardAppItem {
  const userLockedToday = config.userLockedToday ?? false;

  if (config.challenge.kind === 'steps') {
    const goalSteps = config.challenge.goalSteps;
    const earnedSteps = stepsEarnedTowardChallenge(config, stepsToday);
    const progress = Math.min(1, earnedSteps / Math.max(goalSteps, 1));
    const goalComplete = earnedSteps >= goalSteps;
    return {
      id: config.id,
      name: config.name,
      goalComplete,
      userLockedToday,
      unlocked: goalComplete && !userLockedToday,
      challenge: { kind: 'steps', goalSteps, progress, earnedSteps },
    };
  }

  const goalMl = config.challenge.goalMl;
  const currentMl = waterEarnedTowardChallenge(config, waterLoggedMl);
  const goalComplete = currentMl >= goalMl;
  return {
    id: config.id,
    name: config.name,
    goalComplete,
    userLockedToday,
    unlocked: goalComplete && !userLockedToday,
    challenge: { kind: 'water', goalMl, currentMl },
  };
}

export function challengeProgressRatio(challenge: StepsChallenge | WaterChallenge): number {
  if (challenge.kind === 'steps') {
    return Math.min(1, challenge.progress);
  }
  return Math.min(1, challenge.currentMl / Math.max(challenge.goalMl, 1));
}

export function formatStepShort(steps: number): string {
  if (steps >= 1000) {
    const k = steps / 1000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(1).replace(/\.0$/, '')}K`;
  }
  return steps.toLocaleString();
}

export function formatGoalLiters(ml: number): string {
  if (ml >= 1000 && ml % 1000 === 0) {
    return `${ml / 1000}L`;
  }
  return `${ml}ml`;
}
