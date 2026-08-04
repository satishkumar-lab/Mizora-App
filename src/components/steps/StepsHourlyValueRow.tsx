import { Text, View } from 'react-native';

import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

type StepsHourlyValueRowProps = {
  label: string;
  steps: number;
  unit?: string;
};

export function StepsHourlyValueRow({ label, steps, unit = 'steps' }: StepsHourlyValueRowProps) {
  const { colors } = useMizoraTheme();
  return (
    <View className="flex-row items-baseline justify-between">
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 12,
          color: colors.textSecondary,
          lineHeight: 16,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 14,
          color: colors.textSecondary,
          lineHeight: 18,
        }}
      >
        <Text style={{ fontFamily: fonts.bold, color: colors.textStrong }}>
          {steps.toLocaleString()}
        </Text>{' '}
        {unit}
      </Text>
    </View>
  );
}
