import { useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Polyline, Stop } from 'react-native-svg';

import { CalendarDayPill, type CalendarDayPillVariant } from '@/components/ui/CalendarDayPill';
import { STEPS_TODAY } from '@/constants/stepsToday';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { chartGridLineStyle } from '@/utils/chartGridStyle';
import { fonts } from '@/theme/tokens';

const CHART_HEIGHT = 120;
const PADDING_X = 4;
const PADDING_Y = 14;

type WeekDay = (typeof STEPS_TODAY.week)[number];

function pillVariant(index: number, selectedIndex: number, day: WeekDay): CalendarDayPillVariant {
  if (index === selectedIndex) return 'active';
  if (day.isToday) return 'today';
  return 'future';
}

function indexFromX(x: number, width: number, count: number): number {
  if (width <= 0 || count <= 1) return 0;
  const innerW = width - PADDING_X * 2;
  const ratio = (x - PADDING_X) / innerW;
  return Math.min(count - 1, Math.max(0, Math.round(ratio * (count - 1))));
}

type WeekStepsSelectorProps = {
  goal?: number;
};

export function WeekStepsSelector({ goal: _goal = STEPS_TODAY.goal }: WeekStepsSelectorProps) {
  const { colors, isDark } = useMizoraTheme();
  const gridLine = chartGridLineStyle(isDark, colors);
  const week = STEPS_TODAY.week;
  const defaultIndex = Math.max(
    0,
    week.findIndex((d) => d.isToday),
  );
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const [width, setWidth] = useState(0);

  const selected = week[selectedIndex] ?? week[0];

  const maxSteps = useMemo(() => Math.max(...week.map((d) => d.steps), 1), [week]);

  const points = useMemo(() => {
    if (width <= 0) return [];
    const innerW = width - PADDING_X * 2;
    const innerH = CHART_HEIGHT - PADDING_Y * 2;
    const bottomY = PADDING_Y + innerH;

    return week.map((day, i) => {
      const x = PADDING_X + (i / Math.max(week.length - 1, 1)) * innerW;
      const y = day.steps > 0 ? PADDING_Y + innerH - (day.steps / maxSteps) * innerH : bottomY - 4;
      return { x, y, bottomY, steps: day.steps, weekday: day.weekday };
    });
  }, [width, week, maxSteps]);

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

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

  const activePoint = points[selectedIndex];

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (evt: GestureResponderEvent) => {
          setSelectedIndex(indexFromX(evt.nativeEvent.locationX, width, week.length));
        },
        onPanResponderMove: (evt: GestureResponderEvent) => {
          setSelectedIndex(indexFromX(evt.nativeEvent.locationX, width, week.length));
        },
      }),
    [width, week.length],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  return (
    <View className="gap-4">
      <View className="flex-row justify-between gap-0.5">
        {week.map((day, index) => (
          <CalendarDayPill
            key={`${day.weekday}-${day.day}`}
            compact
            day={{
              weekday: day.weekday,
              day: day.day,
              variant: pillVariant(index, selectedIndex, day),
              streak: day.streak,
            }}
            onPress={() => setSelectedIndex(index)}
          />
        ))}
      </View>

      <View className="flex-row items-end justify-between px-1">
        <View>
          <Text style={{ fontFamily: fonts.bold, fontSize: 22, color: colors.textStrong }}>
            {selected.steps > 0 ? selected.steps.toLocaleString() : '—'}
          </Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.textSecondary }}>
            steps · {selected.weekday}
          </Text>
        </View>
        <Text style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted }}>
          Slide chart to compare days
        </Text>
      </View>

      <View
        onLayout={onLayout}
        style={{ height: CHART_HEIGHT, width: '100%' }}
        {...panResponder.panHandlers}
      >
        {width > 0 && points.length > 0 ? (
          <Svg width={width} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id="weekStepsGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#DDFB43" stopOpacity={0.55} />
                <Stop offset="0.65" stopColor="#DDFB43" stopOpacity={0.12} />
                <Stop offset="1" stopColor="#DDFB43" stopOpacity={0} />
              </LinearGradient>
            </Defs>

            {[0.33, 0.66].map((t) => {
              const y = PADDING_Y + (CHART_HEIGHT - PADDING_Y * 2) * t;
              return (
                <Line key={t} x1={PADDING_X} y1={y} x2={width - PADDING_X} y2={y} {...gridLine} />
              );
            })}

            <Path d={gradientAreaPath} fill="url(#weekStepsGradient)" />
            <Polyline
              points={linePoints}
              fill="none"
              stroke={isDark ? colors.textMuted : '#626b5e'}
              strokeWidth={2.5}
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
                <Circle cx={activePoint.x} cy={activePoint.y} r={7} fill="#DDFB43" />
                <Circle cx={activePoint.x} cy={activePoint.y} r={3.5} fill={colors.textStrong} />
              </>
            ) : null}
          </Svg>
        ) : null}
      </View>
    </View>
  );
}
