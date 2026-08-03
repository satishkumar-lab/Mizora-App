import { Text, View } from 'react-native';

import { StepsHourlyLineChart } from '@/components/steps/StepsHourlyLineChart';
import { fonts } from '@/theme/tokens';

type StepsHourlyChartProps = {
  heights: readonly number[];
  peakIndex?: number;
  variant?: 'compact' | 'detail';
  peakLabel?: string;
};

/** Home card: compact bars. Detail screen uses scrubbable line chart. */
export function StepsHourlyChart({
  heights,
  peakIndex = 4,
  variant = 'compact',
}: StepsHourlyChartProps) {
  if (variant === 'detail') {
    return <StepsHourlyLineChart />;
  }

  const maxH = Math.max(...heights, 1);
  const chartHeight = 32;

  return (
    <View className="w-full gap-1">
      <View className="h-8 w-full flex-row items-end gap-1">
        {heights.map((h, i) => {
          const normalized = (h / maxH) * chartHeight;
          const isPeak = i === peakIndex;
          return (
            <View
              key={i}
              className="flex-1 rounded-[3px]"
              style={{
                height: Math.max(normalized, 4),
                backgroundColor: isPeak ? '#ddfb43' : '#e5e5ea',
              }}
            />
          );
        })}
      </View>
      <View className="w-full flex-row justify-between">
        {['6 AM', '12 PM', '6 PM'].map((label) => (
          <Text
            key={label}
            style={{ fontFamily: fonts.regular, fontSize: 8, lineHeight: 12, color: '#8e8e93' }}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}
