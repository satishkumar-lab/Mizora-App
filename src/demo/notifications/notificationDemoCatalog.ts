import type { NotificationFeedItem, NotificationFeedVariant } from '@/constants/notifications';

export type NotificationDemoEventId =
  | 'welcome'
  | 'daily_goal_complete'
  | 'unlock_ready'
  | 'streak_milestone'
  | 'daily_reminder'
  | 'weekly_summary';

export type NotificationDemoEventSpec = {
  id: NotificationDemoEventId;
  buttonLabel: string;
  description: string;
  variant: NotificationFeedVariant;
  categoryLabel: string;
  headline: string;
  /** Simulated age for preview copy (e.g. "2 min ago") */
  simulatedAgeMs?: number;
  section?: NotificationFeedItem['section'];
};

export const NOTIFICATION_DEMO_EVENTS: NotificationDemoEventSpec[] = [
  {
    id: 'welcome',
    buttonLabel: 'Welcome',
    description: 'First session after onboarding',
    variant: 'milestone',
    categoryLabel: 'Welcome',
    headline: 'Welcome to Mizora — small steps, better days ahead.',
  },
  {
    id: 'daily_goal_complete',
    buttonLabel: 'Daily goal complete',
    description: '100% of daily step goal',
    variant: 'milestone',
    categoryLabel: 'Daily progress',
    headline: 'You hit today’s step goal. Nice work.',
  },
  {
    id: 'unlock_ready',
    buttonLabel: 'Unlock ready',
    description: 'Challenge completed — app unlock available',
    variant: 'unlock',
    categoryLabel: 'Unlock',
    headline: 'Instagram is ready to unlock — you earned it.',
  },
  {
    id: 'streak_milestone',
    buttonLabel: 'Streak milestone',
    description: 'Multi-day streak achieved',
    variant: 'streak',
    categoryLabel: 'Streak',
    headline: '7-day streak — you’re building a real habit.',
  },
  {
    id: 'daily_reminder',
    buttonLabel: 'Daily reminder',
    description: 'Gentle nudge toward today’s goal',
    variant: 'walk_nudge',
    categoryLabel: 'Reminder',
    headline: '800 steps left to hit today’s goal. A short walk helps.',
    simulatedAgeMs: 2 * 60 * 1000,
  },
  {
    id: 'weekly_summary',
    buttonLabel: 'Weekly summary',
    description: 'Shows Weekly report inbox card → health weekly report',
    variant: 'challenge',
    categoryLabel: 'Weekly report',
    headline: 'Your week in motion — steps, water, and peak walk time.',
    section: 'yesterday',
    simulatedAgeMs: 22 * 60 * 60 * 1000,
  },
];
