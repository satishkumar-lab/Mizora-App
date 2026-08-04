import Svg, { Circle } from 'react-native-svg';
import { Text, View } from 'react-native';

import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

const SIZE = 196;
const STROKE = 12;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

type UnlockRuleProgressRingProps = {
  progress: number;
  unlocked: boolean;
};

function statusLabel(pct: number, unlocked: boolean): string {
  if (unlocked) return 'Unlocked!';
  if (pct >= 85) return 'Almost there';
  if (pct >= 40) return 'Keep going';
  return 'Start moving';
}

/** Full-ring unlock progress — concentric guides + center score (reference: focus gauge). */
export function UnlockRuleProgressRing({ progress, unlocked }: UnlockRuleProgressRingProps) {
  const { colors, isDark } = useMizoraTheme();
  const clamped = Math.min(Math.max(progress, 0), 1);
  const pct = Math.round(clamped * 100);
  const dash = C * clamped;
  const status = statusLabel(pct, unlocked);

  return (
    <View className="items-center py-2">
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE} style={{ transform: [{ rotate: '-90deg' }] }}>
          {[1, 0.78, 0.56].map((scale, i) => (
            <Circle
              key={`guide-${i}`}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R * scale}
              stroke={isDark ? colors.border : '#ebefea'}
              strokeWidth={1}
              fill="none"
              opacity={0.55 - i * 0.12}
            />
          ))}
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={colors.track}
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
          />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            stroke={unlocked ? '#34c759' : '#34c759'}
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${C}`}
          />
        </Svg>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
        >
          <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: colors.textSecondary }}>
            Unlock progress
          </Text>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 44,
              lineHeight: 48,
              color: colors.textStrong,
              letterSpacing: -1,
              marginTop: 2,
            }}
          >
            {pct}
          </Text>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 15,
              color: unlocked ? '#34c759' : '#5c6d05',
              marginTop: 2,
            }}
          >
            {status}
          </Text>
        </View>
      </View>
    </View>
  );
}
