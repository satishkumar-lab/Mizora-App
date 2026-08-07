import type { AppBrandId } from '@/components/icons/AppBrandIcon';
import type { RewardAppItem } from '@/constants/unlockRewards';
import { isStreakDayComplete } from '@/lib/streakCalendar';
import { DEFAULT_DAILY_STEP_GOAL } from '@/lib/steps-preferences';
import { formatStepShort } from '@/constants/unlockRewards';

export type HomeInsightSegment = {
  before: string;
  emphasis: string;
  after: string;
};

export type LockSuggestion = {
  appId: AppBrandId;
  name: string;
  reason: string;
};

const LOCK_PRIORITY: AppBrandId[] = ['instagram', 'youtube', 'snapchat', 'whatsapp'];

export function buildLockSuggestions(
  configs: { id: AppBrandId; name: string; lockEnabled?: boolean }[],
  max = 2,
): LockSuggestion[] {
  return configs
    .filter((c) => c.lockEnabled === false)
    .sort((a, b) => LOCK_PRIORITY.indexOf(a.id) - LOCK_PRIORITY.indexOf(b.id))
    .slice(0, max)
    .map((c) => ({
      appId: c.id,
      name: c.name,
      reason: 'Add a small step or water challenge before you open it.',
    }));
}

type HomeInsightInput = {
  todaySteps: number;
  stepGoal: number;
  waterLoggedMl: number;
  waterGoalMl: number;
  unlockApps: RewardAppItem[];
};

function closestUnlockApp(apps: RewardAppItem[]): RewardAppItem | undefined {
  let best: RewardAppItem | undefined;
  let bestRatio = -1;
  for (const app of apps) {
    if (app.unlocked || app.goalComplete) continue;
    const ratio =
      app.challenge.kind === 'steps'
        ? app.challenge.earnedSteps / Math.max(app.challenge.goalSteps, 1)
        : app.challenge.currentMl / Math.max(app.challenge.goalMl, 1);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = app;
    }
  }
  return best;
}

/** Water-only or access nudge — no step counts when live tracking is off. */
export function buildHomeInsightWithoutLiveSteps(input: {
  waterLoggedMl: number;
  waterGoalMl: number;
}): HomeInsightSegment {
  const { waterLoggedMl, waterGoalMl } = input;
  const waterPct = waterGoalMl > 0 ? waterLoggedMl / waterGoalMl : 0;
  if (waterPct < 0.45 && waterGoalMl - waterLoggedMl >= 400) {
    return {
      before: `Hydration check: `,
      emphasis: `${Math.round((1 - waterPct) * 100)}%`,
      after: ' of your water goal is still open today.',
    };
  }

  return {
    before: 'Step tracking isn’t on yet — tap ',
    emphasis: 'Enable Motion access',
    after: ' in Health Overview when you’re ready. Water and goals are still here for you.',
  };
}

/** On-device insight — no medical claims; user can turn off in settings. */
export function buildHomeInsight(input: HomeInsightInput): HomeInsightSegment {
  const { todaySteps, stepGoal, waterLoggedMl, waterGoalMl, unlockApps } = input;

  const unlockCandidate = closestUnlockApp(unlockApps);
  if (unlockCandidate && unlockCandidate.challenge.kind === 'steps') {
    const left = Math.max(
      0,
      unlockCandidate.challenge.goalSteps - unlockCandidate.challenge.earnedSteps,
    );
    if (left > 0 && left <= unlockCandidate.challenge.goalSteps * 0.4) {
      return {
        before: `About `,
        emphasis: formatStepShort(left),
        after: ` steps left to unlock ${unlockCandidate.name} — you've got this.`,
      };
    }
  }

  if (unlockCandidate && unlockCandidate.challenge.kind === 'water') {
    const left = Math.max(
      0,
      unlockCandidate.challenge.goalMl - unlockCandidate.challenge.currentMl,
    );
    if (left > 0 && left <= unlockCandidate.challenge.goalMl * 0.4) {
      return {
        before: `Log `,
        emphasis: `${left} ml`,
        after: ` more water to unlock ${unlockCandidate.name}.`,
      };
    }
  }

  const stepPct = stepGoal > 0 ? todaySteps / stepGoal : 0;
  if (stepPct >= 0.75 && stepPct < 1) {
    const left = Math.max(0, stepGoal - todaySteps);
    return {
      before: `You're `,
      emphasis: `${Math.round(stepPct * 100)}%`,
      after: ` of the way to your step goal — ${formatStepShort(left)} to go.`,
    };
  }

  if (stepPct >= 1) {
    return {
      before: `Daily step goal hit — `,
      emphasis: 'nice work',
      after: '. Keep momentum or treat yourself to an earned unlock.',
    };
  }

  const waterPct = waterGoalMl > 0 ? waterLoggedMl / waterGoalMl : 0;
  if (waterPct < 0.45 && waterGoalMl - waterLoggedMl >= 400) {
    return {
      before: `Hydration check: `,
      emphasis: `${Math.round((1 - waterPct) * 100)}%`,
      after: ' of your water goal is still open today.',
    };
  }

  if (
    todaySteps > 0 &&
    !isStreakDayComplete(todaySteps, stepGoal) &&
    todaySteps >= stepGoal * 0.5
  ) {
    const left = stepGoal - todaySteps;
    return {
      before: `A `,
      emphasis: formatStepShort(left),
      after: `-step push keeps your streak day on track.`,
    };
  }

  if (unlockApps.length === 0) {
    return {
      before: `Try locking one app with a `,
      emphasis: 'small challenge',
      after: ' — you choose the goal, Mizora keeps it fair.',
    };
  }

  return {
    before: `Small walks add up — `,
    emphasis: 'even 500 steps',
    after: ' toward an unlock beats endless scrolling.',
  };
}
