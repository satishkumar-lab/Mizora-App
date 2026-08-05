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

/** Empty until real notification events are stored. */
export const MOCK_NOTIFICATION_FEED: NotificationFeedItem[] = [];

export const NOTIFICATION_QUIET_HOURS_LABEL = '10:00 PM – 8:00 AM';
export const NOTIFICATION_DAILY_CAP = '2–3';
