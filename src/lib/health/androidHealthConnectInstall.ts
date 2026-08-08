import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, Platform } from 'react-native';

const HEALTH_CONNECT_PACKAGE = 'com.google.android.apps.healthdata';
const INSTALL_PROMPT_KEY = '@mizora/android/hc_install_prompt_shown';

const PLAY_STORE_URL = `market://details?id=${HEALTH_CONNECT_PACKAGE}`;
const PLAY_STORE_WEB = `https://play.google.com/store/apps/details?id=${HEALTH_CONNECT_PACKAGE}`;

export async function wasHealthConnectInstallPromptShown(): Promise<boolean> {
  const value = await AsyncStorage.getItem(INSTALL_PROMPT_KEY);
  return value === 'true';
}

export async function markHealthConnectInstallPromptShown(): Promise<void> {
  await AsyncStorage.setItem(INSTALL_PROMPT_KEY, 'true');
}

/** Opens Play Store to install or update the Health Connect provider (Google-standard package). */
export async function openHealthConnectInPlayStore(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }
  try {
    const canOpenMarket = await Linking.canOpenURL(PLAY_STORE_URL);
    await Linking.openURL(canOpenMarket ? PLAY_STORE_URL : PLAY_STORE_WEB);
  } catch {
    await Linking.openURL(PLAY_STORE_WEB);
  }
}

export async function openHealthConnectInstallOnce(): Promise<'opened' | 'already_guided'> {
  const shown = await wasHealthConnectInstallPromptShown();
  if (shown) {
    await openHealthConnectInPlayStore();
    return 'already_guided';
  }
  await markHealthConnectInstallPromptShown();
  await openHealthConnectInPlayStore();
  return 'opened';
}
