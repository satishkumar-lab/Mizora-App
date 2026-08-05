import { Stack, usePathname } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MainNav } from '@/components/home/MainNav';
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
            </View>
          </PersonalizationProvider>
        </UnlockRewardsProvider>
      </WaterIntakeProvider>
    </StepsProvider>
  );
}
