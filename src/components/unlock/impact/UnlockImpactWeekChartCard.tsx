import { useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import { AppBrandIcon } from '@/components/icons/AppBrandIcon';
import { CalendarDayPill, type CalendarDayPillVariant } from '@/components/ui/CalendarDayPill';
import { Card } from '@/components/ui/Card';
import type { UnlockImpactWeekDay } from '@/constants/unlockImpactWeek';
import { UNLOCK_IMPACT_APP_LABEL } from '@/constants/unlockImpactWeek';
import {
  dayChartValue,
  formatChartValue,
  topAppForDay,
  type UnlockImpactSummary,
} from '@/lib/unlockImpactStats';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { chartGridLineStyle } from '@/utils/chartGridStyle';
import { fonts } from '@/theme/tokens';

const CHART_HEIGHT = 118;
const PADDING_X = 8;
const PADDING_Y = 14;

type ChartMode = 'steps' | 'screen';

type Point = { x: number; y: number; bottomY: number };

function pillVariant(
  index: number,
  selectedIndex: number,
  day: UnlockImpactWeekDay,
): CalendarDayPillVariant {
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

/** Smooth cubic curve through points (Catmull-Rom style). */
function smoothCurvePath(points: Point[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

function smoothAreaPath(points: Point[]): string {
  if (points.length === 0) return '';
  const line = smoothCurvePath(points);
  const first = points[0];
  const last = points[points.length - 1];
  return `${line} L ${last.x} ${last.bottomY} L ${first.x} ${first.bottomY} Z`;
}

function ModeChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors, isDark } = useMizoraTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      className="rounded-full px-3 py-1.5"
      style={{
        backgroundColor: active ? '#ddfb43' : isDark ? colors.surfaceSecondary : '#f4f6f3',
      }}
    >
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 11,
          color: active ? '#141c12' : colors.textSecondary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function DailyTopAppStrip({
  week,
  selectedIndex,
  onSelect,
}: {
  week: UnlockImpactWeekDay[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  const { colors, isDark } = useMizoraTheme();
  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.textStrong }}>
        Main unlock app · each day
      </Text>
      <View className="flex-row gap-1.5">
        {week.map((day, index) => {
          const top = topAppForDay(day);
          const isSelected = index === selectedIndex;
          return (
            <Pressable
              key={`${day.weekday}-${day.day}`}
              accessibilityRole="button"
              accessibilityLabel={
                top
                  ? `${day.weekday}, top unlock ${UNLOCK_IMPACT_APP_LABEL[top.appId] ?? top.appId}, ${top.sharePct}%`
                  : day.weekday
              }
              accessibilityState={{ selected: isSelected }}
              onPress={() => onSelect(index)}
              className="flex-1 items-center rounded-[12px] py-2.5"
              style={{
                backgroundColor: isSelected
                  ? isDark
                    ? colors.cardShell
                    : '#fafbf4'
                  : isDark
                    ? colors.surfaceSecondary
                    : '#f4f6f3',
                borderWidth: isSelected ? 1.5 : 0,
                borderColor: '#ddfb43',
              }}
            >
              <Text style={{ fontFamily: fonts.medium, fontSize: 9, color: colors.textMuted }}>
                {day.weekday}
              </Text>
              {top ? (
                <>
                  <View className="my-1.5">
                    <AppBrandIcon app={top.appId} size={34} />
                  </View>
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: 10,
                      color: isSelected ? '#34c759' : colors.textMuted,
                    }}
                  >
                    {top.sharePct}%
                  </Text>
                </>
              ) : (
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 10,
                    color: colors.textMuted,
                    marginTop: 12,
                  }}
                >
                  —
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

type UnlockImpactWeekChartCardProps = {
  impact: UnlockImpactSummary;
};

export function UnlockImpactWeekChartCard({ impact }: UnlockImpactWeekChartCardProps) {
  const { colors, isDark } = useMizoraTheme();
  const gridLine = chartGridLineStyle(isDark, colors);

  const week = impact.weekDays;
  const defaultIndex = Math.max(
    0,
    week.findIndex((d) => d.isToday),
  );
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const [width, setWidth] = useState(0);
  const [mode, setMode] = useState<ChartMode>('screen');

  const selected = week[selectedIndex] ?? week[0];
  const selectedValue = dayChartValue(selected, mode, impact.stepsPerMinute);
  const topApp = topAppForDay(selected);

  const values = useMemo(
    () => week.map((d) => dayChartValue(d, mode, impact.stepsPerMinute)),
    [week, mode, impact.stepsPerMinute],
  );

  const maxValue = useMemo(() => Math.max(...values, 1), [values]);

  const points = useMemo(() => {
    if (width <= 0) return [];
    const innerW = width - PADDING_X * 2;
    const innerH = CHART_HEIGHT - PADDING_Y * 2;
    const bottomY = PADDING_Y + innerH;

    return week.map((day, i) => {
      const v = values[i] ?? 0;
      const x = PADDING_X + (i / Math.max(week.length - 1, 1)) * innerW;
      const y = v > 0 ? PADDING_Y + innerH - (v / maxValue) * innerH : bottomY - 6;
      return { x, y, bottomY, value: v, weekday: day.weekday };
    });
  }, [width, week, values, maxValue]);

  const curvePath = useMemo(() => smoothCurvePath(points), [points]);
  const areaPath = useMemo(() => smoothAreaPath(points), [points]);

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

  const unitLabel = mode === 'steps' ? 'unlock steps' : 'screen saved';

  return (
    <Card className="gap-4 p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text style={{ fontFamily: fonts.medium, fontSize: 16, color: colors.textStrong }}>
            This week
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 11,
              color: colors.textMuted,
              marginTop: 2,
            }}
          >
            Which apps you walk for most
          </Text>
        </View>
        <View className="flex-row gap-1.5">
          <ModeChip label="Steps" active={mode === 'steps'} onPress={() => setMode('steps')} />
          <ModeChip
            label="Screen saved"
            active={mode === 'screen'}
            onPress={() => setMode('screen')}
          />
        </View>
      </View>

      <View className="flex-row justify-between gap-0.5">
        {week.map((day, index) => (
          <CalendarDayPill
            key={`${day.weekday}-${day.day}`}
            compact
            day={{
              weekday: day.weekday,
              day: day.day,
              variant: pillVariant(index, selectedIndex, day),
              streak: false,
            }}
            onPress={() => setSelectedIndex(index)}
          />
        ))}
      </View>

      <View className="px-0.5" style={{ gap: 4 }}>
        <Text
          style={{ fontFamily: fonts.bold, fontSize: 24, color: colors.textStrong, lineHeight: 28 }}
        >
          {formatChartValue(selectedValue, mode)}
        </Text>
        <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.textSecondary }}>
          {unitLabel} · {selected.weekday}
          {topApp ? <Text style={{ color: '#34c759' }}> · mostly {topApp.name}</Text> : null}
        </Text>
      </View>

      <View
        onLayout={onLayout}
        style={{ height: CHART_HEIGHT, width: '100%' }}
        {...panResponder.panHandlers}
      >
        {width > 0 && points.length > 0 && curvePath ? (
          <Svg width={width} height={CHART_HEIGHT}>
            <Defs>
              <LinearGradient id="unlockImpactGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#DDFB43" stopOpacity={0.45} />
                <Stop offset="0.7" stopColor="#DDFB43" stopOpacity={0.08} />
                <Stop offset="1" stopColor="#DDFB43" stopOpacity={0} />
              </LinearGradient>
            </Defs>

            {[0.25, 0.5, 0.75].map((t) => {
              const y = PADDING_Y + (CHART_HEIGHT - PADDING_Y * 2) * t;
              return (
                <Line key={t} x1={PADDING_X} y1={y} x2={width - PADDING_X} y2={y} {...gridLine} />
              );
            })}

            <Path d={areaPath} fill="url(#unlockImpactGradient)" />
            <Path
              d={curvePath}
              fill="none"
              stroke="#34c759"
              strokeWidth={2.5}
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
                <Circle cx={activePoint.x} cy={activePoint.y} r={3} fill={colors.textStrong} />
              </>
            ) : null}
          </Svg>
        ) : null}
      </View>

      <DailyTopAppStrip week={week} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
    </Card>
  );
}
