import { Text, View } from 'react-native';

import { WATER_VISUAL } from '@/constants/waterTheme';
import { fonts } from '@/theme/tokens';

type WaterIntakeSegmentsProps = {
  loggedMl: number;
  goalMl: number;
  mlPerSegment: number;
};

/** 250 ml blocks — scannable progress without glass clipart. */
export function WaterIntakeSegments({ loggedMl, goalMl, mlPerSegment }: WaterIntakeSegmentsProps) {
  const totalSegments = Math.max(1, Math.ceil(goalMl / mlPerSegment));
  const filledSegments = Math.min(totalSegments, Math.floor(loggedMl / mlPerSegment));
  const partial = (loggedMl % mlPerSegment) / mlPerSegment;

  return (
    <View className="gap-2">
      <View className="flex-row flex-wrap gap-1.5">
        {Array.from({ length: totalSegments }, (_, i) => {
          const isFull = i < filledSegments;
          const isPartial = i === filledSegments && partial > 0;
          const fillRatio = isFull ? 1 : isPartial ? partial : 0;

          return (
            <View
              key={i}
              style={{
                width: totalSegments > 16 ? 10 : 12,
                height: totalSegments > 16 ? 22 : 26,
                borderRadius: 4,
                backgroundColor: WATER_VISUAL.track,
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: `${fillRatio * 100}%`,
                  backgroundColor: fillRatio > 0.65 ? WATER_VISUAL.fill : WATER_VISUAL.fillBright,
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                }}
              />
            </View>
          );
        })}
      </View>
      <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: '#626b5e' }}>
        {loggedMl.toLocaleString()} / {goalMl.toLocaleString()} ml · {mlPerSegment} ml per block
      </Text>
    </View>
  );
}
