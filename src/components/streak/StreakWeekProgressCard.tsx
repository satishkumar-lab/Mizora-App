import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon';
import { Card } from '@/components/ui/Card';
import {
  buildStreakWeekDays,
  streakWeekDayUiState,
  type StreakWeekDayUi,
  type StreakWeekDayUiState,
} from '@/lib/streakCalendar';
import { useSteps } from '@/providers/StepsProvider';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { themedHairlineColor } from '@/utils/chartGridStyle';
import { fonts } from '@/theme/tokens';

const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;
const DOT = 40;
const CHECK_SIZE = 22;

function WeekDayDot({
  label,
  state,
  letter,
}: {
  label: string;
  state: StreakWeekDayUiState;
  letter: string;
}) {
  const { colors, isDark } = useMizoraTheme();
  const isComplete = state === 'complete';
  const isTodayOpen = state === 'today-open';
  const isMissed = state === 'missed';
  const isFuture = state === 'future';

  const bg = isComplete
    ? '#ddfb43'
    : isTodayOpen
      ? isDark
        ? colors.card
        : '#ffffff'
      : isMissed
        ? isDark
          ? '#2a1818'
          : '#fff6f6'
        : 'transparent';
  const borderWidth = isTodayOpen ? 2 : isMissed ? 1.5 : isFuture ? 1 : 0;
  const borderColor = isTodayOpen
    ? '#ddfb43'
    : isMissed
      ? isDark
        ? '#5c3030'
        : '#f5c2c2'
      : isDark
        ? colors.borderDivider
        : '#e5ece2';
  const textColor = isTodayOpen
    ? colors.textStrong
    : isMissed
      ? isDark
        ? '#fca5a5'
        : '#c92a2a'
      : colors.textMuted;
  const labelColor = isMissed ? (isDark ? '#f87171' : '#b54545') : colors.textMuted;

  return (
    <View className="flex-1 items-center" style={{ gap: 6 }}>
      <View
        style={{
          width: DOT,
          height: DOT,
          borderRadius: DOT / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: bg,
          borderWidth,
          borderColor,
        }}
      >
        {isComplete ? (
          <View
            className="items-center justify-center rounded-full bg-white/90"
            style={{ width: 28, height: 28 }}
          >
            <CheckmarkIcon size={CHECK_SIZE} color="#34c759" />
          </View>
        ) : isMissed ? (
          <Ionicons name="close" size={20} color="#e03131" />
        ) : (
          <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: textColor }}>{letter}</Text>
        )}
      </View>
      <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: labelColor }}>{label}</Text>
    </View>
  );
}

type StreakWeekProgressCardProps = {
  streakDays: number;
  metricsLive?: boolean;
};

export function StreakWeekProgressCard({
  streakDays,
  metricsLive = true,
}: StreakWeekProgressCardProps) {
  const { goal } = useSteps();
  const week = buildStreakWeekDays();
  const { colors, isDark } = useMizoraTheme();
  const hairline = themedHairlineColor(isDark, colors);

  const subtitle = !metricsLive
    ? 'Step streaks resume when live step tracking is on.'
    : streakDays >= 2
      ? `You're on a ${streakDays}-day streak! 🔥`
      : streakDays === 1
        ? 'One day down — stack another tomorrow.'
        : 'Hit today’s step goal to start your streak.';

  return (
    <Card className="p-4">
      <Text style={{ fontFamily: fonts.medium, fontSize: 16, color: colors.textStrong }}>
        Streak
      </Text>
      <Text
        style={{
          fontFamily: fonts.regular,
          fontSize: 13,
          color: colors.textSecondary,
          marginTop: 4,
        }}
      >
        {subtitle}
      </Text>
      <View className="mt-3 h-px" style={{ backgroundColor: hairline }} />
      {metricsLive ? (
        <View className="flex-row justify-between px-0.5 pt-4">
          {week.map((day: StreakWeekDayUi, i) => (
            <WeekDayDot
              key={day.dateKey}
              label={WEEK_LABELS[i] ?? '·'}
              state={streakWeekDayUiState(day, undefined, goal)}
              letter={WEEK_LABELS[i] ?? day.weekday.charAt(0)}
            />
          ))}
        </View>
      ) : (
        <Text
          style={{
            fontFamily: fonts.regular,
            fontSize: 12,
            color: colors.textMuted,
            lineHeight: 16,
            marginTop: 12,
          }}
        >
          Daily goal markers appear here once step tracking is available.
        </Text>
      )}
    </Card>
  );
}
