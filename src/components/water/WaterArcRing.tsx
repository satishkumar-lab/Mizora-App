import Svg, { Path } from 'react-native-svg';
import { Text, View } from 'react-native';

import { RING_PATH_LENGTH, RING_TRACK_PATH } from '@/components/steps/StepsArcRing';
import { WATER_PAGE } from '@/constants/waterTheme';
import { formatLitersValueFromMl } from '@/lib/water-recommendation';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

const VIEW_W = 140;
const VIEW_H = 114;
const WIDTH = 168;

type WaterArcRingProps = {
  currentMl: number;
  goalMl: number;
};

function ringLayout() {
  const scale = WIDTH / VIEW_W;
  const svgHeight = VIEW_H * scale;
  const valueTop = 40 * scale;
  const containerHeight = svgHeight + 2;
  return { width: WIDTH, svgHeight, valueTop, containerHeight };
}

export function WaterArcRing({ currentMl, goalMl }: WaterArcRingProps) {
  const { colors } = useMizoraTheme();
  const progress = Math.min(Math.max(currentMl / Math.max(goalMl, 1), 0), 1);
  const strokeDashoffset = RING_PATH_LENGTH * (1 - progress);
  const dims = ringLayout();
  const goalLabel = `${formatLitersValueFromMl(goalMl)} L`;

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
            stroke={WATER_PAGE.fill}
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
            paddingHorizontal: 6,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 26,
              lineHeight: 28,
              color: WATER_PAGE.fill,
              textAlign: 'center',
            }}
          >
            {formatLitersValueFromMl(currentMl)} L
          </Text>
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: 11,
              color: colors.textSecondary,
              textAlign: 'center',
              marginTop: 2,
            }}
          >
            logged today
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 10,
              color: colors.textMuted,
              textAlign: 'center',
              marginTop: 2,
            }}
          >
            of {goalLabel} daily goal
          </Text>
        </View>
      </View>
    </View>
  );
}
