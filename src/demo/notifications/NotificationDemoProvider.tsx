import { useRouter } from 'expo-router';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { View } from 'react-native';

import { MOCK_NOTIFICATION_FEED, type NotificationFeedItem } from '@/constants/notifications';
import { NotificationInAppBanner } from '@/demo/notifications/NotificationInAppBanner';
import {
  NOTIFICATION_DEMO_EVENTS,
  type NotificationDemoEventId,
  type NotificationDemoEventSpec,
} from '@/demo/notifications/notificationDemoCatalog';
import { demoSectionForCreatedAt, formatDemoTimeAgo } from '@/demo/notifications/formatDemoTimeAgo';

const BANNER_VISIBLE_MS = 4500;

type StoredDemoItem = NotificationFeedItem & { createdAtMs: number };

type NotificationDemoContextValue = {
  isActive: boolean;
  feed: NotificationFeedItem[];
  weeklyReportActive: boolean;
  weeklyReportUnread: boolean;
  markWeeklyReportRead: () => void;
  simulate: (eventId: NotificationDemoEventId) => void;
  clearAll: () => void;
  markRead: (id: string) => void;
  isRead: (id: string) => boolean;
};

const NotificationDemoContext = createContext<NotificationDemoContextValue | null>(null);

function buildFeedItem(spec: NotificationDemoEventSpec, nowMs: number): StoredDemoItem {
  const ageMs = spec.simulatedAgeMs ?? 0;
  const createdAtMs = nowMs - ageMs;
  const id = `demo-${spec.id}-${nowMs}-${Math.random().toString(36).slice(2, 7)}`;

  return {
    id,
    section: spec.section ?? demoSectionForCreatedAt(createdAtMs, nowMs),
    headline: spec.headline,
    categoryLabel: spec.categoryLabel,
    timeAgo: formatDemoTimeAgo(createdAtMs, nowMs),
    variant: spec.variant,
    unread: true,
    createdAtMs,
  };
}

function NotificationDemoProviderInner({ children }: PropsWithChildren) {
  const router = useRouter();
  const [items, setItems] = useState<StoredDemoItem[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  const [weeklyReportActive, setWeeklyReportActive] = useState(false);
  const [weeklyReportUnread, setWeeklyReportUnread] = useState(false);
  const [bannerItem, setBannerItem] = useState<NotificationFeedItem | null>(null);
  const bannerQueueRef = useRef<NotificationFeedItem[]>([]);
  const isShowingBannerRef = useRef(false);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearDismissTimer = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  const showNextBannerRef = useRef<() => void>(() => {});

  const showNextBanner = useCallback(() => {
    const next = bannerQueueRef.current.shift();
    if (!next) {
      isShowingBannerRef.current = false;
      setBannerItem(null);
      return;
    }
    isShowingBannerRef.current = true;
    setBannerItem(next);
    clearDismissTimer();
    dismissTimerRef.current = setTimeout(() => {
      setBannerItem(null);
      dismissTimerRef.current = setTimeout(() => showNextBannerRef.current(), 200);
    }, BANNER_VISIBLE_MS);
  }, [clearDismissTimer]);

  useEffect(() => {
    showNextBannerRef.current = showNextBanner;
  }, [showNextBanner]);

  const enqueueBanner = useCallback(
    (item: NotificationFeedItem) => {
      bannerQueueRef.current.push(item);
      if (!isShowingBannerRef.current) showNextBanner();
    },
    [showNextBanner],
  );

  useEffect(() => () => clearDismissTimer(), [clearDismissTimer]);

  const simulate = useCallback(
    (eventId: NotificationDemoEventId) => {
      const spec = NOTIFICATION_DEMO_EVENTS.find((e) => e.id === eventId);
      if (!spec) return;
      const nowMs = Date.now();
      const entry = buildFeedItem(spec, nowMs);
      const { createdAtMs: _c, ...feedItem } = entry;

      if (eventId === 'weekly_summary') {
        setWeeklyReportActive(true);
        setWeeklyReportUnread(true);
        enqueueBanner(feedItem);
        return;
      }

      setItems((prev) => [entry, ...prev]);
      enqueueBanner(feedItem);
    },
    [enqueueBanner],
  );

  const markWeeklyReportRead = useCallback(() => {
    setWeeklyReportUnread(false);
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    setReadIds(new Set());
    setWeeklyReportActive(false);
    setWeeklyReportUnread(false);
    bannerQueueRef.current = [];
    isShowingBannerRef.current = false;
    clearDismissTimer();
    setBannerItem(null);
  }, [clearDismissTimer]);

  const markRead = useCallback((id: string) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const isRead = useCallback((id: string) => readIds.has(id), [readIds]);

  const openFromBanner = useCallback(
    (id: string) => {
      clearDismissTimer();
      bannerQueueRef.current = [];
      isShowingBannerRef.current = false;
      setBannerItem(null);
      void id;
      router.push('/notifications');
    },
    [clearDismissTimer, router],
  );

  const feed = useMemo(
    () =>
      items.map(({ createdAtMs: _c, ...row }) => ({
        ...row,
        unread: !readIds.has(row.id),
      })),
    [items, readIds],
  );

  const value = useMemo<NotificationDemoContextValue>(
    () => ({
      isActive: items.length > 0 || weeklyReportActive,
      feed,
      weeklyReportActive,
      weeklyReportUnread,
      markWeeklyReportRead,
      simulate,
      clearAll,
      markRead,
      isRead,
    }),
    [
      clearAll,
      feed,
      isRead,
      items.length,
      markRead,
      markWeeklyReportRead,
      simulate,
      weeklyReportActive,
      weeklyReportUnread,
    ],
  );

  return (
    <NotificationDemoContext.Provider value={value}>
      <View style={{ flex: 1 }}>{children}</View>
      {bannerItem ? (
        <NotificationInAppBanner
          item={bannerItem}
          onPress={() => openFromBanner(bannerItem.id)}
          onDismiss={() => {
            clearDismissTimer();
            setBannerItem(null);
            isShowingBannerRef.current = false;
            showNextBanner();
          }}
        />
      ) : null}
    </NotificationDemoContext.Provider>
  );
}

export function NotificationDemoProvider({ children }: PropsWithChildren) {
  if (!__DEV__) return children;
  return <NotificationDemoProviderInner>{children}</NotificationDemoProviderInner>;
}

export function useNotificationDemo(): NotificationDemoContextValue | null {
  const ctx = useContext(NotificationDemoContext);
  if (!__DEV__) return null;
  return ctx;
}

/** Dev demo inbox when populated; otherwise production mock feed (empty). */
export function useNotificationInboxForScreen(): {
  feed: NotificationFeedItem[];
  isDemo: boolean;
  markRead: (id: string) => void;
  isRead: (id: string) => boolean;
  weeklyReportActive: boolean;
  weeklyReportUnread: boolean;
  markWeeklyReportRead: () => void;
} {
  const demo = useNotificationDemo();

  if (demo && (demo.feed.length > 0 || demo.weeklyReportActive)) {
    return {
      feed: demo.feed,
      isDemo: true,
      markRead: demo.markRead,
      isRead: demo.isRead,
      weeklyReportActive: demo.weeklyReportActive,
      weeklyReportUnread: demo.weeklyReportUnread,
      markWeeklyReportRead: demo.markWeeklyReportRead,
    };
  }

  return {
    feed: MOCK_NOTIFICATION_FEED,
    isDemo: false,
    markRead: () => {},
    isRead: () => false,
    weeklyReportActive: false,
    weeklyReportUnread: false,
    markWeeklyReportRead: () => {},
  };
}
