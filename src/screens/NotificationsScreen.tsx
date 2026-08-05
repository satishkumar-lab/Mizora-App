import { useCallback, useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { UNLOCK_IMPACT_HREF, UNLOCK_REWARDS_V2_ENABLED } from '@/constants/productScope';
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
import { fonts } from '@/theme/tokens';

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
  const { isDark, colors } = useMizoraTheme();
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
    const weeklyUnread = UNLOCK_REWARDS_V2_ENABLED && !weeklyReportRead ? 1 : 0;
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
          {UNLOCK_REWARDS_V2_ENABLED ? (
            <WeeklyReportInboxCard
              read={weeklyReportRead}
              onPress={() => {
                setWeeklyReportRead(true);
                router.push(UNLOCK_IMPACT_HREF);
              }}
            />
          ) : null}

          {MOCK_NOTIFICATION_FEED.length === 0 ? (
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 13,
                color: colors.textMuted,
                textAlign: 'center',
                paddingVertical: 24,
                paddingHorizontal: 12,
                lineHeight: 20,
              }}
            >
              No notifications yet. Reminders and unlock alerts will show up here when you earn
              them.
            </Text>
          ) : null}

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
