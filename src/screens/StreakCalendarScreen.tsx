import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedScreen } from '@/components/ui/ThemedScreen';

import { CalendarOutlineIcon } from '@/components/icons/CalendarOutlineIcon';
import { CircleIconButton, useCircleIconButtonStyle } from '@/components/ui/CircleIconButton';
import { StreakAchievementsCard } from '@/components/streak/StreakAchievementsCard';
import { StreakHeroMainCard } from '@/components/streak/StreakHeroMainCard';
import { StreakPersonalRecordsCard } from '@/components/streak/StreakPersonalRecordsCard';
import { StreakWeekProgressCard } from '@/components/streak/StreakWeekProgressCard';
import {
  StreakThisWeekUnavailable,
  StreakTrackingUnavailableBand,
} from '@/components/streak/StreakTrackingUnavailableBand';
import { StepsPermissionStateCard } from '@/components/steps/StepsPermissionStateCard';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { achievementPreview } from '@/constants/achievements';
import { useStepsMetricsLive } from '@/hooks/useStepsMetricsLive';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { localTodayDateKey } from '@/lib/localDate';
import {
  computeCurrentStreakThroughToday,
  isStreakDayComplete,
  stepsForDateKey,
} from '@/lib/streakCalendar';
import { buildPersonalRecords } from '@/lib/streakStats';
import { useSteps } from '@/providers/StepsProvider';

function StreakHeaderCalendarIcon() {
  const { iconColor } = useCircleIconButtonStyle(36);
  return (
    <CircleIconButton size={36} accessibilityRole="none">
      <CalendarOutlineIcon size={18} color={iconColor} />
    </CircleIconButton>
  );
}

export function StreakCalendarScreen() {
  const insets = useSafeAreaInsets();
  const goBack = useMizoraBack('/home');
  const { isDark } = useMizoraTheme();
  const { metricsLive, status, runStepsSetupAction } = useStepsMetricsLive();
  const { todaySteps: liveTodaySteps, goal } = useSteps();

  const onRetry = () => {
    void runStepsSetupAction();
  };

  const todayKey = localTodayDateKey();

  const streakDays = useMemo(
    () => (metricsLive ? computeCurrentStreakThroughToday(undefined, goal) : 0),
    [goal, metricsLive],
  );
  const todaySteps = useMemo(() => {
    if (!metricsLive) {
      return 0;
    }
    return Math.max(stepsForDateKey(todayKey), liveTodaySteps);
  }, [liveTodaySteps, metricsLive, todayKey]);
  const todayComplete = useMemo(
    () => metricsLive && isStreakDayComplete(todaySteps, goal),
    [todaySteps, goal, metricsLive],
  );
  const personalRecords = useMemo(() => buildPersonalRecords(metricsLive), [metricsLive]);
  const achievementBadges = useMemo(
    () => (metricsLive ? achievementPreview(undefined, goal) : []),
    [goal, metricsLive],
  );

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader
            onBack={goBack}
            title="Streak Calendar"
            rightAccessory={<StreakHeaderCalendarIcon />}
          />
        </View>
        <ScrollView
          contentContainerClassName="px-5 pb-8"
          contentContainerStyle={{
            paddingTop: 8,
            paddingBottom: insets.bottom + MAIN_TAB_BAR_CLEARANCE,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 16 }}>
            {!metricsLive ? (
              <>
                <StepsPermissionStateCard status={status} onPrimaryPress={onRetry} />
                <Card className="gap-4 p-4">
                  <StreakTrackingUnavailableBand status={status} />
                  <View className="h-px bg-[#f2f3f0] dark:bg-[#2a332a]" />
                  <StreakThisWeekUnavailable />
                </Card>
                <StreakWeekProgressCard streakDays={0} metricsLive={false} />
              </>
            ) : (
              <>
                <StreakHeroMainCard
                  streakDays={streakDays}
                  todaySteps={todaySteps}
                  todayComplete={todayComplete}
                  stepGoal={goal}
                />
                <StreakWeekProgressCard streakDays={streakDays} metricsLive />
              </>
            )}

            <StreakPersonalRecordsCard records={personalRecords} />
            {metricsLive && achievementBadges.length > 0 ? (
              <StreakAchievementsCard badges={achievementBadges} />
            ) : null}
          </View>
        </ScrollView>
      </ThemedScreen>
    </>
  );
}
