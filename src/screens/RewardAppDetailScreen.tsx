import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedScreen } from '@/components/ui/ThemedScreen';

import { AppUnlockFocusCard } from '@/components/unlock/AppUnlockFocusCard';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { AppUnlockRuleEditor } from '@/components/unlock/AppUnlockRuleEditor';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { openEarnedApp } from '@/lib/openEarnedApp';
import { useUnlockRewards } from '@/providers/UnlockRewardsProvider';
import { usePersonalization } from '@/providers/PersonalizationProvider';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';

export function RewardAppDetailScreen() {
  const { appId } = useLocalSearchParams<{ appId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const goBack = useMizoraBack('/home');

  const {
    getApp,
    setChallengeKind,
    adjustStepGoal,
    adjustWaterGoal,
    setUserLockedToday,
    setStepGoalSteps,
    setWaterGoalMl,
  } = useUnlockRewards();
  const { prefs, suggestedStepGoal, suggestedWaterGoalMl } = usePersonalization();
  const app = getApp(appId ?? '');

  if (!app) {
    return (
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader
            onBack={goBack}
            title="App unlock"
            rightAccessory={<MetricBadgeIcon kind="unlock" size={36} />}
          />
        </View>
      </ThemedScreen>
    );
  }

  const id = app.id;

  return (
    <ThemedScreen>
      <View className="px-5">
        <ScreenHeader
          onBack={goBack}
          title={app.name}
          rightAccessory={<MetricBadgeIcon kind="unlock" size={36} />}
        />
      </View>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-8"
        contentContainerStyle={{
          paddingTop: 12,
          paddingBottom: insets.bottom + MAIN_TAB_BAR_CLEARANCE,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4">
          <AppUnlockRuleEditor
            app={app}
            onSelectSteps={() => setChallengeKind(id, 'steps')}
            onSelectWater={() => setChallengeKind(id, 'water')}
            onAdjustSteps={(delta) => adjustStepGoal(id, delta)}
            onAdjustWater={(delta) => adjustWaterGoal(id, delta)}
            smartGoalsEnabled={prefs.smartUnlockGoalsEnabled}
            suggestedStepGoal={suggestedStepGoal(id)}
            suggestedWaterGoalMl={suggestedWaterGoalMl()}
            onApplySuggestedSteps={() => setStepGoalSteps(id, suggestedStepGoal(id))}
            onApplySuggestedWater={() => setWaterGoalMl(id, suggestedWaterGoalMl())}
          />

          <AppUnlockFocusCard
            app={app}
            onOpenApp={app.unlocked ? () => openEarnedApp(app.id, app.name) : undefined}
            onLockAgain={app.unlocked ? () => setUserLockedToday(id, true) : undefined}
            onUnlockForToday={
              app.goalComplete && app.userLockedToday
                ? () => setUserLockedToday(id, false)
                : undefined
            }
            onContinueChallenge={
              !app.goalComplete
                ? () => router.push(app.challenge.kind === 'steps' ? '/steps' : '/water')
                : undefined
            }
          />
        </View>
      </ScrollView>
    </ThemedScreen>
  );
}
