import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedScreen } from '@/components/ui/ThemedScreen';

import {
  CaloriesDetailHeroCard,
  CaloriesMomentumBanner,
} from '@/components/calories/CaloriesDetailHeroCard';
import { CaloriesHourlyLineChart } from '@/components/calories/CaloriesHourlyLineChart';
import { WeekCaloriesSelector } from '@/components/calories/WeekCaloriesSelector';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { TitleSubtitleBlock } from '@/components/ui/TitleSubtitleBlock';
import { activeCaloriesVsYesterday, todayActiveCaloriesFromSteps } from '@/constants/caloriesToday';
import { STEPS_TODAY } from '@/constants/stepsToday';
import { useDailyStepGoal, useHealthGoals } from '@/hooks/useDailyStepGoal';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import {
  defaultActiveCalorieGoalFromStepGoal,
  kcalPerThousandSteps,
} from '@/lib/calories-estimate';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { mizoraCardElevationStyle } from '@/utils/platformStyles';
import { fonts } from '@/theme/tokens';

export function CaloriesDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useMizoraTheme();
  const goBack = useMizoraBack('/home');
  const { goals, refresh: refreshGoals } = useHealthGoals();
  const { goal: stepGoal, refresh: refreshStepGoal } = useDailyStepGoal();

  const activeKcal = useMemo(() => todayActiveCaloriesFromSteps(), []);
  const vsYesterday = useMemo(() => activeCaloriesVsYesterday(), []);
  const kcalPer1k = kcalPerThousandSteps();

  useFocusEffect(
    useCallback(() => {
      void refreshGoals();
      void refreshStepGoal();
    }, [refreshGoals, refreshStepGoal]),
  );

  const ringGoal =
    goals.calories.enabled && goals.calories.value > 0
      ? goals.calories.value
      : defaultActiveCalorieGoalFromStepGoal(stepGoal);

  return (
    <ThemedScreen>
      <View className="px-5">
        <ScreenHeader
          onBack={goBack}
          title="Calories Burned"
          rightAccessory={<MetricBadgeIcon kind="calories" size={36} />}
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
          <CaloriesDetailHeroCard
            activeKcal={activeKcal}
            goalKcal={ringGoal}
            stepsToday={STEPS_TODAY.steps}
            vsYesterdayKcal={vsYesterday}
          />

          <CaloriesMomentumBanner vsYesterdayKcal={vsYesterday} kcalPer1k={kcalPer1k} />

          <View className="gap-3">
            <SectionLabel>Today&apos;s rhythm</SectionLabel>
            <Card className="px-3.5 py-3.5">
              <CaloriesHourlyLineChart />
            </Card>
          </View>

          <View className="gap-3">
            <SectionLabel>Trends</SectionLabel>
            <Card className="gap-3 p-4">
              <TitleSubtitleBlock
                title="This week"
                subtitle="Active kcal from steps — same week as your step calendar"
              />
              <WeekCaloriesSelector />
            </Card>
          </View>

          <Card
            className="gap-2 border p-4"
            style={{
              borderColor: colors.border,
              backgroundColor: isDark ? colors.surfaceMuted : '#fafbf4',
            }}
          >
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textStrong }}>
              How we calculate
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 12,
                color: colors.textSecondary,
                lineHeight: 17,
              }}
            >
              Calories = steps × rate for your weight (~{kcalPer1k} kcal per 1,000 steps at 70 kg).
              We don&apos;t show resting or BMR here — only what your walking earns.
            </Text>
          </Card>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/steps')}
            className="flex-row items-center justify-between rounded-card border border-[#f2f3f0] bg-mizora-card px-4 py-4 dark:border-[#2a332a] dark:bg-mizora-card-dark"
            style={mizoraCardElevationStyle()}
          >
            <View className="flex-row items-center gap-3">
              <MetricBadgeIcon kind="steps" size={40} />
              <View>
                <Text
                  style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.textSecondary }}
                >
                  Steps detail
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: 15,
                    color: colors.textStrong,
                    marginTop: 1,
                  }}
                >
                  Unlocks & daily goal
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#34c759" />
          </Pressable>

          {goals.calories.enabled ? (
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
                    Calorie goal
                  </Text>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: 15,
                      color: colors.textStrong,
                      marginTop: 1,
                    }}
                  >
                    {goals.calories.value.toLocaleString()} kcal
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1">
                <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: '#34c759' }}>
                  Edit
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#34c759" />
              </View>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}
