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
  const isComplete = state === 'complete';
  const isTodayOpen = state === 'today-open';
  const isMissed = state === 'missed';
  const isFuture = state === 'future';

  const bg = isComplete
    ? '#ddfb43'
    : isTodayOpen
      ? '#ffffff'
      : isMissed
        ? '#fff6f6'
        : 'transparent';
  const borderWidth = isTodayOpen ? 2 : isMissed ? 1.5 : isFuture ? 1 : 0;
  const borderColor = isTodayOpen ? '#ddfb43' : isMissed ? '#f5c2c2' : '#e5ece2';
  const textColor = isTodayOpen ? '#141c12' : isMissed ? '#c92a2a' : '#8e8e93';
  const labelColor = isMissed ? '#b54545' : '#8e8e93';

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
};

export function StreakWeekProgressCard({ streakDays }: StreakWeekProgressCardProps) {
  const week = buildStreakWeekDays();

  const subtitle =
    streakDays >= 2
      ? `You're on a ${streakDays}-day streak! 🔥`
      : streakDays === 1
        ? 'One day down — stack another tomorrow.'
        : 'Hit today’s step goal to start your streak.';

  return (
    <Card className="p-4">
      <Text style={{ fontFamily: fonts.medium, fontSize: 16, color: '#141c12' }}>Streak</Text>
      <Text
        style={{
          fontFamily: fonts.regular,
          fontSize: 13,
          color: '#626b5e',
          marginTop: 4,
        }}
      >
        {subtitle}
      </Text>
      <View className="mt-3 h-px bg-[#ebefea]" />
      <View className="flex-row justify-between px-0.5 pt-4">
        {week.map((day: StreakWeekDayUi, i) => (
          <WeekDayDot
            key={day.dateKey}
            label={WEEK_LABELS[i] ?? '·'}
            state={streakWeekDayUiState(day)}
            letter={WEEK_LABELS[i] ?? day.weekday.charAt(0)}
          />
        ))}
      </View>
    </Card>
  );
}
