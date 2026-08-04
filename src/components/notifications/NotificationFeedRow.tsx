import { Pressable, Text, View } from 'react-native';

import { MetricBadgeIcon, type MetricBadgeKind } from '@/components/icons/MetricBadgeIcon';
import type { NotificationFeedVariant } from '@/constants/notifications';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

const VARIANT_BADGE_KIND: Record<NotificationFeedVariant, MetricBadgeKind> = {
  walk_nudge: 'activeTime',
  milestone: 'steps',
  streak: 'steps',
  unlock: 'unlock',
  challenge: 'unlock',
};

type NotificationFeedRowProps = {
  headline: string;
  categoryLabel: string;
  timeAgo: string;
  variant: NotificationFeedVariant;
  /** Still unread — lime ring + green dot until marked read */
  unread?: boolean;
  read?: boolean;
  onPress?: () => void;
};

export function NotificationFeedRow({
  headline,
  categoryLabel,
  timeAgo,
  variant,
  unread,
  read,
  onPress,
}: NotificationFeedRowProps) {
  const { colors } = useMizoraTheme();
  const badgeKind = VARIANT_BADGE_KIND[variant];
  const showUnreadChrome = Boolean(unread && !read);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-start gap-3 py-3.5"
      style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
    >
      <View className="relative">
        {showUnreadChrome ? (
          <View
            pointerEvents="none"
            className="absolute -right-0.5 -top-0.5 z-10 h-2.5 w-2.5 rounded-full border-2"
            style={{ backgroundColor: '#34c759', borderColor: colors.card }}
          />
        ) : null}
        <View
          style={{
            borderWidth: showUnreadChrome ? 2 : 0,
            borderColor: showUnreadChrome ? '#ddfb43' : 'transparent',
            borderRadius: 999,
          }}
        >
          <MetricBadgeIcon kind={badgeKind} size={48} appearance={read ? 'read' : 'default'} />
        </View>
      </View>

      <View className="min-w-0 flex-1 pt-0.5" style={{ gap: 6 }}>
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: 12,
            lineHeight: 18,
            color: read ? colors.textSecondary : colors.textStrong,
            letterSpacing: -0.1,
          }}
        >
          {headline}
        </Text>
        <View className="flex-row flex-wrap items-center gap-2">
          <View
            className="rounded-full px-2.5 py-1"
            style={{
              backgroundColor: colors.surfaceMuted,
            }}
          >
            <Text style={{ fontFamily: fonts.medium, fontSize: 8, color: colors.textSecondary }}>
              {categoryLabel}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 9,
              color: colors.textMuted,
              fontVariant: ['tabular-nums'],
            }}
          >
            {timeAgo}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
