import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View, type LayoutChangeEvent } from 'react-native';

import { Card } from '@/components/ui/Card';
import { StepsLiveBadge } from '@/components/steps/StepsLiveBadge';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { StepsProgressCard } from '@/components/home/StepsProgressCard';
import { todayActiveCaloriesFromSteps } from '@/constants/caloriesToday';
import { isStepsTrackingReady } from '@/lib/health/stepsTrackingUi';
import { peakHourLabelFromSlots } from '@/lib/health/peakHourLabel';
import { useHomeDashboardPreferences } from '@/providers/HomeDashboardPreferencesProvider';
import { useSteps } from '@/providers/StepsProvider';
import { useWaterIntake } from '@/providers/WaterIntakeProvider';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { mizoraType } from '@/theme/typography';

function MetricSideCard({
  titleLines,
  value,
  unit,
  badgeKind,
  variant = 'inline',
  onPress,
}: {
  titleLines: [string, string];
  value: string;
  unit: string;
  badgeKind: 'calories' | 'water';
  variant?: 'inline' | 'column-fill';
  onPress?: () => void;
}) {
  const fillColumn = variant === 'column-fill';
  const { colors } = useMizoraTheme();

  const card = (
    <Card className={fillColumn ? 'min-h-0 flex-1 justify-between p-4 py-5' : 'flex-1 gap-4 p-4'}>
      <View className="flex-row items-start justify-between">
        <View>
          <Text style={{ ...mizoraType.cardTitle, color: colors.textStrong }}>{titleLines[0]}</Text>
          <Text style={{ ...mizoraType.cardTitle, color: colors.textStrong }}>{titleLines[1]}</Text>
        </View>
        <MetricBadgeIcon kind={badgeKind} size={fillColumn ? 42 : 36} />
      </View>
      <Text className={fillColumn ? 'mt-auto' : undefined}>
        <Text
          style={{
            ...(fillColumn ? mizoraType.sideMetricValueLarge : mizoraType.sideMetricValue),
            color: colors.textStrong,
          }}
        >
          {value}
        </Text>
        <Text style={{ ...mizoraType.metricUnit, color: colors.textSecondary }}> {unit}</Text>
      </Text>
    </Card>
  );

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" className="flex-1" onPress={onPress}>
        {card}
      </Pressable>
    );
  }

  return card;
}

function StatsRow({ metricsLive }: { metricsLive: boolean }) {
  const { colors, isDark } = useMizoraTheme();
  const { snapshot, hourlySlots } = useSteps();

  if (!metricsLive) {
    return null;
  }

  const distanceKm = snapshot.distanceKm;
  const activeMinutes = snapshot.activeMinutes;
  const peakHour = peakHourLabelFromSlots(hourlySlots);

  const items = [
    { value: distanceKm.toFixed(1), unit: 'km', label: 'Distance' },
    { value: String(activeMinutes), unit: 'min', label: 'Active Time' },
    { value: peakHour, unit: '', label: 'Peak Hour' },
  ] as const;

  return (
    <Card
      className="flex-row items-center justify-center gap-5 px-5 py-4"
      style={{ borderWidth: 0.67, borderColor: isDark ? colors.border : '#e0f0ff' }}
    >
      {items.map((item, index) => (
        <View key={item.label} className="flex-1 flex-row items-center">
          {index > 0 ? (
            <View className="mr-5 h-10 w-px" style={{ backgroundColor: colors.borderDivider }} />
          ) : null}
          <View className="flex-1 items-center">
            <Text>
              <Text style={{ ...mizoraType.statsValue, color: colors.textStrong }}>
                {item.value}
              </Text>
              {item.unit ? (
                <Text style={{ ...mizoraType.metricUnitSmall, color: colors.textSecondary }}>
                  {' '}
                  {item.unit}
                </Text>
              ) : null}
            </Text>
            <Text style={{ ...mizoraType.bodyMedium, color: colors.textSecondary }}>
              {item.label}
            </Text>
          </View>
        </View>
      ))}
    </Card>
  );
}

export function HealthOverviewSection() {
  const router = useRouter();
  const { colors } = useMizoraTheme();
  const { prefs } = useHomeDashboardPreferences();
  const { todaySteps, status } = useSteps();
  const metricsLive = isStepsTrackingReady(status);
  const isSplit = prefs.healthOverviewLayout === 'split';
  const activeKcal = metricsLive ? todayActiveCaloriesFromSteps(todaySteps) : null;
  const { homeDisplay: waterHome } = useWaterIntake();
  const [stepsColumnHeight, setStepsColumnHeight] = useState<number | null>(null);

  const onStepsColumnLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.height;
    setStepsColumnHeight((prev) => (prev === next ? prev : next));
  };

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text style={{ ...mizoraType.sectionTitle, color: colors.textStrong }}>
          Health Overview
        </Text>
        <StepsLiveBadge size="sm" />
      </View>

      {isSplit ? (
        <View className="flex-row gap-2.5">
          <View className="w-[53%]" onLayout={onStepsColumnLayout}>
            <StepsProgressCard compact />
          </View>
          <View
            className="min-h-0 flex-1 flex-col gap-2.5"
            style={stepsColumnHeight != null ? { height: stepsColumnHeight } : undefined}
          >
            <MetricSideCard
              variant="column-fill"
              titleLines={['Calories', 'Burned']}
              value={metricsLive ? String(activeKcal) : '—'}
              unit="kcal"
              badgeKind="calories"
              onPress={() => router.push('/calories')}
            />
            <MetricSideCard
              variant="column-fill"
              titleLines={['Water', 'Tracker']}
              value={waterHome.value}
              unit={waterHome.unit}
              badgeKind="water"
              onPress={() => router.push('/water')}
            />
          </View>
        </View>
      ) : (
        <>
          <StepsProgressCard />
          <View className="flex-row gap-2.5">
            <MetricSideCard
              titleLines={['Calories', 'Burned']}
              value={metricsLive ? String(activeKcal) : '—'}
              unit="kcal"
              badgeKind="calories"
              onPress={() => router.push('/calories')}
            />
            <MetricSideCard
              titleLines={['Water', 'Tracker']}
              value={waterHome.value}
              unit={waterHome.unit}
              badgeKind="water"
              onPress={() => router.push('/water')}
            />
          </View>
        </>
      )}

      <StatsRow metricsLive={metricsLive} />
    </View>
  );
}
