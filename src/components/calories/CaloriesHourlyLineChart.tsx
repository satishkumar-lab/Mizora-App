import { useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  PanResponder,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Polyline, Stop } from 'react-native-svg';

import { FULL_DAY_AXIS_LABELS, HOURLY_STEP_SLOTS } from '@/constants/hourlySteps';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { MetricSectionHeader } from '@/components/ui/MetricSectionHeader';
import { activeCaloriesFromHourlySteps } from '@/lib/calories-estimate';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { chartGridLineStyle } from '@/utils/chartGridStyle';
import { fonts } from '@/theme/tokens';

const CHART_HEIGHT = 108;
const PADDING_X = 8;
const PADDING_Y = 10;

function indexFromX(x: number, width: number, count: number): number {
  if (width <= 0 || count <= 1) return 0;
  const innerW = width - PADDING_X * 2;
  const ratio = (x - PADDING_X) / innerW;
  return Math.min(count - 1, Math.max(0, Math.round(ratio * (count - 1))));
}

export function CaloriesHourlyLineChart() {
  const { colors, isDark } = useMizoraTheme();
  const gridLine = chartGridLineStyle(isDark, colors);

  const slots = useMemo(
    () =>
      HOURLY_STEP_SLOTS.map((s) => ({
        label: s.label,
        kcal: activeCaloriesFromHourlySteps(s.steps),
      })),
    [],
  );

  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(() => {
    const now = new Date().getHours();
    const idx = HOURLY_STEP_SLOTS.findIndex((s) => s.hour === now);
    return idx >= 0 ? idx : 0;
  });

  const maxKcal = useMemo(() => Math.max(...slots.map((s) => s.kcal), 1), [slots]);

  const points = useMemo(() => {
    if (width <= 0) return [];
    const innerW = width - PADDING_X * 2;
    const innerH = CHART_HEIGHT - PADDING_Y * 2;
    const bottomY = PADDING_Y + innerH;
    return slots.map((slot, i) => {
      const x = PADDING_X + (i / Math.max(slots.length - 1, 1)) * innerW;
      const y = PADDING_Y + innerH - (slot.kcal / maxKcal) * innerH;
      return { x, y, bottomY, ...slot };
    });
  }, [width, slots, maxKcal]);

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
        title="Burn by hour"
        subtitle="Active kcal from steps — slide to scrub"
        icon={<MetricBadgeIcon kind="calories" size={40} />}
        trailing={
          <View className="items-end">
            <Text style={{ fontFamily: fonts.bold, fontSize: 17, color: colors.textStrong }}>
              {active.kcal.toLocaleString()}
            </Text>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 10,
                color: colors.textSecondary,
                marginTop: 1,
              }}
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
              <LinearGradient id="hourlyCaloriesGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#c8f526" stopOpacity={0.45} />
                <Stop offset="0.7" stopColor="#f8ffd2" stopOpacity={0.08} />
                <Stop offset="1" stopColor="#f8ffd2" stopOpacity={0} />
              </LinearGradient>
            </Defs>
            {[0.25, 0.5, 0.75].map((t) => {
              const y = PADDING_Y + (CHART_HEIGHT - PADDING_Y * 2) * t;
              return (
                <Line key={t} x1={PADDING_X} y1={y} x2={width - PADDING_X} y2={y} {...gridLine} />
              );
            })}

            <Path d={gradientAreaPath} fill="url(#hourlyCaloriesGradient)" />
            <Polyline
              points={polylinePoints}
              fill="none"
              stroke="#734a00"
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
                  stroke="#c8f526"
                  strokeWidth={2}
                />
                <Circle cx={activePoint.x} cy={activePoint.y} r={6} fill="#c8f526" />
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
    </View>
  );
}
