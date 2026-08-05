import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
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
import { useSteps } from '@/providers/StepsProvider';
import { buildUnlockImpactAppRows, buildUnlockImpactSummary } from '@/lib/unlockImpactStats';
import { computeVsLastWeekPct, loadUnlockImpactWeekDays } from '@/lib/unlock-impact-storage';
import type { UnlockImpactWeekDay } from '@/constants/unlockImpactWeek';
import { MOCK_UNLOCK_IMPACT_WEEK } from '@/constants/unlockImpactWeek';

export function UnlockImpactScreen() {
  const insets = useSafeAreaInsets();
  const goBack = useMizoraBack('/home');
  const router = useRouter();
  const { apps } = useUnlockRewards();
  const { todaySteps } = useSteps();
  const [weekDays, setWeekDays] = useState<UnlockImpactWeekDay[]>(MOCK_UNLOCK_IMPACT_WEEK);
  const [vsLastWeekPct, setVsLastWeekPct] = useState(0);

  useEffect(() => {
    let mounted = true;
    loadUnlockImpactWeekDays(apps)
      .then((days) => {
        if (!mounted) return;
        setWeekDays(days);
        return computeVsLastWeekPct(days);
      })
      .then((pct) => {
        if (mounted && pct != null) setVsLastWeekPct(pct);
      });
    return () => {
      mounted = false;
    };
  }, [apps]);

  const impact = buildUnlockImpactSummary(
    apps,
    weekDays,
    undefined,
    undefined,
    undefined,
    todaySteps,
    vsLastWeekPct,
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
