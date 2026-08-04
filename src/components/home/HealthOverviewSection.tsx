import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View, type LayoutChangeEvent } from 'react-native';

import { Card } from '@/components/ui/Card';
import { LiveBadge } from '@/components/ui/LiveBadge';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { StepsProgressCard } from '@/components/home/StepsProgressCard';
import { todayActiveCaloriesFromSteps } from '@/constants/caloriesToday';
import { useHomeDashboardPreferences } from '@/providers/HomeDashboardPreferencesProvider';
import { useWaterIntake } from '@/providers/WaterIntakeProvider';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

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
          <Text
            className={fillColumn ? 'text-[15px] leading-5' : 'text-sm leading-[18px]'}
            style={{ fontFamily: fonts.medium, color: colors.textStrong }}
          >
            {titleLines[0]}
          </Text>
          <Text
            className={fillColumn ? 'text-[15px] leading-5' : 'text-sm leading-[18px]'}
            style={{ fontFamily: fonts.medium, color: colors.textStrong }}
          >
            {titleLines[1]}
          </Text>
        </View>
        <MetricBadgeIcon kind={badgeKind} size={fillColumn ? 42 : 36} />
      </View>
      <Text className={fillColumn ? 'mt-auto' : undefined}>
        <Text
          className={fillColumn ? 'text-2xl' : 'text-lg'}
          style={{ fontFamily: fonts.bold, color: colors.textStrong }}
        >
          {value}
        </Text>
        <Text className="text-xs" style={{ fontFamily: fonts.medium, color: colors.textSecondary }}>
          {' '}
          {unit}
        </Text>
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

function StatsRow() {
  const { colors, isDark } = useMizoraTheme();
  return (
    <Card
      className="flex-row items-center justify-center gap-5 px-5 py-4"
      style={{ borderWidth: 0.67, borderColor: isDark ? colors.border : '#e0f0ff' }}
    >
      {[
        { value: '2.5', unit: 'km', label: 'Distance' },
        { value: '28', unit: 'min', label: 'Active Time' },
        { value: '02', unit: '', label: 'Floor' },
      ].map((item, index) => (
        <View key={item.label} className="flex-1 flex-row items-center">
          {index > 0 ? (
            <View className="mr-5 h-10 w-px" style={{ backgroundColor: colors.borderDivider }} />
          ) : null}
          <View className="flex-1 items-center">
            <Text>
              <Text
                className="text-sm"
                style={{ fontFamily: fonts.bold, color: colors.textStrong }}
              >
                {item.value}
              </Text>
              {item.unit ? (
                <Text
                  className="text-[10px]"
                  style={{ fontFamily: fonts.medium, color: colors.textSecondary }}
                >
                  {' '}
                  {item.unit}
                </Text>
              ) : null}
            </Text>
            <Text
              className="text-xs"
              style={{ fontFamily: fonts.medium, color: colors.textSecondary }}
            >
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
  const isSplit = prefs.healthOverviewLayout === 'split';
  const activeKcal = todayActiveCaloriesFromSteps();
  const { homeDisplay: waterHome } = useWaterIntake();
  const [stepsColumnHeight, setStepsColumnHeight] = useState<number | null>(null);

  const onStepsColumnLayout = (event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.height;
    setStepsColumnHeight((prev) => (prev === next ? prev : next));
  };

  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-base" style={{ fontFamily: fonts.medium, color: colors.textStrong }}>
          Health Overview
        </Text>
        <LiveBadge size="sm" />
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
              value={String(activeKcal)}
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
              value={String(activeKcal)}
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

      <StatsRow />
    </View>
  );
}
