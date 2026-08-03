import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppBrandIcon } from '@/components/icons/AppBrandIcon';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { StepsDetailHeroCard } from '@/components/steps/StepsDetailHeroCard';
import { StepsHourlyChart } from '@/components/steps/StepsHourlyChart';
import { WeekStepsSelector } from '@/components/steps/WeekStepsSelector';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TitleSubtitleBlock } from '@/components/ui/TitleSubtitleBlock';
import { mizoraCardElevationStyle } from '@/utils/platformStyles';
import { useDailyStepGoal } from '@/hooks/useDailyStepGoal';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import {
  ACTIVE_STEP_UNLOCK,
  STEPS_TODAY,
  stepsRemainingForUnlock,
  stepsRemainingToGoal,
} from '@/constants/stepsToday';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { fonts } from '@/theme/tokens';

function SectionLabel({ children }: { children: string }) {
  return <Text style={{ fontFamily: fonts.medium, fontSize: 16, color: '#000' }}>{children}</Text>;
}

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
  const unlock = ACTIVE_STEP_UNLOCK;
  const remaining = stepsRemainingForUnlock(unlock);
  const progress = Math.min(unlock.progressSteps / unlock.challengeSteps, 1);
  const progressLabel = `${unlock.progressSteps.toLocaleString()} / ${unlock.challengeSteps.toLocaleString()} steps`;

  return (
    <View
      className="overflow-hidden rounded-[20px] border border-[#f2f3f0] bg-white"
      style={mizoraCardElevationStyle()}
    >
      <View className="border-b border-[#f2f3f0] bg-[#fafbf4] px-4 py-3">
        <View className="flex-row items-center gap-2">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
            <Ionicons name="key" size={16} color="#5c6d05" />
          </View>
          <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: '#141c12' }}>
            Next unlock
          </Text>
        </View>
      </View>

      <View className="gap-4 bg-white p-4">
        <View className="flex-row items-center gap-3.5">
          <AppBrandIcon app={unlock.appId} size={48} />
          <View className="flex-1">
            <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: '#141c12' }}>
              {unlock.appName}
            </Text>
            <Text
              style={{ fontFamily: fonts.regular, fontSize: 12, color: '#626b5e', marginTop: 1 }}
            >
              {unlock.unlockMinutes} min access after challenge
            </Text>
          </View>
          <View className="items-end">
            <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: '#34c759' }}>
              {remaining > 0 ? remaining.toLocaleString() : '0'}
            </Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: '#626b5e' }}>
              {remaining > 0 ? 'steps left' : 'ready'}
            </Text>
          </View>
        </View>

        <View className="gap-2">
          <View className="h-2.5 overflow-hidden rounded-full bg-mizora-track">
            <View
              className="h-full rounded-full bg-mizora-primary"
              style={{ width: `${progress * 100}%` }}
            />
          </View>
          <View className="flex-row items-center justify-between">
            <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: '#626b5e' }}>
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
  return (
    <View className="flex-1 items-center px-1">
      <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: '#626b5e' }}>{label}</Text>
      <Text className="mt-1.5">
        <Text style={{ fontFamily: fonts.bold, fontSize: 20, color: '#111827' }}>{value}</Text>
        {unit ? (
          <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: '#626b5e' }}> {unit}</Text>
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
  const { goal, refresh } = useDailyStepGoal();
  const goBack = useMizoraBack('/home');
  const { steps, distanceKm, activeMinutes, vsYesterday, hourlyHeights } = STEPS_TODAY;

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const remainingGoal = stepsRemainingToGoal(steps, goal);
  const progressPct = Math.round((steps / goal) * 100);

  return (
    <SafeAreaView className="flex-1 bg-mizora-bg" edges={['top']}>
      <View className="px-5">
        <ScreenHeader
          onBack={goBack}
          title="Today's Steps"
          subtitle="Live from your phone"
          titleTrailing={<Ionicons name="footsteps" size={18} color="#34c759" />}
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

          <View className="gap-3">
            <SectionLabel>Unlock impact</SectionLabel>
            <UnlockNudgeCard />
          </View>

          <View className="gap-3">
            <SectionLabel>Today&apos;s activity</SectionLabel>
            <Card className="flex-row items-center py-5">
              <StatTile value={distanceKm.toFixed(1)} unit="km" label="Distance" />
              <View className="h-12 w-px bg-[#f2f3f0]" />
              <StatTile value={String(activeMinutes)} unit="min" label="Active time" />
              <View className="h-12 w-px bg-[#f2f3f0]" />
              <StatTile value={`+${vsYesterday}`} unit="" label="vs yesterday" />
            </Card>
          </View>

          <View className="gap-3">
            <SectionLabel>Trends</SectionLabel>
            <Card className="px-3.5 py-3.5">
              <StepsHourlyChart heights={hourlyHeights} variant="detail" />
            </Card>
            <WeekSection goal={goal} />
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/steps/goal')}
            className="flex-row items-center justify-between rounded-card border border-[#f2f3f0] bg-white px-4 py-4"
            style={mizoraCardElevationStyle()}
          >
            <View className="flex-row items-center gap-3">
              <MetricBadgeIcon kind="goal" size={40} />
              <View>
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: '#626b5e' }}>
                  Daily goal
                </Text>
                <Text
                  style={{ fontFamily: fonts.bold, fontSize: 16, color: '#141c12', marginTop: 1 }}
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
    </SafeAreaView>
  );
}
