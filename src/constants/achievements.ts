import { DEFAULT_DAILY_STEP_GOAL } from '@/lib/steps-preferences';
import {
  achievementMonthLabel,
  activeAchievementMonth,
  daysWithStepsAtLeastInMonth,
  formatProgress,
  longestStreakRunInMonth,
  maxStepsInMonth,
  MOCK_MONTHLY_CHALLENGE_PROGRESS,
  monthlyChallengeTheme,
  streakGoalDaysInMonth,
  totalStepsInMonth,
  type AchievementMonthContext,
} from '@/lib/achievementMonth';

export type AchievementIconKind =
  'steps' | 'streak' | 'water' | 'unlock' | 'lock' | 'goal' | 'walk';

export type MonthlyAchievementDefinition = {
  id: string;
  title: string;
  subtitle: string;
  task: string;
  icon: AchievementIconKind;
  accent: string;
  progress: (ctx: AchievementMonthContext) => { current: number; target: number };
};

/** Hard targets — progress counts only the active calendar month. */
const MONTHLY_ACHIEVEMENT_DEFS: MonthlyAchievementDefinition[] = [
  {
    id: 'month-12k-day',
    title: 'Big walk day',
    subtitle: '12K in one day',
    task: 'Walk 12,000 steps on a single day this month',
    icon: 'walk',
    accent: '#e4f6c8',
    progress: (ctx) => ({ current: maxStepsInMonth(ctx), target: 12_000 }),
  },
  {
    id: 'month-18-goal-days',
    title: 'Step goal grind',
    subtitle: '18 days this month',
    task: `Hit your daily step goal on 18 days this month`,
    icon: 'steps',
    accent: '#e4f6c8',
    progress: (ctx) => ({ current: streakGoalDaysInMonth(ctx), target: 18 }),
  },
  {
    id: 'month-10-streak-run',
    title: '10-day streak',
    subtitle: 'Longest run',
    task: 'Reach a 10-day streak run at least once this month',
    icon: 'streak',
    accent: '#fff0d6',
    progress: (ctx) => ({ current: longestStreakRunInMonth(ctx), target: 10 }),
  },
  {
    id: 'month-120k-total',
    title: 'Month step total',
    subtitle: '120K steps',
    task: 'Walk 120,000 total steps before the month ends',
    icon: 'walk',
    accent: '#e4f6c8',
    progress: (ctx) => ({ current: totalStepsInMonth(ctx), target: 120_000 }),
  },
  {
    id: 'month-4x-10k',
    title: 'Four 10K days',
    subtitle: 'On separate days',
    task: 'Log 10,000+ steps on 4 separate days this month',
    icon: 'goal',
    accent: '#f5ffbb',
    progress: (ctx) => ({ current: daysWithStepsAtLeastInMonth(10_000, ctx), target: 4 }),
  },
  {
    id: 'month-full-roster-8',
    title: 'Full app lock',
    subtitle: '8 days, all slots',
    task: 'Fill all 3 lock slots on 8 different days this month',
    icon: 'lock',
    accent: '#f4f6f3',
    progress: () => ({
      current: MOCK_MONTHLY_CHALLENGE_PROGRESS.fullRosterLockDays,
      target: 8,
    }),
  },
  {
    id: 'month-12-unlocks',
    title: 'Rewards',
    subtitle: '12 app unlocks',
    task: 'Complete 12 lock challenges (app unlocks) this month',
    icon: 'unlock',
    accent: '#e4f6c8',
    progress: () => ({
      current: MOCK_MONTHLY_CHALLENGE_PROGRESS.challengeUnlocks,
      target: 12,
    }),
  },
  {
    id: 'month-water-12',
    title: 'Water goal',
    subtitle: '12 days on target',
    task: 'Hit your daily water goal on 12 days this month',
    icon: 'water',
    accent: '#e3f4ff',
    progress: () => ({
      current: MOCK_MONTHLY_CHALLENGE_PROGRESS.waterGoalDays,
      target: 12,
    }),
  },
  {
    id: 'month-15k-day',
    title: 'Epic walk day',
    subtitle: '15K in one day',
    task: 'Crack 15,000 steps in one day this month',
    icon: 'walk',
    accent: '#fff0d6',
    progress: (ctx) => ({ current: maxStepsInMonth(ctx), target: 15_000 }),
  },
  {
    id: 'month-perfect-week',
    title: 'Perfect week',
    subtitle: '7 goal days in a row',
    task: 'Hit streak step goal every day for one full Mon–Sun week this month',
    icon: 'streak',
    accent: '#fff0d6',
    progress: (ctx) => ({ current: longestStreakRunInMonth(ctx) >= 7 ? 1 : 0, target: 1 }),
  },
];

