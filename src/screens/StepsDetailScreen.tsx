import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedScreen } from '@/components/ui/ThemedScreen';

import { AppBrandIcon } from '@/components/icons/AppBrandIcon';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { StepsDetailHeroCard } from '@/components/steps/StepsDetailHeroCard';
import { StepsHourlyChart } from '@/components/steps/StepsHourlyChart';
import { WeekStepsSelector } from '@/components/steps/WeekStepsSelector';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { UNLOCK_REWARDS_V2_ENABLED } from '@/constants/productScope';
import { TitleSubtitleBlock } from '@/components/ui/TitleSubtitleBlock';
import { mizoraCardElevationStyle } from '@/utils/platformStyles';
import { useDailyStepGoal } from '@/hooks/useDailyStepGoal';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { useSteps } from '@/providers/StepsProvider';
import {
  ACTIVE_STEP_UNLOCK,
  stepsRemainingForUnlock,
  stepsRemainingToGoal,
} from '@/constants/stepsToday';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { fonts } from '@/theme/tokens';

function HeroSummaryCard({
  steps,
  goal,
  remaining,
  progressPct,
}: {
  steps: number;
  goal: number;
  remaining: number;
  progressPct: number;
}) {
  return (
    <StepsDetailHeroCard
      steps={steps}
      goal={goal}
      remaining={remaining}
      progressPct={progressPct}
    />
  );
}

function UnlockNudgeCard() {
  const { colors, isDark } = useMizoraTheme();
  const unlock = ACTIVE_STEP_UNLOCK;
  const remaining = stepsRemainingForUnlock(unlock);
  const progress = Math.min(unlock.progressSteps / unlock.challengeSteps, 1);
  const progressLabel = `${unlock.progressSteps.toLocaleString()} / ${unlock.challengeSteps.toLocaleString()} steps`;

  return (
    <View
      className="overflow-hidden rounded-[20px] border border-[#f2f3f0] bg-mizora-card dark:border-[#2a332a] dark:bg-mizora-card-dark"
      style={mizoraCardElevationStyle()}
    >
      <View
        className="border-b border-[#f2f3f0] px-4 py-3 dark:border-[#2a332a]"
        style={{ backgroundColor: isDark ? colors.surfaceMuted : '#fafbf4' }}
      >
        <View className="flex-row items-center gap-2">
          <MetricBadgeIcon kind="unlock" size={32} />
          <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.textStrong }}>
            Next unlock
          </Text>
        </View>
      </View>

      <View className="gap-4 p-4" style={{ backgroundColor: colors.card }}>
        <View className="flex-row items-center gap-3.5">
          <AppBrandIcon app={unlock.appId} size={48} />
          <View className="flex-1">
            <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.textStrong }}>
              {unlock.appName}
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 12,
                color: colors.textSecondary,
                marginTop: 1,
              }}
            >
              {unlock.unlockMinutes} min access after challenge
            </Text>
          </View>
          <View className="items-end">
            <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: '#34c759' }}>
              {remaining > 0 ? remaining.toLocaleString() : '0'}
            </Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: colors.textSecondary }}>
              {remaining > 0 ? 'steps left' : 'ready'}
            </Text>
          </View>
        </View>

        <View className="gap-2">
          <View className="h-2.5 overflow-hidden rounded-full bg-mizora-track dark:bg-[#2a332a]">
            <View
              className="h-full rounded-full bg-mizora-primary"
              style={{ width: `${progress * 100}%` }}
            />
          </View>
          <View className="flex-row items-center justify-between">
            <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: colors.textSecondary }}>
              {progressLabel}
            </Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: '#49a621' }}>
              {Math.round(progress * 100)}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function StatTile({ value, unit, label }: { value: string; unit: string; label: string }) {
  const { colors } = useMizoraTheme();
  return (
    <View className="flex-1 items-center px-1">
      <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: colors.textSecondary }}>
        {label}
      </Text>
      <Text className="mt-1.5">
        <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: colors.textStrong }}>
          {value}
        </Text>
        {unit ? (
          <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: colors.textSecondary }}>
            {' '}
            {unit}
          </Text>
        ) : null}
      </Text>
    </View>
  );
}

function WeekSection({ goal }: { goal: number }) {
  return (
    <Card className="gap-3 p-4">
      <TitleSubtitleBlock
        title="This week"
        subtitle="Same calendar as home — tap a day or slide the chart"
      />
      <WeekStepsSelector goal={goal} />
    </Card>
  );
}

export function StepsDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useMizoraTheme();
  const { goal, refresh } = useDailyStepGoal();
  const goBack = useMizoraBack('/home');
  const { snapshot, refresh: refreshSteps } = useSteps();
  const { steps, distanceKm, activeMinutes, vsYesterday, hourlySlots } = snapshot;

  useFocusEffect(
    useCallback(() => {
      void refresh();
      void refreshSteps();
    }, [refresh, refreshSteps]),
  );

  const remainingGoal = stepsRemainingToGoal(steps, goal);
  const progressPct = Math.round((steps / goal) * 100);

  return (
    <ThemedScreen>
      <View className="px-5">
        <ScreenHeader
          onBack={goBack}
          title="Today's Steps"
          rightAccessory={<MetricBadgeIcon kind="steps" size={36} />}
        />
      </View>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-8"
        contentContainerStyle={{
          paddingBottom: insets.bottom + MAIN_TAB_BAR_CLEARANCE,
          paddingTop: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          <HeroSummaryCard
            steps={steps}
            goal={goal}
            remaining={remainingGoal}
            progressPct={progressPct}
          />

          {UNLOCK_REWARDS_V2_ENABLED ? (
            <View className="gap-3">
              <SectionLabel>Unlock impact</SectionLabel>
              <UnlockNudgeCard />
            </View>
          ) : null}

          <View className="gap-3">
            <SectionLabel>Today&apos;s activity</SectionLabel>
            <Card className="flex-row items-center py-5">
              <StatTile value={distanceKm.toFixed(1)} unit="km" label="Distance" />
              <View className="h-12 w-px" style={{ backgroundColor: colors.borderDivider }} />
              <StatTile value={String(activeMinutes)} unit="min" label="Active time" />
              <View className="h-12 w-px" style={{ backgroundColor: colors.borderDivider }} />
              <StatTile value={`+${vsYesterday}`} unit="" label="vs yesterday" />
            </Card>
          </View>

          <View className="gap-3">
            <SectionLabel>Trends</SectionLabel>
            <Card className="px-3.5 py-3.5">
              <StepsHourlyChart slots={hourlySlots} variant="detail" />
            </Card>
            <WeekSection goal={goal} />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/steps/goal')}
            className="flex-row items-center justify-between rounded-card border border-[#f2f3f0] bg-mizora-card px-4 py-4 dark:border-[#2a332a] dark:bg-mizora-card-dark"
            style={mizoraCardElevationStyle()}
          >
            <View className="flex-row items-center gap-3">
              <MetricBadgeIcon kind="goal" size={40} />
              <View>
                <Text
                  style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.textSecondary }}
                >
                  Daily goal
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: 15,
                    color: colors.textStrong,
                    marginTop: 1,
                  }}
                >
                  {goal.toLocaleString()} steps
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1">
              <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: '#34c759' }}>Edit</Text>
              <Ionicons name="chevron-forward" size={16} color="#34c759" />
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}
