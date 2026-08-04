import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { BlockedAppsChallengeHero } from '@/components/unlock/BlockedAppsChallengeHero';
import { BlockedAppsManageList } from '@/components/unlock/BlockedAppsManageList';
import { ScreenTimeRecommendations } from '@/components/unlock/ScreenTimeRecommendations';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { MAX_LOCKED_APPS_PER_DAY } from '@/constants/unlockRewards';
import { useUnlockRewards } from '@/providers/UnlockRewardsProvider';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { fonts } from '@/theme/tokens';

export function BlockedAppsManageScreen() {
  const insets = useSafeAreaInsets();
  const goBack = useMizoraBack('/home');
  const router = useRouter();
  const { colors, isDark } = useMizoraTheme();
  const {
    configs,
    lockedAppCount,
    setLockEnabled,
    setChallengeKind,
    setStepGoalSteps,
    setWaterGoalMl,
  } = useUnlockRewards();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader
            onBack={goBack}
            title="Lock Challenge"
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
          <View style={{ gap: 18 }}>
            <BlockedAppsChallengeHero lockedCount={lockedAppCount} />

            <ScreenTimeRecommendations
              configs={configs}
              onSuggestLock={(id) => setLockEnabled(id, true)}
            />

            <View style={{ gap: 10 }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 16, color: colors.textStrong }}>
                All apps
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 11,
                  color: colors.textMuted,
                  marginTop: -4,
                }}
              >
                Toggle on, set target, start earning unlocks
              </Text>
              <BlockedAppsManageList
                configs={configs}
                lockedCount={lockedAppCount}
                maxLocked={MAX_LOCKED_APPS_PER_DAY}
                onToggleLock={setLockEnabled}
                onSelectChallengeKind={setChallengeKind}
                onSetStepGoal={setStepGoalSteps}
                onSetWaterGoal={setWaterGoalMl}
                onOpenDetail={(id) => router.push(`/rewards/${id}`)}
              />
            </View>
          </View>
        </ScrollView>
      </ThemedScreen>
    </>
  );
}
