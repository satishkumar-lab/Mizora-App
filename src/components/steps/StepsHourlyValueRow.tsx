import { Text, View } from 'react-native';

import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { mizoraType } from '@/theme/typography';

type StepsHourlyValueRowProps = {
  label: string;
  steps: number;
  unit?: string;
};

export function StepsHourlyValueRow({ label, steps, unit = 'steps' }: StepsHourlyValueRowProps) {
  const { colors } = useMizoraTheme();
  return (
    <View className="flex-row items-baseline justify-between">
      <Text style={{ ...mizoraType.bodyMedium, color: colors.textSecondary }}>{label}</Text>
      <Text style={{ ...mizoraType.bodyMedium, color: colors.textSecondary }}>
        <Text style={{ ...mizoraType.headingH2, color: colors.textStrong }}>
          {steps.toLocaleString()}
        </Text>{' '}
        {unit}
      </Text>
    </View>
  );
}
