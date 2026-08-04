import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { CircleIconButton, useCircleIconButtonStyle } from '@/components/ui/CircleIconButton';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';

type NotificationHeaderIconProps = {
  hasUnread: boolean;
};

/** Header bell — dot when anything in the inbox is still unread. */
export function NotificationHeaderIcon({ hasUnread }: NotificationHeaderIconProps) {
  const { colors } = useMizoraTheme();
  const { iconColor } = useCircleIconButtonStyle(36);

  return (
    <View className="relative">
      <CircleIconButton
        size={36}
        accessibilityLabel={hasUnread ? 'Notifications, unread items remaining' : 'Notifications'}
      >
        <Ionicons name="notifications" size={18} color={iconColor} />
      </CircleIconButton>
      {hasUnread ? (
        <View
          pointerEvents="none"
          className="absolute right-0.5 top-0.5 z-10 h-2.5 w-2.5 rounded-full border-2"
          style={{ backgroundColor: '#34c759', borderColor: colors.backButtonBg }}
        />
      ) : null}
    </View>
  );
}
