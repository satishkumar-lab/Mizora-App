import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, Text, View } from 'react-native';

import { StepsArcRing } from '@/components/steps/StepsArcRing';
import { StepsHourlyChart } from '@/components/steps/StepsHourlyChart';
import { Card } from '@/components/ui/Card';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { StepsCardMenuIcon } from '@/components/icons/StepsCardMenuIcon';
import { STEPS_TODAY } from '@/constants/stepsToday';
import { useDailyStepGoal } from '@/hooks/useDailyStepGoal';
import { fonts } from '@/theme/tokens';

export function StepsProgressCard() {
  const router = useRouter();
  const { steps, hourlyHeights } = STEPS_TODAY;
  const { goal, refresh } = useDailyStepGoal();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="Opens today’s steps detail"
      onPress={() => router.push('/steps')}
    >
      <Card className="w-full gap-[15px] px-3.5 py-[15px]">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <MetricBadgeIcon kind="steps" size={20} />
            <Text className="text-[14px] text-[#111827]" style={{ fontFamily: fonts.medium }}>
              Today&apos;s Steps
            </Text>
          </View>
          <StepsCardMenuIcon size={16} />
        </View>

        <View className="gap-5">
          <StepsArcRing steps={steps} goal={goal} />
          <StepsHourlyChart heights={hourlyHeights} />
        </View>
      </Card>
    </Pressable>
  );
}
