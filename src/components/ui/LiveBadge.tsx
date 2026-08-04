import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { fonts } from '@/theme/tokens';

/** Matches calories / metric flame badge — one Live style app-wide. */
const LIVE_STYLE = {
  backgroundColor: 'rgba(248,255,210,0.85)',
  textColor: '#734a00',
  dotColor: '#c8f526',
  dotCore: '#49a621',
} as const;

type LiveBadgeProps = {
  /** sm = section headers, md = detail hero, xs = compact previews */
  size?: 'xs' | 'sm' | 'md';
};

function LivePulseDot({ outerSize }: { outerSize: number }) {
  const blink = useSharedValue(0.35);
  const innerSize = Math.max(3, Math.round(outerSize * 0.38));

  useEffect(() => {
    blink.value = withRepeat(
      withSequence(
        withTiming(0.15, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.42, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [blink]);

  const outerStyle = useAnimatedStyle(() => ({
    opacity: blink.value,
  }));

  const box = outerSize + 4;

  return (
    <View
      className="items-center justify-center"
      style={{ width: box, height: box, marginLeft: 4 }}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: outerSize,
            height: outerSize,
            borderRadius: outerSize / 2,
            backgroundColor: LIVE_STYLE.dotColor,
          },
          outerStyle,
        ]}
      />
      <View
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: LIVE_STYLE.dotCore,
        }}
      />
    </View>
  );
}

const SIZE_CONFIG = {
  xs: { fontSize: 10, paddingH: 8, paddingV: 4, dot: 8 },
  sm: { fontSize: 12, paddingH: 10, paddingV: 6, dot: 10 },
  md: { fontSize: 11, paddingH: 10, paddingV: 4, dot: 8 },
} as const;

export function LiveBadge({ size = 'md' }: LiveBadgeProps) {
  const dims = SIZE_CONFIG[size];

  return (
    <View
      className="flex-row items-center rounded-full"
      style={{
        backgroundColor: LIVE_STYLE.backgroundColor,
        paddingHorizontal: dims.paddingH,
        paddingVertical: dims.paddingV,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: dims.fontSize,
          color: LIVE_STYLE.textColor,
        }}
      >
        Live
      </Text>
      <LivePulseDot outerSize={dims.dot} />
    </View>
  );
}
