import { ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { HealthOverviewSection } from '@/components/home/HealthOverviewSection';
import { HomeHeader } from '@/components/home/HomeHeader';
import { UnlockRewardsSection } from '@/components/home/UnlockRewardsSection';
import { InsightBanner, WorkoutCalendarSection } from '@/components/home/WorkoutCalendarSection';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';

export function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 bg-mizora-bg" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-2"
        contentContainerStyle={{ paddingBottom: insets.bottom + MAIN_TAB_BAR_CLEARANCE }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6">
          <HomeHeader />
          <HealthOverviewSection />
          <UnlockRewardsSection />
          <WorkoutCalendarSection />
          <InsightBanner />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
