import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedScreen } from '@/components/ui/ThemedScreen';

import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { WaterDailyTargetCard } from '@/components/water/WaterDailyTargetCard';
import { WaterDetailHeroCard } from '@/components/water/WaterDetailHeroCard';
import { WaterHourlyLineChart } from '@/components/water/WaterHourlyLineChart';
import { WaterHydrationInsight } from '@/components/water/WaterHydrationInsight';
import { WaterQuickLogCard } from '@/components/water/WaterQuickLogCard';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { WATER_TODAY } from '@/constants/waterToday';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { useWaterIntake } from '@/providers/WaterIntakeProvider';

export function WaterDetailScreen() {
  const insets = useSafeAreaInsets();
  const goBack = useMizoraBack('/home');
  const mlPerGlass = WATER_TODAY.mlPerGlass;
  const { loggedMl, goalMl, remainingMl, addMl, removeMl, setGoalMl } = useWaterIntake();

  return (
    <ThemedScreen>
      <View className="px-5">
        <ScreenHeader
          onBack={goBack}
          title="Water Tracker"
          rightAccessory={<MetricBadgeIcon kind="water" size={36} />}
        />
      </View>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-8"
        contentContainerStyle={{
          paddingBottom: insets.bottom + MAIN_TAB_BAR_CLEARANCE,
          paddingTop: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          <WaterDetailHeroCard currentMl={loggedMl} goalMl={goalMl} remainingMl={remainingMl} />

          <WaterQuickLogCard
            mlPerGlass={mlPerGlass}
            loggedMl={loggedMl}
            remainingMl={remainingMl}
            onAddMl={addMl}
            onRemoveMl={removeMl}
          />

          <WaterDailyTargetCard goalMl={goalMl} onChangeGoalMl={setGoalMl} />

          <WaterHydrationInsight goalMl={goalMl} />

          <View className="gap-3">
            <SectionLabel>Today&apos;s rhythm</SectionLabel>
            <Card className="px-3.5 py-3.5">
              <WaterHourlyLineChart />
            </Card>
          </View>
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}
