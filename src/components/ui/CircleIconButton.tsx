import type { PropsWithChildren } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useMizoraTheme } from '@/hooks/useMizoraTheme';

type CircleIconButtonProps = PropsWithChildren<{
  size?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'none';
  style?: StyleProp<ViewStyle>;
}>;

/** Circular control — light gray in light mode, white pill in dark mode (back, calendar, etc.). */
export function useCircleIconButtonStyle(size: number) {
  const { colors, isDark } = useMizoraTheme();

  const shell: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.backButtonBorder,
    backgroundColor: colors.backButtonBg,
    ...(isDark
      ? {
          shadowColor: '#0F172A',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 4,
        }
      : {
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        }),
  };

  return { shell, iconColor: colors.backButtonIcon, colors, isDark };
}

export function CircleIconButton({
  children,
  size = 36,
  onPress,
  accessibilityLabel,
  accessibilityRole = onPress ? 'button' : 'none',
  style,
}: CircleIconButtonProps) {
  const { shell } = useCircleIconButtonStyle(size);

  if (onPress) {
    return (
      <Pressable
        accessibilityRole={accessibilityRole === 'none' ? 'button' : accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        onPress={onPress}
        hitSlop={6}
        style={({ pressed }) => [
          shell,
          style,
          pressed ? { opacity: 0.88, transform: [{ scale: 0.97 }] } : undefined,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View accessibilityRole={accessibilityRole} style={[shell, style]}>
      {children}
    </View>
  );
}
