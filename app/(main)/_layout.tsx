import { Redirect, Stack, useFocusEffect, usePathname } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MainNav } from '@/components/home/MainNav';
import { AndroidStepTrackingSetupSheet } from '@/components/steps/AndroidStepTrackingSetupSheet';
import { getOnboardingComplete } from '@/lib/onboarding-storage';
import { UnlockRewardsProvider } from '@/providers/UnlockRewardsProvider';
import { PersonalizationProvider } from '@/providers/PersonalizationProvider';
import { StepsProvider } from '@/providers/StepsProvider';
import { WaterIntakeProvider } from '@/providers/WaterIntakeProvider';

function shouldHideMainNav(pathname: string): boolean {
  return pathname.startsWith('/profile/edit') || pathname.startsWith('/profile/health');
}

/** Authenticated app shell — tab roots + stack detail routes + fixed bottom nav. */
export default function MainAppLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const hideNav = shouldHideMainNav(pathname);
  const [onboardingGateReady, setOnboardingGateReady] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    let mounted = true;
    getOnboardingComplete()
      .then((complete) => {
        if (mounted) {
          setOnboardingComplete(complete);
          setOnboardingGateReady(true);
        }
      })
      .catch(() => {
        if (mounted) {
          setOnboardingComplete(false);
          setOnboardingGateReady(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      void getOnboardingComplete().then((complete) => {
        if (mounted) {
          setOnboardingComplete(complete);
        }
      });
      return () => {
        mounted = false;
      };
    }, []),
  );

  if (!onboardingGateReady) {
    return (
      <View className="flex-1 items-center justify-center bg-mizora-bg dark:bg-mizora-bg-dark">
        <ActivityIndicator color="#34c759" />
      </View>
    );
  }

  if (!onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <StepsProvider>
      <WaterIntakeProvider>
        <UnlockRewardsProvider>
          <PersonalizationProvider>
            <View className="flex-1 bg-mizora-bg dark:bg-mizora-bg-dark">
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'slide_from_right',
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'none' }} />
              </Stack>
              {hideNav ? null : (
                <View
                  pointerEvents="box-none"
                  className="absolute bottom-0 left-0 right-0 items-center"
                  style={{ paddingBottom: Math.max(insets.bottom, 16) }}
                >
                  <MainNav />
                </View>
              )}
              <AndroidStepTrackingSetupSheet />
            </View>
          </PersonalizationProvider>
        </UnlockRewardsProvider>
      </WaterIntakeProvider>
    </StepsProvider>
  );
}
