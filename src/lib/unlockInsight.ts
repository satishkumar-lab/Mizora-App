import type { Ionicons } from '@expo/vector-icons';

import { challengeProgressRatio, type RewardAppItem } from '@/constants/unlockRewards';

export type UnlockInsightPhase = 'notStarted' | 'inProgress' | 'done';

export type UnlockInsightPayload = {
  phase: UnlockInsightPhase;
  borderVariant: 'softRed' | 'amber' | 'lime';
  icon: keyof typeof Ionicons.glyphMap;
  before: string;
  highlight: string;
  after: string;
};

export function unlockInsightForApp(app: RewardAppItem): UnlockInsightPayload {
  if (app.unlocked) {
    return {
      phase: 'done',
      borderVariant: 'lime',
      icon: 'checkmark-circle-outline',
      before: 'Challenge done — ',
      highlight: app.name,
      after: ' is open today. Lock again anytime.',
    };
  }

  if (app.goalComplete && app.userLockedToday) {
    return {
      phase: 'done',
      borderVariant: 'lime',
      icon: 'lock-closed-outline',
      before: 'Goal met. ',
      highlight: app.name,
      after: " is locked — unlock when you're ready.",
    };
  }

  const ratio = challengeProgressRatio(app.challenge);

  if (ratio <= 0) {
    const action = app.challenge.kind === 'steps' ? 'Start moving' : 'Log your first water';
    return {
      phase: 'notStarted',
      borderVariant: 'softRed',
      icon: 'alert-circle-outline',
      before: `${action} to unlock `,
      highlight: app.name,
      after: ' today.',
    };
  }

  const challenge = app.challenge;
  const halfway = ratio >= 0.5;

  if (challenge.kind === 'steps') {
    const left = challenge.goalSteps - challenge.earnedSteps;
    return {
      phase: 'inProgress',
      borderVariant: 'amber',
      icon: 'walk-outline',
      before: halfway ? 'Halfway there — ' : 'Good start — ',
      highlight: `${left.toLocaleString()} steps`,
      after: ` left to unlock ${app.name}.`,
    };
  }

  const leftMl = challenge.goalMl - challenge.currentMl;
  return {
    phase: 'inProgress',
    borderVariant: 'amber',
    icon: 'water-outline',
    before: halfway ? 'Halfway there — ' : 'Good start — ',
    highlight: `${leftMl}ml`,
    after: ` left to unlock ${app.name}.`,
  };
}

/** @deprecated use unlockInsightForApp */
export function unlockInsightCopy(app: RewardAppItem): {
  before: string;
  highlight: string;
  after: string;
} {
  const { before, highlight, after } = unlockInsightForApp(app);
  return { before, highlight, after };
}
