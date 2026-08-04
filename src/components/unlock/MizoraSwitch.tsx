import { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type MizoraSwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

const TRACK_W = 50;
const TRACK_H = 30;
const THUMB = 26;
const PAD = 2;
const TRAVEL = TRACK_W - THUMB - PAD * 2;

const SPRING = { damping: 18, stiffness: 280, mass: 0.6 };

/** Custom switch — animated Mizora lime track, no native Switch chrome. */
export function MizoraSwitch({ value, onValueChange, disabled }: MizoraSwitchProps) {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, SPRING);
  }, [value, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], ['#e8ece6', '#d4f829']),
    borderColor: interpolateColor(progress.value, [0, 1], ['#dde2da', '#b8e020']),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * TRAVEL }],
  }));

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled: !!disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      hitSlop={8}
    >
      <Animated.View
        style={[
          {
            width: TRACK_W,
            height: TRACK_H,
            borderRadius: TRACK_H / 2,
            borderWidth: 1,
            padding: PAD,
            justifyContent: 'center',
            opacity: disabled ? 0.42 : 1,
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: THUMB,
              height: THUMB,
              borderRadius: THUMB / 2,
              backgroundColor: '#ffffff',
              shadowColor: '#141c12',
              shadowOpacity: 0.12,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 3,
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
