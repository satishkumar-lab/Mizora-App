import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MetricBadgeIcon, type MetricBadgeKind } from '@/components/icons/MetricBadgeIcon';
import type { NotificationFeedItem } from '@/constants/notifications';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

const VARIANT_BADGE: Record<NotificationFeedItem['variant'], MetricBadgeKind> = {
  walk_nudge: 'activeTime',
  milestone: 'steps',
  streak: 'steps',
  unlock: 'unlock',
  challenge: 'unlock',
} as const;

type NotificationInAppBannerProps = {
  item: NotificationFeedItem;
  onPress: () => void;
  onDismiss: () => void;
};

function bannerSurfaceStyle(isDark: boolean) {
  const backgroundColor = isDark ? '#1c2319' : '#ffffff';
  const borderColor = isDark ? '#2a332a' : '#ebefea';

  const base = {
    backgroundColor,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor,
  };

  if (Platform.OS === 'android') {
    return {
      ...base,
      elevation: 14,
    };
  }

  return {
    ...base,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: isDark ? 0.45 : 0.12,
    shadowRadius: 20,
  };
}

/** In-app banner preview — mimics future foreground notification toast. */
export function NotificationInAppBanner({
  item,
  onPress,
  onDismiss,
}: NotificationInAppBannerProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useMizoraTheme();
  const badgeKind = VARIANT_BADGE[item.variant];
  const surface = bannerSurfaceStyle(isDark);

  return (
    <Animated.View
      entering={FadeInUp.duration(320)}
      exiting={FadeOutUp.duration(220)}
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: insets.top + 8,
        left: 16,
        right: 16,
        zIndex: 9999,
      }}
    >
      <View style={surface}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Notification: ${item.headline}`}
          onPress={onPress}
          onLongPress={onDismiss}
          style={({ pressed }) => ({
            backgroundColor: isDark ? '#1c2319' : '#ffffff',
            borderRadius: 18,
            opacity: pressed ? 0.92 : 1,
          })}
        >
          <View className="flex-row items-start gap-3 px-3.5 py-3">
            <View
              style={{
                borderWidth: 2,
                borderColor: '#ddfb43',
                borderRadius: 999,
                backgroundColor: isDark ? '#252d25' : '#ffffff',
              }}
            >
              <MetricBadgeIcon kind={badgeKind} size={44} />
            </View>
            <View className="min-w-0 flex-1 pt-0.5" style={{ gap: 4 }}>
              <Text
                numberOfLines={2}
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 13,
                  lineHeight: 18,
                  color: colors.textStrong,
                }}
              >
                {item.headline}
              </Text>
              <View className="flex-row items-center gap-2">
                <View
                  className="rounded-full px-2 py-0.5"
                  style={{ backgroundColor: colors.surfaceMuted }}
                >
                  <Text
                    style={{ fontFamily: fonts.medium, fontSize: 8, color: colors.textSecondary }}
                  >
                    {item.categoryLabel}
                  </Text>
                </View>
                <Text style={{ fontFamily: fonts.regular, fontSize: 9, color: colors.textMuted }}>
                  {item.timeAgo}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      </View>
    </Animated.View>
  );
}
