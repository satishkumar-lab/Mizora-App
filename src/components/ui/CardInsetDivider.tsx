import { View } from 'react-native';

import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { themedHairlineColor } from '@/utils/chartGridStyle';

type CardInsetDividerProps = {
  /** Space above the rule */
  top?: number;
  /** Space below the rule */
  bottom?: number;
};

/** Short divider inset from card edges — subtle in dark mode (10% hairline). */
export function CardInsetDivider({ top = 0, bottom = 0 }: CardInsetDividerProps) {
  const { colors, isDark } = useMizoraTheme();

  return (
    <View className="px-4" style={{ paddingTop: top, paddingBottom: bottom }}>
      <View className="h-px" style={{ backgroundColor: themedHairlineColor(isDark, colors) }} />
    </View>
  );
}
