import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { BackChevronIcon } from '@/components/icons/BackChevronIcon';
import { fonts } from '@/theme/tokens';

type ScreenBackButtonProps = {
  onPress: () => void;
  accessibilityLabel?: string;
};

export function ScreenBackButton({
  onPress,
  accessibilityLabel = 'Go back',
}: ScreenBackButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={12}
      className="z-10 h-10 w-10 items-center justify-center"
    >
      <BackChevronIcon size={26} />
    </Pressable>
  );
}

type ScreenHeaderProps = {
  onBack: () => void;
  title: string;
  subtitle?: string;
  /** Shown immediately to the right of the title (e.g. steps glyph). */
  titleTrailing?: ReactNode;
};

export function ScreenHeader({ onBack, title, subtitle, titleTrailing }: ScreenHeaderProps) {
  return (
    <View className="relative min-h-10 flex-row items-center py-1">
      <ScreenBackButton onPress={onBack} />
      <View pointerEvents="none" className="absolute inset-x-0 items-center px-14">
        <View className="max-w-full flex-row items-center justify-center gap-1.5">
          <Text numberOfLines={1} style={{ fontFamily: fonts.medium, fontSize: 16, color: '#000' }}>
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
              color: '#626b5e',
              marginTop: 1,
              textAlign: 'center',
            }}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View className="h-10 w-10" />
    </View>
  );
}
