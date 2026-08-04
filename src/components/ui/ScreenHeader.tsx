import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { BackChevronIcon } from '@/components/icons/BackChevronIcon';
import { CircleIconButton, useCircleIconButtonStyle } from '@/components/ui/CircleIconButton';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

type ScreenBackButtonProps = {
  onPress: () => void;
  accessibilityLabel?: string;
};

export function ScreenBackButton({
  onPress,
  accessibilityLabel = 'Go back',
}: ScreenBackButtonProps) {
  const { iconColor } = useCircleIconButtonStyle(36);

  return (
    <CircleIconButton
      size={36}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={{ zIndex: 10 }}
    >
      <BackChevronIcon size={18} color={iconColor} />
    </CircleIconButton>
  );
}

type ScreenHeaderProps = {
  onBack: () => void;
  title: string;
  subtitle?: string;
  titleTrailing?: ReactNode;
  rightAccessory?: ReactNode;
};

export function ScreenHeader({
  onBack,
  title,
  subtitle,
  titleTrailing,
  rightAccessory,
}: ScreenHeaderProps) {
  const { colors } = useMizoraTheme();

  return (
    <View className="relative min-h-10 flex-row items-center py-1">
      <ScreenBackButton onPress={onBack} />
      <View pointerEvents="none" className="absolute inset-x-0 items-center px-12">
        <View className="max-w-full flex-row items-center justify-center gap-1.5">
          <Text
            numberOfLines={1}
            style={{ fontFamily: fonts.medium, fontSize: 16, color: colors.textStrong }}
          >
            {title}
          </Text>
          {titleTrailing}
        </View>
        {subtitle ? (
          <Text
            numberOfLines={1}
            style={{
              fontFamily: fonts.regular,
              fontSize: 11,
              color: colors.textSecondary,
              marginTop: 1,
              textAlign: 'center',
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View className="ml-auto min-h-9 min-w-9 items-center justify-center">
        {rightAccessory ?? <View className="h-9 w-9" />}
      </View>
    </View>
  );
}
