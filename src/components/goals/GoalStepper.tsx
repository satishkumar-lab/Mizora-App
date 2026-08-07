import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

type GoalStepperProps = {
  valueLabel: string;
  unitLabel?: string;
  hint?: string;
  variant?: 'hero' | 'compact';
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseDisabled?: boolean;
  increaseDisabled?: boolean;
};

function StepperButton({
  icon,
  onPress,
  disabled,
  size,
}: {
  icon: 'remove' | 'add';
  onPress: () => void;
  disabled?: boolean;
  size: 'hero' | 'compact';
}) {
  const { colors, isDark } = useMizoraTheme();
  const dim = size === 'hero' ? 52 : 44;
  const idleBg = isDark ? colors.surfaceSecondary : '#fafbf4';
  const pressedBg = isDark ? colors.surfaceMuted : '#f5ffbb';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      className="items-center justify-center rounded-full"
      style={({ pressed }) => ({
        width: dim,
        height: dim,
        borderWidth: 1,
        borderColor: colors.borderDivider,
        backgroundColor: pressed && !disabled ? pressedBg : idleBg,
        opacity: disabled ? 0.38 : 1,
      })}
    >
      <Ionicons name={icon} size={size === 'hero' ? 24 : 20} color={colors.textStrong} />
    </Pressable>
  );
}

export function GoalStepper({
  valueLabel,
  unitLabel,
  hint,
  variant = 'compact',
  onDecrease,
  onIncrease,
  decreaseDisabled,
  increaseDisabled,
}: GoalStepperProps) {
  const { colors, isDark } = useMizoraTheme();
  const isHero = variant === 'hero';
  const valueBg = isDark ? colors.surfaceSecondary : '#ffffff';

  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between gap-3">
        <StepperButton
          icon="remove"
          onPress={onDecrease}
          disabled={decreaseDisabled}
          size={variant}
        />
        <View
          className="flex-1 items-center rounded-[15px] px-3"
          style={{
            paddingVertical: isHero ? 14 : 10,
            borderWidth: 1,
            borderColor: colors.borderDivider,
            backgroundColor: valueBg,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: isHero ? 28 : 22,
              color: colors.textStrong,
              lineHeight: isHero ? 32 : 26,
              letterSpacing: -0.5,
            }}
          >
            {valueLabel}
          </Text>
          {unitLabel ? (
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: isHero ? 12 : 11,
                color: colors.textSecondary,
                marginTop: 2,
              }}
            >
              {unitLabel}
            </Text>
          ) : null}
        </View>
        <StepperButton icon="add" onPress={onIncrease} disabled={increaseDisabled} size={variant} />
      </View>
      {hint ? (
        <Text
          className="text-center"
          style={{ fontFamily: fonts.medium, fontSize: 10, color: colors.textMuted }}
        >
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
