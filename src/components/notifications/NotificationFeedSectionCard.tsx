import { Text, View } from 'react-native';

import { NotificationFeedRow } from '@/components/notifications/NotificationFeedRow';
import { Card } from '@/components/ui/Card';
import type { NotificationFeedItem } from '@/constants/notifications';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { themedHairlineColor } from '@/utils/chartGridStyle';
import { fonts } from '@/theme/tokens';

type NotificationFeedSectionCardProps = {
  title: string;
  items: NotificationFeedItem[];
  isItemRead: (id: string) => boolean;
  onItemPress: (id: string) => void;
};

export function NotificationFeedSectionCard({
  title,
  items,
  isItemRead,
  onItemPress,
}: NotificationFeedSectionCardProps) {
  const { colors, isDark } = useMizoraTheme();
  const hairline = themedHairlineColor(isDark, colors);
  const unreadInSection = items.filter((i) => i.unread && !isItemRead(i.id)).length;

  return (
    <Card className="overflow-hidden p-0">
      <View className="flex-row items-end justify-between px-4 pb-1 pt-4">
        <Text
          style={{
            fontFamily: fonts.bold,
            fontSize: 14,
            color: colors.textStrong,
            letterSpacing: -0.2,
          }}
        >
          {title}
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 9, color: colors.textMuted }}>
          {items.length} {items.length === 1 ? 'update' : 'updates'}
          {unreadInSection > 0 ? ` · ${unreadInSection} new` : ''}
        </Text>
      </View>

      <View className="px-4 pb-2">
        {items.map((item, index) => (
          <View key={item.id}>
            {index > 0 ? <View className="h-px" style={{ backgroundColor: hairline }} /> : null}
            <NotificationFeedRow
              headline={item.headline}
              categoryLabel={item.categoryLabel}
              timeAgo={item.timeAgo}
              variant={item.variant}
              unread={item.unread}
              read={isItemRead(item.id)}
              onPress={() => onItemPress(item.id)}
            />
          </View>
        ))}
      </View>
    </Card>
  );
}
