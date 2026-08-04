import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { StepsHourlyValueRow } from '@/components/steps/StepsHourlyValueRow';
import { FULL_DAY_AXIS_LABELS, HOURLY_STEP_SLOTS } from '@/constants/hourlySteps';
import { activeCaloriesFromHourlySteps } from '@/lib/calories-estimate';
import { fonts } from '@/theme/tokens';

function initialSelectedIndex(slots: readonly { label: string; hour?: number }[]): number {
  const now = new Date().getHours();
  const byHour = slots.findIndex((s) => s.hour === now);
  if (byHour >= 0) return byHour;
  return Math.min(now, slots.length - 1);
}

const CHART_HEIGHT = 36;
const MIN_BAR = 3;

export function CaloriesHourlyChart() {
  const slots = useMemo(
    () =>
      HOURLY_STEP_SLOTS.map((s) => ({
        label: s.label,
        hour: s.hour,
        kcal: activeCaloriesFromHourlySteps(s.steps),
      })),
    [],
  );

  const [selectedIndex, setSelectedIndex] = useState(() => initialSelectedIndex(slots));
  const maxKcal = useMemo(() => Math.max(...slots.map((s) => s.kcal), 1), [slots]);
  const selected = slots[selectedIndex] ?? slots[0];

  return (
    <View className="gap-2.5">
      <StepsHourlyValueRow label={selected.label} steps={selected.kcal} unit="kcal" />

      <View className="flex-row items-end gap-[3px]" style={{ height: CHART_HEIGHT }}>
        {slots.map((slot, index) => {
          const isSelected = index === selectedIndex;
          const barH =
            slot.kcal <= 0 ? MIN_BAR : MIN_BAR + (slot.kcal / maxKcal) * (CHART_HEIGHT - MIN_BAR);

          return (
            <Pressable
              key={`${slot.label}-${index}`}
              accessibilityRole="button"
              accessibilityLabel={`${slot.label}, ${slot.kcal} kilocalories`}
              className="flex-1"
              onPress={() => setSelectedIndex(index)}
            >
              <View style={{ height: CHART_HEIGHT, justifyContent: 'flex-end' }}>
                <View
                  style={{
                    width: '100%',
                    height: barH,
                    borderRadius: 999,
                    backgroundColor: isSelected ? '#f8ffd2' : '#f4f6f3',
                    borderWidth: isSelected ? 1 : 0,
                    borderColor: '#734a00',
                  }}
                />
              </View>
            </Pressable>
          );
        })}
      </View>

      <View className="flex-row justify-between">
        {FULL_DAY_AXIS_LABELS.map((label) => (
          <Text
            key={label}
            style={{ fontFamily: fonts.regular, fontSize: 9, lineHeight: 12, color: '#8e8e93' }}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}
