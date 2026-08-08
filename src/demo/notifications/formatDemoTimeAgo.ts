import type { NotificationFeedSection } from '@/constants/notifications';

const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export function demoSectionForCreatedAt(
  createdAtMs: number,
  nowMs = Date.now(),
): NotificationFeedSection {
  const created = new Date(createdAtMs);
  const now = new Date(nowMs);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfCreated = new Date(
    created.getFullYear(),
    created.getMonth(),
    created.getDate(),
  ).getTime();

  if (startOfCreated >= startOfToday) return 'today';
  return 'yesterday';
}

/** Production-style relative labels for the inbox row. */
export function formatDemoTimeAgo(createdAtMs: number, nowMs = Date.now()): string {
  const delta = Math.max(0, nowMs - createdAtMs);

  if (delta < 45 * 1000) return 'Just now';
  if (delta < HOUR) {
    const mins = Math.max(1, Math.round(delta / MIN));
    return mins === 1 ? '1 min ago' : `${mins} min ago`;
  }
  if (delta < DAY) {
    const hours = Math.max(1, Math.round(delta / HOUR));
    return hours === 1 ? '1 hr ago' : `${hours} hr ago`;
  }

  const section = demoSectionForCreatedAt(createdAtMs, nowMs);
  return section === 'today' ? 'Today' : 'Yesterday';
}