export type ResolvedAchievement = MonthlyAchievementDefinition & {
  unlocked: boolean;
  progressLabel: string;
  monthLabel: string;
};

export function resolveMonthlyAchievements(
  ctx: AchievementMonthContext = activeAchievementMonth(),
  dailyStepGoal: number = DEFAULT_DAILY_STEP_GOAL,
): ResolvedAchievement[] {
  const monthLabel = achievementMonthLabel(ctx);

  return MONTHLY_ACHIEVEMENT_DEFS.map((def) => {
    const { current, target } = achievementProgressForDef(def, ctx, dailyStepGoal);
    const unlocked = current >= target;
    let task = def.task;
    if (def.id === 'month-18-goal-days') {
      task = `Hit ${dailyStepGoal.toLocaleString()}+ steps on 18 days this month`;
    }
    return {
      ...def,
      task,
      unlocked,
      progressLabel: formatProgress(current, target),
      monthLabel,
    };
  });
}

function achievementProgressForDef(
  def: MonthlyAchievementDefinition,
  ctx: AchievementMonthContext,
  dailyStepGoal: number,
): { current: number; target: number } {
  if (def.id === 'month-18-goal-days') {
    return { current: streakGoalDaysInMonth(ctx, dailyStepGoal), target: 18 };
  }
  if (def.id === 'month-10-streak-run') {
    return { current: longestStreakRunInMonth(ctx, dailyStepGoal), target: 10 };
  }
  if (def.id === 'month-perfect-week') {
    return { current: longestStreakRunInMonth(ctx, dailyStepGoal) >= 7 ? 1 : 0, target: 1 };
  }
  return def.progress(ctx);
}

/** Streak home row — four distinct icon types when possible. */
export function achievementPreview(
  ctx: AchievementMonthContext = activeAchievementMonth(),
  dailyStepGoal: number = DEFAULT_DAILY_STEP_GOAL,
): ResolvedAchievement[] {
  const all = resolveMonthlyAchievements(ctx, dailyStepGoal);
  const iconPriority: AchievementIconKind[] = [
    'walk',
    'streak',
    'unlock',
    'water',
    'lock',
    'goal',
    'steps',
  ];

  const picked: ResolvedAchievement[] = [];
  const usedIds = new Set<string>();

  for (const icon of iconPriority) {
    if (picked.length >= 4) break;
    const match = all.find((a) => a.icon === icon && !usedIds.has(a.id));
    if (match) {
      picked.push(match);
      usedIds.add(match.id);
    }
  }

  if (picked.length < 4) {
    for (const a of all) {
      if (picked.length >= 4) break;
      if (usedIds.has(a.id)) continue;
      if (picked.some((p) => p.icon === a.icon)) continue;
      picked.push(a);
      usedIds.add(a.id);
    }
  }

  if (picked.length < 4) {
    for (const a of all) {
      if (picked.length >= 4) break;
      if (!usedIds.has(a.id)) {
        picked.push(a);
        usedIds.add(a.id);
      }
    }
  }

  return picked.slice(0, 4);
}

export function monthlyAchievementsMeta(ctx: AchievementMonthContext = activeAchievementMonth()) {
  const theme = monthlyChallengeTheme(ctx);
  return {
    monthLabel: achievementMonthLabel(ctx),
    themeTag: theme.tag,
    themeBlurb: theme.blurb,
    resetsCopy: 'New set & progress reset on the 1st of each month.',
  };
}
