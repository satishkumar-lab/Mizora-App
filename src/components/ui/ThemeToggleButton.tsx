import { useColorScheme } from 'nativewind';
import { Pressable } from 'react-native';

import { SunOutlineIcon } from '@/components/icons/SunOutlineIcon';
import { useCircleIconButtonStyle } from '@/components/ui/CircleIconButton';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { saveMizoraTheme, type MizoraThemeScheme } from '@/lib/theme-storage';

/** Appearance toggle — outline sun; dark mode uses 8% icon badge surface. */
export function ThemeToggleButton() {
  const { setColorScheme } = useColorScheme();
  const { colors, isDark } = useMizoraTheme();
  const { shell, iconColor } = useCircleIconButtonStyle(36);

  const onPress = () => {
    const next: MizoraThemeScheme = isDark ? 'light' : 'dark';
    setColorScheme(next);
    void saveMizoraTheme(next);
  };

  const sunColor = isDark ? colors.textAccentGreen : iconColor;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        shell,
        pressed ? { opacity: 0.88, transform: [{ scale: 0.97 }] } : undefined,
      ]}
    >
      <SunOutlineIcon size={18} color={sunColor} />
    </Pressable>
  );
}
