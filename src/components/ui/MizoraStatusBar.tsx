import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StatusBar as RNStatusBar } from 'react-native';

import { useMizoraTheme } from '@/hooks/useMizoraTheme';

const ANDROID_LIGHT_BG = '#fafafa';
const ANDROID_DARK_BG = '#0f1410';

/** Theme-aware status bar — syncs Android system bar style + background with app canvas. */
export function MizoraStatusBar() {
  const { isDark } = useMizoraTheme();

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    RNStatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
    RNStatusBar.setBackgroundColor(isDark ? ANDROID_DARK_BG : ANDROID_LIGHT_BG, true);
  }, [isDark]);

  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}
