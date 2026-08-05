import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { StatusBar } from 'expo-status-bar';

import { CalendarOutlineIcon } from '@/components/icons/CalendarOutlineIcon';
import { CircleIconButton, useCircleIconButtonStyle } from '@/components/ui/CircleIconButton';
import { StreakAchievementsCard } from '@/components/streak/StreakAchievementsCard';
import { StreakHeroMainCard } from '@/components/streak/StreakHeroMainCard';
import { StreakPersonalRecordsCard } from '@/components/streak/StreakPersonalRecordsCard';
import { StreakWeekProgressCard } from '@/components/streak/StreakWeekProgressCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { getLocalTodayParts } from '@/constants/streakHistory';
import { useSteps } from '@/providers/StepsProvider';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import {
  computeCurrentStreakThroughToday,
  isStreakDayComplete,
  stepsForDateKey,
  STREAK_DAILY_STEP_GOAL,
} from '@/lib/streakCalendar';
import { achievementPreview } from '@/constants/achievements';
import { buildPersonalRecords } from '@/lib/streakStats';

function todayDateKey(): string {
  const t = getLocalTodayParts();
  return `${t.year}-${String(t.month).padStart(2, '0')}-${String(t.day).padStart(2, '0')}`;
}

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

  const { todaySteps: liveTodaySteps } = useSteps();

  const streakDays = useMemo(() => computeCurrentStreakThroughToday(), []);
  const todaySteps = useMemo(
    () => Math.max(stepsForDateKey(todayDateKey()), liveTodaySteps),
    [liveTodaySteps],
  );
  const todayComplete = useMemo(
    () => isStreakDayComplete(todaySteps, STREAK_DAILY_STEP_GOAL),
    [todaySteps],
  );
  const personalRecords = useMemo(() => buildPersonalRecords(), []);
  const achievementBadges = useMemo(() => achievementPreview(), []);

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
            <StreakHeroMainCard
              streakDays={streakDays}
              todaySteps={todaySteps}
              todayComplete={todayComplete}
            />

            <StreakAchievementsCard badges={achievementBadges} />
            <StreakWeekProgressCard streakDays={streakDays} />
            <StreakPersonalRecordsCard records={personalRecords} />
          </View>
        </ScrollView>
      </ThemedScreen>
    </>
  );
}
