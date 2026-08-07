import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedScreen } from '@/components/ui/ThemedScreen';

import { WeekCaloriesSelector } from '@/components/calories/WeekCaloriesSelector';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { WeekStepsSelector } from '@/components/steps/WeekStepsSelector';
import { WeekWaterSelector } from '@/components/water/WeekWaterSelector';
import { StepsPermissionStateCard } from '@/components/steps/StepsPermissionStateCard';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { TitleSubtitleBlock } from '@/components/ui/TitleSubtitleBlock';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { summarizeWeeklyHealth } from '@/lib/health/weeklyHealthSummary';
import { useStepsMetricsLive } from '@/hooks/useStepsMetricsLive';
import { useSteps } from '@/providers/StepsProvider';
import { useWaterIntake } from '@/providers/WaterIntakeProvider';
import { mizoraCardElevationStyle } from '@/utils/platformStyles';
import { fonts } from '@/theme/tokens';

function WeeklyTotalsHero({
  totalSteps,
  totalActiveKcal,
  totalWaterMl,
  stepsUnavailable = false,
}: {
  totalSteps: number;
  totalActiveKcal: number;
  totalWaterMl: number;
  stepsUnavailable?: boolean;
}) {
  const { colors, isDark } = useMizoraTheme();
  const waterLabel =
    totalWaterMl >= 1000
      ? `${(totalWaterMl / 1000).toFixed(1)} L`
      : totalWaterMl > 0
        ? `${totalWaterMl} ml`
        : '—';

  const stepsLabel = stepsUnavailable ? '—' : totalSteps.toLocaleString();
  const kcalLabel = stepsUnavailable ? '—' : Math.round(totalActiveKcal).toLocaleString();

  return (
    <Card className="overflow-hidden p-0" style={mizoraCardElevationStyle(isDark)}>
      <View
        className="border-b px-4 py-3"
        style={{
          borderColor: colors.borderDivider,
          backgroundColor: isDark ? colors.surfaceMuted : '#fafbf4',
        }}
      >
        <View className="flex-row items-center gap-2">
          <MetricBadgeIcon kind="steps" size={32} />
          <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.textStrong }}>
            This week · Mon – Sun
          </Text>
        </View>
      </View>
      <View className="flex-row divide-x px-2 py-4" style={{ borderColor: colors.borderDivider }}>
        {[
          { label: 'Steps', value: stepsLabel },
          { label: 'Active kcal', value: kcalLabel },
          { label: 'Water', value: waterLabel },
        ].map((col) => (
          <View key={col.label} className="flex-1 items-center px-2" style={{ gap: 4 }}>
            <Text style={{ fontFamily: fonts.bold, fontSize: 18, color: colors.textStrong }}>
              {col.value}
            </Text>
            <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: colors.textMuted }}>
              {col.label}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

function PeakWalkInsightCard({
  peakWindow,
  notificationCopy,
  bestDayLabel,
}: {
  peakWindow: string;
  notificationCopy: string;
  bestDayLabel: string | null;
}) {
  const { colors, isDark } = useMizoraTheme();

  return (
    <Card className="gap-3 p-4" style={mizoraCardElevationStyle(isDark)}>
      <View className="flex-row items-start gap-3">
        <MetricBadgeIcon kind="steps" size={40} />
        <View className="min-w-0 flex-1" style={{ gap: 6 }}>
          <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.textStrong }}>
            Peak walk time
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 12,
              color: colors.textSecondary,
              lineHeight: 18,
            }}
          >
            {notificationCopy}
          </Text>
          {bestDayLabel ? (
            <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: colors.textMuted }}>
              Busiest day · {bestDayLabel}
            </Text>
          ) : null}
          {peakWindow !== 'No Activity' ? (
            <View
              className="self-start rounded-full px-2.5 py-1"
              style={{ backgroundColor: isDark ? 'rgba(212, 255, 0, 0.12)' : '#eef9dc' }}
            >
              <Text style={{ fontFamily: fonts.bold, fontSize: 11, color: '#34c759' }}>
                {peakWindow}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Card>
  );
}

/** V1 weekly health report — steps, water, calories (no unlock / screen time). */
export function WeeklyHealthReportScreen() {
  const insets = useSafeAreaInsets();
  const goBack = useMizoraBack('/notifications');
  const { isDark } = useMizoraTheme();
  const { metricsLive, status, retryTracking } = useStepsMetricsLive();
  const { snapshot, hourlySlots, refresh } = useSteps();
  const { loggedMl } = useWaterIntake();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const summary = useMemo(
    () =>
      metricsLive
        ? summarizeWeeklyHealth(snapshot.week, loggedMl, hourlySlots)
        : {
            totalSteps: 0,
            totalActiveKcal: 0,
            totalWaterMl: loggedMl,
            peakWalkWindow: 'No Activity',
            peakWalkNotification: '',
            bestStepsDay: null,
          },
    [metricsLive, snapshot.week, loggedMl, hourlySlots],
  );

  const bestDayLabel = summary.bestStepsDay
    ? `${summary.bestStepsDay.weekday} · ${summary.bestStepsDay.steps.toLocaleString()} steps`
    : null;

  return (
    <ThemedScreen>
      <View className="px-5">
        <ScreenHeader
          onBack={goBack}
          title="Weekly report"
          rightAccessory={<MetricBadgeIcon kind="steps" size={36} />}
        />
      </View>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-8"
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: insets.bottom + MAIN_TAB_BAR_CLEARANCE,
          gap: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        {!metricsLive ? (
          <StepsPermissionStateCard status={status} onPrimaryPress={() => void retryTracking()} />
        ) : null}

        <WeeklyTotalsHero
          totalSteps={metricsLive ? summary.totalSteps : 0}
          totalActiveKcal={metricsLive ? summary.totalActiveKcal : 0}
          totalWaterMl={summary.totalWaterMl}
          stepsUnavailable={!metricsLive}
        />

        {metricsLive ? (
          <PeakWalkInsightCard
            peakWindow={summary.peakWalkWindow}
            notificationCopy={summary.peakWalkNotification}
            bestDayLabel={bestDayLabel}
          />
        ) : null}

        {metricsLive ? (
          <View className="gap-3">
            <SectionLabel>Steps</SectionLabel>
            <Card className="gap-3 p-4" style={mizoraCardElevationStyle(isDark)}>
              <TitleSubtitleBlock
                title="Daily steps"
                subtitle="Slide the chart to compare each day."
              />
              <WeekStepsSelector />
            </Card>
          </View>
        ) : null}

        <View className="gap-3">
          <SectionLabel>Water</SectionLabel>
          <Card className="gap-3 p-4" style={mizoraCardElevationStyle(isDark)}>
            <TitleSubtitleBlock
              title="Hydration"
              subtitle="Logged glasses this week (today syncs from your tracker)."
            />
            <WeekWaterSelector />
          </Card>
        </View>

        {metricsLive ? (
          <View className="gap-3">
            <SectionLabel>Calories</SectionLabel>
            <Card className="gap-3 p-4" style={mizoraCardElevationStyle(isDark)}>
              <TitleSubtitleBlock
                title="Active calories"
                subtitle="Estimated from your step count each day."
              />
              <WeekCaloriesSelector />
            </Card>
          </View>
        ) : null}
      </ScrollView>
    </ThemedScreen>
  );
}
