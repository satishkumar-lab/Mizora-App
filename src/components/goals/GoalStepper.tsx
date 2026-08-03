import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  const dim = size === 'hero' ? 52 : 44;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      className="items-center justify-center rounded-full border border-[#ebefea]"
      style={({ pressed }) => ({
        width: dim,
        height: dim,
        backgroundColor: pressed && !disabled ? '#f5ffbb' : '#fafbf4',
        opacity: disabled ? 0.38 : 1,
      })}
    >
      <Ionicons name={icon} size={size === 'hero' ? 24 : 20} color="#141c12" />
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
  const isHero = variant === 'hero';

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
          className="flex-1 items-center rounded-[15px] border border-[#f2f3f0] bg-white px-3"
          style={{ paddingVertical: isHero ? 14 : 10 }}
        >
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: isHero ? 28 : 22,
              color: '#141c12',
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
                color: '#626b5e',
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
          style={{ fontFamily: fonts.medium, fontSize: 10, color: '#8e8e93' }}
        >
          {hint}
        </Text>
      ) : null}
    </View>
  );
}
