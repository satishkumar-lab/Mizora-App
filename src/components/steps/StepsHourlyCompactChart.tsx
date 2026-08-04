import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { StepsHourlyValueRow } from '@/components/steps/StepsHourlyValueRow';
import {
  FULL_DAY_AXIS_LABELS,
  HOURLY_STEP_SLOTS,
  NARROW_DAY_AXIS_LABELS,
  type HourlyChartAxisMode,
} from '@/constants/hourlySteps';
import { fonts } from '@/theme/tokens';

const CHART_HEIGHT = 36;
const MIN_BAR = 3;

function barHeight(steps: number, maxSteps: number): number {
  if (steps <= 0) return MIN_BAR;
  const t = steps / maxSteps;
  return MIN_BAR + t * (CHART_HEIGHT - MIN_BAR);
}

type StepsHourlyCompactChartProps = {
  slots?: readonly { label: string; steps: number; hour?: number }[];
  axisMode?: HourlyChartAxisMode;
};

function initialSelectedIndex(
  slots: readonly { label: string; steps: number; hour?: number }[],
): number {
  const now = new Date().getHours();
  const byHour = slots.findIndex((s) => s.hour === now);
  if (byHour >= 0) return byHour;
  return Math.min(now, slots.length - 1);
}

/** Home card — full 24h day in one row; tap an hour to read steps. */
export function StepsHourlyCompactChart({
  slots = HOURLY_STEP_SLOTS,
  axisMode = 'full',
}: StepsHourlyCompactChartProps) {
  const [selectedIndex, setSelectedIndex] = useState(() => initialSelectedIndex(slots));

  const maxSteps = useMemo(() => Math.max(...slots.map((s) => s.steps), 1), [slots]);
  const selected = slots[selectedIndex] ?? slots[0];
  const axisLabels = axisMode === 'narrow' ? NARROW_DAY_AXIS_LABELS : FULL_DAY_AXIS_LABELS;

  return (
    <View className="gap-2.5" onStartShouldSetResponder={() => true}>
      <StepsHourlyValueRow label={selected.label} steps={selected.steps} />

      <View className="flex-row items-end gap-[3px]" style={{ height: CHART_HEIGHT }}>
        {slots.map((slot, index) => {
          const isSelected = index === selectedIndex;
          const barH = barHeight(slot.steps, maxSteps);

          return (
            <Pressable
              key={`${slot.label}-${index}`}
              accessibilityRole="button"
              accessibilityLabel={`${slot.label}, ${slot.steps} steps`}
              accessibilityState={{ selected: isSelected }}
              className="flex-1"
              hitSlop={{ top: 6, bottom: 4 }}
              onPress={() => setSelectedIndex(index)}
            >
              <View style={{ height: CHART_HEIGHT, justifyContent: 'flex-end' }}>
                <View
                  style={{
                    width: '100%',
                    height: barH,
                    borderRadius: 999,
                    backgroundColor: isSelected ? '#ddfb43' : '#e5ece2',
                  }}
                />
              </View>
            </Pressable>
          );
        })}
      </View>

      <View className="flex-row justify-between">
        {axisLabels.map((label) => (
          <Text
            key={label}
            style={{
              fontFamily: fonts.regular,
              fontSize: 9,
              lineHeight: 12,
              color: '#8e8e93',
            }}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}
