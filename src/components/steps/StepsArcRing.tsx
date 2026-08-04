import Svg, { Path } from 'react-native-svg';
import { Text, View } from 'react-native';

import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

export const RING_TRACK_PATH =
  'M18.5214 110.5C9.13313 99.2031 3.5 84.7596 3.5 69.0198C3.5 32.8342 33.2731 3.5 70 3.5C106.727 3.5 136.5 32.8342 136.5 69.0198C136.5 84.7596 130.867 99.2031 121.479 110.5';

/** Measured length of `RING_TRACK_PATH` in viewBox units (was ~236; under-filled arcs at 100%). */
export const RING_PATH_LENGTH = 297;

const VIEW_W = 140;
const VIEW_H = 114;

type StepsArcRingProps = {
  steps: number;
  goal: number;
  size?: 'card' | 'cardSpacious' | 'hero';
  showBadge?: boolean;
};

const SIZE_WIDTH = {
  card: 140,
  cardSpacious: 168,
  hero: 196,
} as const;

function ringLayout(width: number, size: StepsArcRingProps['size']) {
  const scale = width / VIEW_W;
  const svgHeight = VIEW_H * scale;
  const valueTop = 38 * scale;
  const isHero = size === 'hero';
  const isCompactCard = size === 'card';
  const valueSize = isHero ? 28 : isCompactCard ? 23.4 : 26;
  const labelSize = 12;
  const badgeBottom = isHero ? 2 : isCompactCard ? 0 : 2;
  const containerHeight = svgHeight + (isHero ? 8 : isCompactCard ? 4 : 6);

  return { width, scale, svgHeight, valueTop, valueSize, labelSize, badgeBottom, containerHeight };
}

export function StepsArcRing({ steps, goal, size = 'card', showBadge = true }: StepsArcRingProps) {
  const { colors, isDark } = useMizoraTheme();
  const progress = Math.min(Math.max(steps / goal, 0), 1);
  const percentLabel = `${Math.round(progress * 100)}%`;
  const dims = ringLayout(SIZE_WIDTH[size], size);

  /** Single continuous stroke — avoids Android pathLength dash fragmentation */
  const strokeDashoffset = RING_PATH_LENGTH * (1 - progress);

  return (
    <View className="items-center">
      <View style={{ width: dims.width, height: dims.containerHeight }}>
        <Svg width={dims.width} height={dims.svgHeight} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
          <Path
            d={RING_TRACK_PATH}
            stroke={colors.track}
            strokeWidth={7}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d={RING_TRACK_PATH}
            stroke="#DDFB43"
            strokeWidth={7}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${RING_PATH_LENGTH} ${RING_PATH_LENGTH}`}
            strokeDashoffset={strokeDashoffset}
          />
        </Svg>

        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: dims.valueTop,
            alignItems: 'center',
            paddingHorizontal: 8,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: dims.valueSize,
              lineHeight: dims.valueSize + 2,
              color: colors.textStrong,
              textAlign: 'center',
              width: '100%',
            }}
          >
            {steps.toLocaleString()}
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: dims.labelSize,
              color: colors.textSecondary,
              textAlign: 'center',
              width: '100%',
              marginTop: size === 'hero' ? 0 : 1,
            }}
          >
            of {goal.toLocaleString()} steps
          </Text>
        </View>

        {showBadge ? (
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: dims.badgeBottom,
              alignItems: 'center',
            }}
          >
            <View
              className="rounded-full px-2 py-1"
              style={{ backgroundColor: isDark ? '#2a332a' : '#eaffe3' }}
            >
              <Text style={{ fontSize: size === 'hero' ? 11 : 10, textAlign: 'center' }}>
                <Text style={{ fontFamily: fonts.medium, color: '#49a621' }}>{percentLabel} </Text>
                <Text style={{ fontFamily: fonts.medium, color: colors.textSecondary }}>
                  of daily goal
                </Text>
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}
