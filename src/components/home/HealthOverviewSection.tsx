import { Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { StepsProgressCard } from '@/components/home/StepsProgressCard';
import { fonts } from '@/theme/tokens';

function MetricSideCard({
  titleLines,
  value,
  unit,
  badgeKind,
}: {
  titleLines: [string, string];
  value: string;
  unit: string;
  badgeKind: 'calories' | 'water';
}) {
  return (
    <Card className="flex-1 justify-between p-3.5">
      <View className="flex-row items-start justify-between">
        <View>
          <Text className="text-sm text-black" style={{ fontFamily: fonts.medium }}>
            {titleLines[0]}
          </Text>
          <Text className="text-sm text-black" style={{ fontFamily: fonts.medium }}>
            {titleLines[1]}
          </Text>
        </View>
        <MetricBadgeIcon kind={badgeKind} size={40} />
      </View>
      <Text className="mt-2">
        <Text className="text-xl text-black" style={{ fontFamily: fonts.bold }}>
          {value}
        </Text>
        <Text className="text-xs text-mizora-secondary" style={{ fontFamily: fonts.medium }}>
          {' '}
          {unit}
        </Text>
      </Text>
    </Card>
  );
}

export function HealthOverviewSection() {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-base text-black" style={{ fontFamily: fonts.medium }}>
          Health Overview
        </Text>
        <View
          className="flex-row items-center rounded-full px-2.5 py-1.5"
          style={{ backgroundColor: 'rgba(215,255,199,0.71)' }}
        >
          <Text className="text-xs text-mizora-primary" style={{ fontFamily: fonts.medium }}>
            Live
          </Text>
          <View className="ml-1 h-2.5 w-2.5 rounded-full bg-mizora-primary" />
        </View>
      </View>

      <View className="flex-row gap-2.5">
        <View className="w-[53%]">
          <StepsProgressCard />
        </View>

        <View className="flex-1 gap-2.5">
          <MetricSideCard
            titleLines={['Calories', 'Burned']}
            value="480"
            unit="kcal"
            badgeKind="calories"
          />
          <MetricSideCard
            titleLines={['Water', 'Tracker']}
            value="8/10"
            unit="glass"
            badgeKind="water"
          />
        </View>
      </View>

      <Card
        className="flex-row items-center justify-center gap-5 px-5 py-4"
        style={{ borderWidth: 0.67, borderColor: '#e0f0ff' }}
      >
        {[
          { value: '2.5', unit: 'km', label: 'Distance' },
          { value: '28', unit: 'min', label: 'Active Time' },
          { value: '02', unit: '', label: 'Floor' },
        ].map((item, index) => (
          <View key={item.label} className="flex-1 flex-row items-center">
            {index > 0 ? <View className="mr-5 h-10 w-px bg-[#f2f3f0]" /> : null}
            <View className="flex-1 items-center">
              <Text>
                <Text className="text-sm text-[#111827]" style={{ fontFamily: fonts.bold }}>
                  {item.value}
                </Text>
                {item.unit ? (
                  <Text
                    className="text-[10px] text-mizora-secondary"
                    style={{ fontFamily: fonts.medium }}
                  >
                    {' '}
                    {item.unit}
                  </Text>
                ) : null}
              </Text>
              <Text className="text-xs text-mizora-secondary" style={{ fontFamily: fonts.medium }}>
                {item.label}
              </Text>
            </View>
          </View>
        ))}
      </Card>
    </View>
  );
}
