import { useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Polyline, Stop } from 'react-native-svg';

import { StepsHourlyValueRow } from '@/components/steps/StepsHourlyValueRow';
import {
  FULL_DAY_AXIS_LABELS,
  HOURLY_STEP_SLOTS,
  NARROW_DAY_AXIS_LABELS,
  type HourlyChartAxisMode,
} from '@/constants/hourlySteps';
import { fonts } from '@/theme/tokens';

const CHART_HEIGHT = 44;
const PADDING_X = 4;
const PADDING_Y = 6;
const GRADIENT_ID = 'homeHourlyStepsGradient';

function initialSelectedIndex(
  slots: readonly { label: string; steps: number; hour?: number }[],
): number {
  const now = new Date().getHours();
  const byHour = slots.findIndex((s) => s.hour === now);
  if (byHour >= 0) return byHour;
  return Math.min(now, slots.length - 1);
}

function indexFromX(x: number, width: number, count: number): number {
  if (width <= 0 || count <= 1) return 0;
  const innerW = width - PADDING_X * 2;
  const ratio = (x - PADDING_X) / innerW;
  return Math.min(count - 1, Math.max(0, Math.round(ratio * (count - 1))));
}

type StepsHourlyGradientCompactProps = {
  slots?: readonly { label: string; steps: number; hour?: number }[];
  axisMode?: HourlyChartAxisMode;
};

/** Home card — compact gradient area chart (detail-style). */
export function StepsHourlyGradientCompact({
  slots = HOURLY_STEP_SLOTS,
  axisMode = 'full',
}: StepsHourlyGradientCompactProps) {
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(() => initialSelectedIndex(slots));

  const maxSteps = useMemo(() => Math.max(...slots.map((s) => s.steps), 1), [slots]);

  const points = useMemo(() => {
    if (width <= 0) return [];
    const innerW = width - PADDING_X * 2;
    const innerH = CHART_HEIGHT - PADDING_Y * 2;
    const bottomY = PADDING_Y + innerH;
    return slots.map((slot, i) => {
      const x = PADDING_X + (i / Math.max(slots.length - 1, 1)) * innerW;
      const y = PADDING_Y + innerH - (slot.steps / maxSteps) * innerH;
      return { x, y, bottomY, ...slot };
    });
  }, [width, slots, maxSteps]);

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  const gradientAreaPath = useMemo(() => {
    if (points.length === 0) return '';
    const first = points[0];
    const last = points[points.length - 1];
    let d = `M ${first.x} ${first.bottomY} L ${first.x} ${first.y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    d += ` L ${last.x} ${last.bottomY} Z`;
    return d;
  }, [points]);

  const active = slots[activeIndex] ?? slots[0];
  const activePoint = points[activeIndex];

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (evt: GestureResponderEvent) => {
          setActiveIndex(indexFromX(evt.nativeEvent.locationX, width, slots.length));
        },
        onPanResponderMove: (evt: GestureResponderEvent) => {
          setActiveIndex(indexFromX(evt.nativeEvent.locationX, width, slots.length));
        },
      }),
    [width, slots.length],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const axisLabels = axisMode === 'narrow' ? NARROW_DAY_AXIS_LABELS : FULL_DAY_AXIS_LABELS;

  return (
    <View className="gap-2.5" onStartShouldSetResponder={() => true}>
      <StepsHourlyValueRow label={active.label} steps={active.steps} />

      <View
        onLayout={onLayout}
        style={{ height: CHART_HEIGHT, width: '100%' }}
        {...panResponder.panHandlers}
      >
        {width > 0 && points.length > 0 ? (
          <Svg width={width} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#DDFB43" stopOpacity={0.5} />
                <Stop offset="1" stopColor="#DDFB43" stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Path d={gradientAreaPath} fill={`url(#${GRADIENT_ID})`} />
            <Polyline
              points={polylinePoints}
              fill="none"
              stroke="#626b5e"
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {activePoint ? (
              <>
                <Circle cx={activePoint.x} cy={activePoint.y} r={5} fill="#DDFB43" />
                <Circle cx={activePoint.x} cy={activePoint.y} r={2.5} fill="#141c12" />
              </>
            ) : null}
          </Svg>
        ) : null}
      </View>

      <View className="flex-row justify-between">
        {axisLabels.map((label) => (
          <Text
            key={label}
            style={{
              fontFamily: fonts.regular,
              fontSize: 9,
              lineHeight: 12,
              color: '#8e8e93',
            }}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}
