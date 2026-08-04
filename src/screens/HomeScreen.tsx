import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HealthOverviewSection } from '@/components/home/HealthOverviewSection';
import { HomeHeader } from '@/components/home/HomeHeader';
import { UnlockRewardsSection } from '@/components/home/UnlockRewardsSection';
import { HomeInsightBanner } from '@/components/home/HomeInsightBanner';
import { WorkoutCalendarSection } from '@/components/home/WorkoutCalendarSection';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { HomeDashboardPreferencesProvider } from '@/providers/HomeDashboardPreferencesProvider';

function HomeScreenContent() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedScreen edges={['top']}>
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
          <HomeInsightBanner />
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}

export function HomeScreen() {
  return (
    <HomeDashboardPreferencesProvider>
      <HomeScreenContent />
    </HomeDashboardPreferencesProvider>
  );
}
