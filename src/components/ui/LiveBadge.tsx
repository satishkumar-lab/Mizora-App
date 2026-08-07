import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { StepsTrackingStatus } from '@/lib/health/readTodaySteps';
import { liveBadgePresentation } from '@/lib/health/stepsTrackingUi';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { mizoraType } from '@/theme/typography';

type LiveBadgeProps = {
  /** sm = section headers, md = detail hero, xs = compact previews */
  size?: 'xs' | 'sm' | 'md';
  /** Step tracking status — omit on non-step surfaces (e.g. water) to show static Live. */
  trackingStatus?: StepsTrackingStatus;
};

const PULSE_MS = 1100;

function LivePulseDot({ diameter, color }: { diameter: number; color: string }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: PULSE_MS, easing: Easing.out(Easing.cubic) }),
        withTiming(0, { duration: 0 }),
      ),
      -1,
      false,
    );
  }, [progress]);

  const ringStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 2.35]);
    const opacity = interpolate(progress.value, [0, 0.35, 1], [0.75, 0.4, 0]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const coreStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.5, 1], [1, 0.88, 1]),
    transform: [
      {
        scale: interpolate(progress.value, [0, 0.45, 1], [1, 0.92, 1]),
      },
    ],
  }));

  const core = Math.max(6, diameter);
  const ring = core + 2;
  const box = core + 10;

  return (
    <View
      className="items-center justify-center"
      style={{ width: box, height: box, marginLeft: 5 }}
    >
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: ring,
            height: ring,
            borderRadius: ring / 2,
            backgroundColor: color,
          },
          ringStyle,
        ]}
      />
      <Animated.View
        style={[
          {
            width: core,
            height: core,
            borderRadius: core / 2,
            backgroundColor: color,
            borderWidth: 1.5,
            borderColor: '#1e6b38',
            shadowColor: color,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.55,
            shadowRadius: 3,
            elevation: 2,
          },
          coreStyle,
        ]}
      />
    </View>
  );
}

function StaticStatusDot({ diameter, color }: { diameter: number; color: string }) {
  const core = Math.max(6, diameter);
  return (
    <View
      style={{
        width: core,
        height: core,
        borderRadius: core / 2,
        backgroundColor: color,
        marginLeft: 8,
      }}
    />
  );
}

const SIZE_CONFIG = {
  xs: { type: mizoraType.liveBadgeXs, paddingH: 8, paddingV: 4, dot: 7 },
  sm: { type: mizoraType.liveBadge, paddingH: 10, paddingV: 6, dot: 8 },
  md: { type: mizoraType.liveBadge, paddingH: 10, paddingV: 4, dot: 8 },
} as const;

export function LiveBadge({ size = 'md', trackingStatus = 'ready' }: LiveBadgeProps) {
  const { isDark } = useMizoraTheme();
  const dims = SIZE_CONFIG[size];
  const presentation = liveBadgePresentation(trackingStatus);

  const liveStyles = {
    pillBg: isDark ? 'rgba(52, 199, 89, 0.18)' : 'rgba(248, 255, 210, 0.92)',
    pillBorder: isDark ? 'rgba(52, 199, 89, 0.45)' : 'rgba(52, 199, 89, 0.35)',
    textColor: isDark ? '#b8f5c8' : '#1e5c32',
    dotColor: '#34c759',
  };

  const syncStyles = {
    pillBg: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(244, 246, 243, 0.95)',
    pillBorder: isDark ? 'rgba(255, 255, 255, 0.14)' : '#e5ece2',
    textColor: isDark ? colorsMuted(isDark) : '#626b5e',
    dotColor: isDark ? '#8e9389' : '#8e8e93',
  };

  const offStyles = {
    pillBg: isDark ? 'rgba(255, 149, 0, 0.12)' : 'rgba(255, 244, 229, 0.95)',
    pillBorder: isDark ? 'rgba(255, 149, 0, 0.35)' : 'rgba(255, 149, 0, 0.35)',
    textColor: isDark ? '#ffc080' : '#9a5b00',
    dotColor: isDark ? '#ff9500' : '#ff9500',
  };

  const palette =
    presentation.tone === 'live'
      ? liveStyles
      : presentation.tone === 'sync'
        ? syncStyles
        : offStyles;

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Step tracking ${presentation.label}`}
      className="flex-row items-center rounded-full"
      style={{
        backgroundColor: palette.pillBg,
        borderWidth: 1,
        borderColor: palette.pillBorder,
        paddingHorizontal: dims.paddingH,
        paddingVertical: dims.paddingV,
      }}
    >
      <Text
        style={{
          ...dims.type,
          color: palette.textColor,
        }}
      >
        {presentation.label}
      </Text>
      {presentation.showPulse ? (
        <LivePulseDot diameter={dims.dot} color={palette.dotColor} />
      ) : (
        <StaticStatusDot diameter={dims.dot} color={palette.dotColor} />
      )}
    </View>
  );
}

function colorsMuted(isDark: boolean): string {
  return isDark ? '#c7cfc4' : '#626b5e';
}
