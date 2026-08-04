import { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { UNLOCK_IMPACT_HREF } from '@/components/home/MainNav';
import { NotificationFeedSectionCard } from '@/components/notifications/NotificationFeedSectionCard';
import { NotificationHeaderIcon } from '@/components/notifications/NotificationHeaderIcon';
import { WeeklyReportInboxCard } from '@/components/notifications/WeeklyReportInboxCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import {
  MOCK_NOTIFICATION_FEED,
  NOTIFICATION_FEED_SECTION_LABEL,
  type NotificationFeedItem,
  type NotificationFeedSection,
} from '@/constants/notifications';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';

const SECTION_ORDER: NotificationFeedSection[] = ['today', 'yesterday'];

function groupFeedBySection(
  items: NotificationFeedItem[],
): Record<NotificationFeedSection, NotificationFeedItem[]> {
  const grouped: Record<NotificationFeedSection, NotificationFeedItem[]> = {
    today: [],
    yesterday: [],
  };
  for (const item of items) {
    grouped[item.section].push(item);
  }
  return grouped;
}

function initialReadNotificationIds(items: NotificationFeedItem[]): Set<string> {
  return new Set(items.filter((n) => !n.unread).map((n) => n.id));
}

export function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const goBack = useMizoraBack('/home');
  const { isDark } = useMizoraTheme();
  const grouped = groupFeedBySection(MOCK_NOTIFICATION_FEED);

  const [readIds, setReadIds] = useState(() => initialReadNotificationIds(MOCK_NOTIFICATION_FEED));
  const [weeklyReportRead, setWeeklyReportRead] = useState(false);

  const isItemRead = useCallback((id: string) => readIds.has(id), [readIds]);

  const markItemRead = useCallback((id: string) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const unreadTotal = useMemo(() => {
    const feedUnread = MOCK_NOTIFICATION_FEED.filter((n) => n.unread && !readIds.has(n.id)).length;
    const weeklyUnread = weeklyReportRead ? 0 : 1;
    return feedUnread + weeklyUnread;
  }, [readIds, weeklyReportRead]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader
            onBack={goBack}
            title="Notifications"
            rightAccessory={<NotificationHeaderIcon hasUnread={unreadTotal > 0} />}
          />
        </View>

        <ScrollView
          contentContainerClassName="px-5 pb-8"
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: insets.bottom + MAIN_TAB_BAR_CLEARANCE,
            gap: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          <WeeklyReportInboxCard
            read={weeklyReportRead}
            onPress={() => {
              setWeeklyReportRead(true);
              router.push(UNLOCK_IMPACT_HREF);
            }}
          />

          {SECTION_ORDER.map((section) => {
            const rows = grouped[section];
            if (rows.length === 0) return null;

            return (
              <NotificationFeedSectionCard
                key={section}
                title={NOTIFICATION_FEED_SECTION_LABEL[section]}
                items={rows}
                isItemRead={isItemRead}
                onItemPress={markItemRead}
              />
            );
          })}
        </ScrollView>
      </ThemedScreen>
    </>
  );
}
