import '../global.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useMizoraFonts } from '@/hooks/useMizoraFonts';
import { NotificationDemoProvider } from '@/demo/notifications/NotificationDemoProvider';
import { MizoraThemeProvider } from '@/providers/MizoraThemeProvider';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function AppShell() {
  return (
    <View className="flex-1 bg-mizora-bg dark:bg-mizora-bg-dark">
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}

export default function RootLayout() {
  const { loaded, error } = useMizoraFonts();

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <MizoraThemeProvider>
        {__DEV__ ? (
          <NotificationDemoProvider>
            <AppShell />
          </NotificationDemoProvider>
        ) : (
          <AppShell />
        )}
      </MizoraThemeProvider>
    </SafeAreaProvider>
  );
}
