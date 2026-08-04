/** In-app notification feed — what users see in the bell tab. */
export type NotificationFeedVariant =
  'walk_nudge' | 'milestone' | 'streak' | 'unlock' | 'challenge';

export type NotificationFeedSection = 'today' | 'yesterday';

export type NotificationFeedItem = {
  id: string;
  section: NotificationFeedSection;
  headline: string;
  categoryLabel: string;
  timeAgo: string;
  variant: NotificationFeedVariant;
  /** Unread — lime ring on icon */
  unread?: boolean;
};

export const NOTIFICATION_FEED_SECTION_LABEL: Record<NotificationFeedSection, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
};

/** Sample feed — maps to PRD notification types (helpful, capped, no guilt). */
export const MOCK_NOTIFICATION_FEED: NotificationFeedItem[] = [
  {
    id: 't1',
    section: 'today',
    headline: "You've been sitting for 1 hour — inactive for too long.",
    categoryLabel: 'Time for a short walk!',
    timeAgo: '13min',
    variant: 'walk_nudge',
    unread: true,
  },
  {
    id: 't2',
    section: 'today',
    headline: 'Congrats! You reached 10,000 steps today.',
    categoryLabel: 'Celebrates milestones',
    timeAgo: '16min',
    variant: 'milestone',
    unread: true,
  },
  {
    id: 't3',
    section: 'today',
    headline: 'Morning walks help you stay consistent. Ready to go?',
    categoryLabel: 'Streak reminder',
    timeAgo: '23min',
    variant: 'streak',
  },
  {
    id: 't4',
    section: 'today',
    headline: 'WhatsApp is ready — you earned it with 2,400 steps.',
    categoryLabel: 'App unlock ready',
    timeAgo: '1h',
    variant: 'unlock',
  },
  {
    id: 'y1',
    section: 'yesterday',
    headline: "You're 800 steps from unlocking Instagram today.",
    categoryLabel: 'Challenge reminder',
    timeAgo: '6:40 PM',
    variant: 'challenge',
  },
  {
    id: 'y2',
    section: 'yesterday',
    headline: 'Nice walk — Snapchat unlocked until 8:30 PM.',
    categoryLabel: 'Challenge completed',
    timeAgo: '5:15 PM',
    variant: 'milestone',
  },
  {
    id: 'y3',
    section: 'yesterday',
    headline: '1,800 steps left to protect your 4-day streak.',
    categoryLabel: 'Streak reminder',
    timeAgo: '8:10 PM',
    variant: 'streak',
  },
];

export const NOTIFICATION_QUIET_HOURS_LABEL = '10:00 PM – 8:00 AM';
export const NOTIFICATION_DAILY_CAP = '2–3';
