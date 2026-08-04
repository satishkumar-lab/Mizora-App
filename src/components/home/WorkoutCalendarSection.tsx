import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { CalendarOutlineIcon } from '@/components/icons/CalendarOutlineIcon';
import { FlameOutlineIcon } from '@/components/icons/FlameOutlineIcon';
import { CalendarDayPill } from '@/components/ui/CalendarDayPill';
import { Card } from '@/components/ui/Card';
import { CircleIconButton, useCircleIconButtonStyle } from '@/components/ui/CircleIconButton';
import {
  buildHomeWeekPills,
  computeCurrentStreakThroughToday,
  isStreakDayComplete,
  STREAK_DAILY_STEP_GOAL,
} from '@/lib/streakCalendar';
import { STEPS_TODAY } from '@/constants/stepsToday';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

function formatStreakCount(days: number): string {
  return String(Math.max(0, days)).padStart(2, '0');
}

function streakHeroCopy(streakDays: number): { label: string; headline: string; detail: string } {
  const today = STEPS_TODAY.week.find((d) => d.isToday);
  const todayMet = today !== undefined && isStreakDayComplete(today.steps, STREAK_DAILY_STEP_GOAL);

  if (streakDays === 0) {
    return {
      label: 'Streak',
      headline: 'No active streak',
      detail: `${STREAK_DAILY_STEP_GOAL.toLocaleString()}+ steps today starts day one`,
    };
  }

  if (!todayMet) {
    return {
      label: 'Step streak',
      headline: streakDays === 1 ? 'Day in a row' : 'Days in a row',
      detail: `Hit today’s goal to reach ${streakDays + 1}`,
    };
  }

  return {
    label: 'Step streak',
    headline: streakDays === 1 ? 'Day in a row' : 'Days in a row',
    detail: 'Goal met today — streak safe',
  };
}

function CalendarNavButton() {
  const router = useRouter();
  const { iconColor } = useCircleIconButtonStyle(40);

  return (
    <CircleIconButton
      size={40}
      onPress={() => router.push('/streak')}
      accessibilityLabel="Open streak calendar"
      style={{ zIndex: 2 }}
    >
      <CalendarOutlineIcon size={18} color={iconColor} />
    </CircleIconButton>
  );
}

function StreakHeroBand({ streakDays }: { streakDays: number }) {
  const { label, headline, detail } = streakHeroCopy(streakDays);
  const showFlame = streakDays >= 2;
  const { colors } = useMizoraTheme();

  return (
    <View className="flex-row items-center" style={{ gap: 14 }}>
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 32,
          color: colors.textStrong,
          lineHeight: 34,
          letterSpacing: -0.5,
          fontVariant: ['tabular-nums'],
          minWidth: 40,
        }}
      >
        {formatStreakCount(streakDays)}
      </Text>

      <View className="min-w-0 flex-1" style={{ gap: 4 }}>
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: 11,
            color: colors.textMuted,
            letterSpacing: 0.3,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </Text>
        <View className="flex-row flex-wrap items-center gap-1">
          <Text
            numberOfLines={1}
            style={{
              fontFamily: fonts.medium,
              fontSize: 16,
              color: colors.textStrong,
              lineHeight: 19,
            }}
          >
            {headline}
          </Text>
          {showFlame ? <FlameOutlineIcon size={15} color={colors.textAccentGreen} /> : null}
        </View>
        <Text
          numberOfLines={2}
          style={{
            fontFamily: fonts.regular,
            fontSize: 12,
            color: colors.textSecondary,
            lineHeight: 16,
          }}
        >
          {detail}
        </Text>
      </View>

      <CalendarNavButton />
    </View>
  );
}

/** “This week” row — keep layout unchanged when editing hero above. */
function StreakThisWeekSection() {
  const pills = buildHomeWeekPills(STREAK_DAILY_STEP_GOAL);
  const { colors } = useMizoraTheme();

  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.textSecondary }}>
        This week
      </Text>
      <View className="flex-row gap-1">
        {pills.map((d) => (
          <View key={`${d.weekday}-${d.day}`} className="flex-1">
            <CalendarDayPill day={d} compact />
          </View>
        ))}
      </View>
    </View>
  );
}

export function WorkoutCalendarSection() {
  const streakDays = computeCurrentStreakThroughToday();

  return (
    <Card className="gap-0 rounded-[24px] p-4">
      <StreakHeroBand streakDays={streakDays} />
      <View className="my-4 h-px bg-[#f2f3f0] dark:bg-[#2a332a]" />
      <StreakThisWeekSection />
    </Card>
  );
}
