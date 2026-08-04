import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { StatusBar } from 'expo-status-bar';

import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { UnlockImpactHeroCard } from '@/components/unlock/impact/UnlockImpactHeroCard';
import { UnlockImpactLockedAppsCard } from '@/components/unlock/impact/UnlockImpactLockedAppsCard';
import { UnlockImpactMethodologyCard } from '@/components/unlock/impact/UnlockImpactMethodologyCard';
import { UnlockImpactWeekChartCard } from '@/components/unlock/impact/UnlockImpactWeekChartCard';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useUnlockRewards } from '@/providers/UnlockRewardsProvider';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { STEPS_TODAY } from '@/constants/stepsToday';
import { buildUnlockImpactAppRows, buildUnlockImpactSummary } from '@/lib/unlockImpactStats';

export function UnlockImpactScreen() {
  const insets = useSafeAreaInsets();
  const goBack = useMizoraBack('/home');
  const router = useRouter();
  const { apps } = useUnlockRewards();
  const impact = buildUnlockImpactSummary(
    apps,
    undefined,
    undefined,
    undefined,
    undefined,
    STEPS_TODAY.steps,
  );
  const appRows = buildUnlockImpactAppRows(apps, impact.weekDays);
  const maxStepsWeek = useMemo(
    () => Math.max(...appRows.map((r) => r.stepsThisWeek), 1),
    [appRows],
  );

  return (
    <>
      <StatusBar style="dark" />
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader
            onBack={goBack}
            title="Unlock impact"
            rightAccessory={<MetricBadgeIcon kind="unlock" size={36} />}
          />
        </View>
        <ScrollView
          contentContainerClassName="px-5 pb-8"
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: insets.bottom + MAIN_TAB_BAR_CLEARANCE,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 20 }}>
            <UnlockImpactHeroCard impact={impact} />
            <UnlockImpactWeekChartCard impact={impact} />
            <UnlockImpactLockedAppsCard
              rows={appRows}
              maxStepsWeek={maxStepsWeek}
              onAppPress={(id) => router.push(`/rewards/${id}`)}
            />
            <UnlockImpactMethodologyCard impact={impact} />
          </View>
        </ScrollView>
      </ThemedScreen>
    </>
  );
}
