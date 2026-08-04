import { Text, View } from 'react-native';

import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

type UnlockRuleMotivationHeaderProps = {
  appName: string;
};

export function UnlockRuleMotivationHeader({ appName }: UnlockRuleMotivationHeaderProps) {
  const { colors } = useMizoraTheme();
  return (
    <View className="items-center px-2 pb-1 pt-0" style={{ gap: 6 }}>
      <Text
        style={{
          fontFamily: fonts.regular,
          fontSize: 14,
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: 20,
        }}
      >
        Distractions block your progress.
      </Text>
      <Text
        style={{
          fontFamily: fonts.bold,
          fontSize: 16,
          color: colors.textStrong,
          textAlign: 'center',
          lineHeight: 22,
        }}
      >
        We block {appName}. You unlock your best.
      </Text>
    </View>
  );
}
