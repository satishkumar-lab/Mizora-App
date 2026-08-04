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
import { WATER_TODAY, waterMlFromGlasses } from '@/constants/waterToday';
import { WATER_VISUAL } from '@/constants/waterTheme';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { chartGridLineStyle } from '@/utils/chartGridStyle';
import { fonts } from '@/theme/tokens';

const CHART_HEIGHT = 120;
const PADDING_X = 4;
const PADDING_Y = 14;

type WeekDay = (typeof WATER_TODAY.week)[number];

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

export function WeekWaterSelector() {
  const { colors, isDark } = useMizoraTheme();
  const gridLine = chartGridLineStyle(isDark, colors);
  const week = WATER_TODAY.week;
  const defaultIndex = Math.max(
    0,
    week.findIndex((d) => d.isToday),
  );
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const [width, setWidth] = useState(0);

  const weekMl = useMemo(
    () => week.map((d) => ({ ...d, ml: waterMlFromGlasses(d.glasses) })),
    [week],
  );

  const selected = weekMl[selectedIndex] ?? weekMl[0];
  const maxMl = useMemo(() => Math.max(...weekMl.map((d) => d.ml), 1), [weekMl]);

  const points = useMemo(() => {
    if (width <= 0) return [];
    const innerW = width - PADDING_X * 2;
    const innerH = CHART_HEIGHT - PADDING_Y * 2;
    const bottomY = PADDING_Y + innerH;

    return weekMl.map((day, i) => {
      const x = PADDING_X + (i / Math.max(weekMl.length - 1, 1)) * innerW;
      const y = day.ml > 0 ? PADDING_Y + innerH - (day.ml / maxMl) * innerH : bottomY - 4;
      return { x, y, bottomY, ml: day.ml, glasses: day.glasses, weekday: day.weekday };
    });
  }, [width, weekMl, maxMl]);

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
              streak: 'streak' in day ? day.streak : false,
            }}
            onPress={() => setSelectedIndex(index)}
          />
        ))}
      </View>

      <View className="flex-row items-end justify-between px-1">
        <View>
          <Text style={{ fontFamily: fonts.medium, fontSize: 22, color: colors.textStrong }}>
            {selected.glasses > 0 ? selected.glasses : '—'}
          </Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.textSecondary }}>
            glasses · {selected.weekday}
            {selected.ml > 0 ? ` · ${selected.ml} ml` : ''}
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
              <LinearGradient id="weekWaterGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={WATER_VISUAL.fill} stopOpacity={0.4} />
                <Stop offset="0.65" stopColor={WATER_VISUAL.fillBright} stopOpacity={0.12} />
                <Stop offset="1" stopColor={WATER_VISUAL.trackSoft} stopOpacity={0} />
              </LinearGradient>
            </Defs>

            {[0.33, 0.66].map((t) => {
              const y = PADDING_Y + (CHART_HEIGHT - PADDING_Y * 2) * t;
              return (
                <Line key={t} x1={PADDING_X} y1={y} x2={width - PADDING_X} y2={y} {...gridLine} />
              );
            })}

            <Path d={gradientAreaPath} fill="url(#weekWaterGradient)" />
            <Polyline
              points={linePoints}
              fill="none"
              stroke={WATER_VISUAL.fill}
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
                  stroke={WATER_VISUAL.fill}
                  strokeWidth={2}
                />
                <Circle cx={activePoint.x} cy={activePoint.y} r={7} fill={WATER_VISUAL.fill} />
                <Circle cx={activePoint.x} cy={activePoint.y} r={3.5} fill={colors.textStrong} />
              </>
            ) : null}
          </Svg>
        ) : null}
      </View>
    </View>
  );
}
