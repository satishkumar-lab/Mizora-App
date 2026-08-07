import { useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Polyline, Stop } from 'react-native-svg';

import { FULL_DAY_AXIS_LABELS } from '@/constants/hourlySteps';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { MetricSectionHeader } from '@/components/ui/MetricSectionHeader';
import { WATER_VISUAL } from '@/constants/waterTheme';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { useWaterIntake } from '@/providers/WaterIntakeProvider';
import { sumWaterHourlyMl } from '@/lib/water-hourly';
import { chartGridLineStyle } from '@/utils/chartGridStyle';
import { fonts } from '@/theme/tokens';

const CHART_HEIGHT = 108;
const PADDING_X = 8;
const PADDING_Y = 10;

function hourLabel(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

function indexFromX(x: number, width: number, count: number): number {
  if (width <= 0 || count <= 1) return 0;
  const innerW = width - PADDING_X * 2;
  const ratio = (x - PADDING_X) / innerW;
  return Math.min(count - 1, Math.max(0, Math.round(ratio * (count - 1))));
}

export function WaterHourlyLineChart() {
  const { colors, isDark } = useMizoraTheme();
  const gridLine = chartGridLineStyle(isDark, colors);
  const { hourlyMl } = useWaterIntake();

  const slots = useMemo(
    () =>
      hourlyMl.map((ml, hour) => ({
        hour,
        label: hourLabel(hour),
        ml,
      })),
    [hourlyMl],
  );

  const totalLoggedMl = useMemo(() => sumWaterHourlyMl(hourlyMl), [hourlyMl]);
  const hasLogsToday = totalLoggedMl > 0;

  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(() => new Date().getHours());

  const maxMl = useMemo(() => Math.max(...slots.map((s) => s.ml), 1), [slots]);

  const points = useMemo(() => {
    if (width <= 0 || !hasLogsToday) return [];
    const innerW = width - PADDING_X * 2;
    const innerH = CHART_HEIGHT - PADDING_Y * 2;
    const bottomY = PADDING_Y + innerH;
    return slots.map((slot, i) => {
      const x = PADDING_X + (i / Math.max(slots.length - 1, 1)) * innerW;
      const y = PADDING_Y + innerH - (slot.ml / maxMl) * innerH;
      return { x, y, bottomY, ...slot };
    });
  }, [width, slots, maxMl, hasLogsToday]);

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
        onStartShouldSetPanResponder: () => hasLogsToday,
        onMoveShouldSetPanResponder: () => hasLogsToday,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (evt: GestureResponderEvent) => {
          setActiveIndex(indexFromX(evt.nativeEvent.locationX, width, slots.length));
        },
        onPanResponderMove: (evt: GestureResponderEvent) => {
          setActiveIndex(indexFromX(evt.nativeEvent.locationX, width, slots.length));
        },
      }),
    [width, slots.length, hasLogsToday],
  );

  return (
    <View className="gap-2.5">
      <MetricSectionHeader
        title="Sips through the day"
        subtitle={
          hasLogsToday ? 'Slide to see ml logged each hour' : 'Log water above to see your rhythm'
        }
        icon={<MetricBadgeIcon kind="water" size={40} />}
        trailing={
          hasLogsToday ? (
            <View className="items-end">
              <Text style={{ fontFamily: fonts.medium, fontSize: 17, color: colors.textStrong }}>
                {active.ml > 0 ? active.ml : '—'}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 10,
                  color: colors.textSecondary,
                  marginTop: 1,
                }}
              >
                {active.ml > 0 ? `${active.label} · ml` : active.label}
              </Text>
            </View>
          ) : null
        }
      />

      {!hasLogsToday ? (
        <View
          className="items-center justify-center rounded-xl px-4"
          style={{
            minHeight: CHART_HEIGHT,
            backgroundColor: isDark ? colors.surfaceMuted : '#f4f8f2',
          }}
        >
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 13,
              color: colors.textSecondary,
              textAlign: 'center',
              lineHeight: 18,
            }}
          >
            No water logged yet today. Quick log a glass to fill this chart.
          </Text>
        </View>
      ) : (
        <>
          <View
            onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
            style={{ height: CHART_HEIGHT, width: '100%' }}
            {...panResponder.panHandlers}
          >
            {width > 0 && points.length > 0 ? (
              <Svg width={width} height={CHART_HEIGHT}>
                <Defs>
                  <LinearGradient id="waterHourlyGradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={WATER_VISUAL.fill} stopOpacity={0.35} />
                    <Stop offset="1" stopColor={WATER_VISUAL.trackSoft} stopOpacity={0} />
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
                      {...gridLine}
                    />
                  );
                })}
                <Path d={gradientAreaPath} fill="url(#waterHourlyGradient)" />
                <Polyline
                  points={polylinePoints}
                  fill="none"
                  stroke={WATER_VISUAL.fill}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {activePoint && active.ml > 0 ? (
                  <>
                    <Line
                      x1={activePoint.x}
                      y1={PADDING_Y}
                      x2={activePoint.x}
                      y2={CHART_HEIGHT - PADDING_Y}
                      stroke={WATER_VISUAL.fill}
                      strokeWidth={2}
                      opacity={0.35}
                    />
                    <Circle cx={activePoint.x} cy={activePoint.y} r={6} fill={WATER_VISUAL.fill} />
                    <Circle cx={activePoint.x} cy={activePoint.y} r={3} fill={colors.textStrong} />
                  </>
                ) : null}
              </Svg>
            ) : null}
          </View>

          <View className="flex-row justify-between px-1">
            {FULL_DAY_AXIS_LABELS.map((label) => (
              <Text
                key={label}
                style={{ fontFamily: fonts.regular, fontSize: 9, color: colors.textMuted }}
              >
                {label}
              </Text>
            ))}
          </View>
        </>
      )}
    </View>
  );
}
