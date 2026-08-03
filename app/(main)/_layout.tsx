import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MainNav } from '@/components/home/MainNav';

/** Authenticated app shell — stack screens + fixed bottom nav on every main route. */
export default function MainAppLayout() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-mizora-bg">
      <Stack screenOptions={{ headerShown: false }} />
      <View
        pointerEvents="box-none"
        className="absolute bottom-0 left-0 right-0 items-center"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <MainNav />
      </View>
    </View>
  );
}
