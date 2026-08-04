import { Pressable, Text, View } from 'react-native';

import { FlameOutlineIcon } from '@/components/icons/FlameOutlineIcon';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

export type CalendarDayPillVariant = 'active' | 'today' | 'future';

export type CalendarDayPillModel = {
  weekday: string;
  day: string;
  variant: CalendarDayPillVariant;
  streak?: boolean;
};

type CalendarDayPillProps = {
  day: CalendarDayPillModel;
  onPress?: () => void;
  compact?: boolean;
};

/** Home workout calendar pill — reused on steps week view */
export function CalendarDayPill({ day, onPress, compact }: CalendarDayPillProps) {
  const { colors, isDark } = useMizoraTheme();
  const isLimeFill = day.variant === 'active';
  const isToday = day.variant === 'today';

  const body = (
    <View
      className={`items-center justify-center rounded-[25px] ${compact ? 'h-[76px] w-full' : 'h-[84px] w-[50px]'}`}
      style={{
        backgroundColor: isLimeFill ? '#ddfb43' : isDark ? colors.card : '#ffffff',
        borderWidth: isToday ? 2 : day.variant === 'future' ? 1 : 0,
        borderColor: isToday ? '#ddfb43' : isDark ? colors.border : '#e5e7eb',
      }}
    >
      <View className="items-center gap-1">
        {day.streak ? (
          <FlameOutlineIcon size={14} color={isLimeFill ? '#1e2c00' : colors.textAccentGreen} />
        ) : null}
        <Text
          className="text-xs"
          style={{
            fontFamily: fonts.regular,
            color: isLimeFill ? '#1e2c00' : colors.textSecondary,
          }}
        >
          {day.weekday}
        </Text>
        <Text
          className="text-base"
          style={{ fontFamily: fonts.medium, color: isLimeFill ? '#1e2c00' : colors.textStrong }}
        >
          {day.day}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        className={compact ? 'flex-1' : undefined}
        style={compact ? { maxWidth: 50 } : undefined}
      >
        {body}
      </Pressable>
    );
  }

  return body;
}
