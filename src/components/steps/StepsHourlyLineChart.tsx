import { useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Polyline, Stop } from 'react-native-svg';

import { HOURLY_STEP_SLOTS } from '@/constants/hourlySteps';
import { MetricSectionHeader } from '@/components/ui/MetricSectionHeader';
import { fonts } from '@/theme/tokens';

const CHART_HEIGHT = 108;
const PADDING_X = 8;
const PADDING_Y = 10;

type StepsHourlyLineChartProps = {
  slots?: readonly { label: string; steps: number }[];
};

function indexFromX(x: number, width: number, count: number): number {
  if (width <= 0 || count <= 1) return 0;
  const innerW = width - PADDING_X * 2;
  const ratio = (x - PADDING_X) / innerW;
  return Math.min(count - 1, Math.max(0, Math.round(ratio * (count - 1))));
}

export function StepsHourlyLineChart({ slots = HOURLY_STEP_SLOTS }: StepsHourlyLineChartProps) {
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(() => {
    let peak = 0;
    slots.forEach((s, i) => {
      if (s.steps > slots[peak].steps) peak = i;
    });
    return peak;
  });

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

  const active = slots[activeIndex];
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

  return (
    <View className="gap-2.5">
      <MetricSectionHeader
        title="Today by hour"
        subtitle="Slide the chart for steps each hour"
        trailing={
          <View className="items-end">
            <Text
              style={{ fontFamily: fonts.bold, fontSize: 17, color: '#141c12', lineHeight: 20 }}
            >
              {active.steps.toLocaleString()}
            </Text>
            <Text
              style={{ fontFamily: fonts.medium, fontSize: 10, color: '#626b5e', marginTop: 1 }}
            >
              {active.label}
            </Text>
          </View>
        }
      />

      <View
        onLayout={onLayout}
        style={{ height: CHART_HEIGHT, width: '100%' }}
        {...panResponder.panHandlers}
      >
        {width > 0 && points.length > 0 ? (
          <Svg width={width} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id="hourlyStepsGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#DDFB43" stopOpacity={0.45} />
                <Stop offset="0.7" stopColor="#DDFB43" stopOpacity={0.06} />
                <Stop offset="1" stopColor="#DDFB43" stopOpacity={0} />
              </LinearGradient>
            </Defs>
            {[0.25, 0.5, 0.75].map((t) => {
              const y = PADDING_Y + (CHART_HEIGHT - PADDING_Y * 2) * t;
              return (
                <Line
                  key={t}
                  x1={PADDING_X}
                  y1={y}
                  x2={width - PADDING_X}
                  y2={y}
                  stroke="#f2f3f0"
                  strokeWidth={1}
                />
              );
            })}

            <Path d={gradientAreaPath} fill="url(#hourlyStepsGradient)" />
            <Polyline
              points={polylinePoints}
              fill="none"
              stroke="#626b5e"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {activePoint ? (
              <>
                <Line
                  x1={activePoint.x}
                  y1={PADDING_Y}
                  x2={activePoint.x}
                  y2={CHART_HEIGHT - PADDING_Y}
                  stroke="#DDFB43"
                  strokeWidth={2}
                />
                <Circle cx={activePoint.x} cy={activePoint.y} r={6} fill="#DDFB43" />
                <Circle cx={activePoint.x} cy={activePoint.y} r={3} fill="#141c12" />
              </>
            ) : null}
          </Svg>
        ) : null}
      </View>

      <View className="flex-row justify-between px-1">
        {['6 AM', '12 PM', '6 PM', '10 PM'].map((label) => (
          <Text key={label} style={{ fontFamily: fonts.regular, fontSize: 9, color: '#8e8e93' }}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}
