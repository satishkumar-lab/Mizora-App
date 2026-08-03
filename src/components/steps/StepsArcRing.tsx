import Svg, { Path } from 'react-native-svg';
import { Text, View } from 'react-native';

import { fonts } from '@/theme/tokens';

export const RING_TRACK_PATH =
  'M18.5214 110.5C9.13313 99.2031 3.5 84.7596 3.5 69.0198C3.5 32.8342 33.2731 3.5 70 3.5C106.727 3.5 136.5 32.8342 136.5 69.0198C136.5 84.7596 130.867 99.2031 121.479 110.5';

/** Approx. path length in viewBox units (matches Figma arc); used without pathLength for Android */
const RING_PATH_LENGTH = 236;

const VIEW_W = 140;
const VIEW_H = 114;

type StepsArcRingProps = {
  steps: number;
  goal: number;
  size?: 'card' | 'hero';
  showBadge?: boolean;
};

const SIZE_WIDTH = {
  card: 140,
  hero: 196,
} as const;

function ringLayout(width: number) {
  const scale = width / VIEW_W;
  const svgHeight = VIEW_H * scale;
  const valueTop = 38 * scale;
  const valueSize = width === SIZE_WIDTH.card ? 23.4 : 28;
  const labelSize = width === SIZE_WIDTH.card ? 12 : 12;
  const badgeBottom = width === SIZE_WIDTH.card ? 0 : 2;
  const containerHeight = svgHeight + (width === SIZE_WIDTH.card ? 4 : 8);

  return { width, scale, svgHeight, valueTop, valueSize, labelSize, badgeBottom, containerHeight };
}

export function StepsArcRing({ steps, goal, size = 'card', showBadge = true }: StepsArcRingProps) {
  const progress = Math.min(Math.max(steps / goal, 0), 1);
  const percentLabel = `${Math.round(progress * 100)}%`;
  const dims = ringLayout(SIZE_WIDTH[size]);

  /** Single continuous stroke — avoids Android pathLength dash fragmentation */
  const strokeDashoffset = RING_PATH_LENGTH * (1 - progress);

  return (
    <View className="items-center">
      <View style={{ width: dims.width, height: dims.containerHeight }}>
        <Svg width={dims.width} height={dims.svgHeight} viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}>
          <Path
            d={RING_TRACK_PATH}
            stroke="#EBEFEA"
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
              color: '#000000',
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
              color: '#626b5e',
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
            <View className="rounded-full px-2 py-1" style={{ backgroundColor: '#eaffe3' }}>
              <Text style={{ fontSize: size === 'hero' ? 11 : 10, textAlign: 'center' }}>
                <Text style={{ fontFamily: fonts.medium, color: '#49a621' }}>{percentLabel} </Text>
                <Text style={{ fontFamily: fonts.medium, color: '#1d1d1d' }}>of daily goal</Text>
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}
