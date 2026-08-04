import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';

import type { AppBrandId } from '@/components/icons/AppBrandIcon';

/** Deep links for earned unlock — device must have app installed. */
const APP_OPEN_URL: Partial<Record<AppBrandId, string>> = {
  instagram: 'instagram://app',
  whatsapp: 'whatsapp://send',
  snapchat: 'snapchat://',
};

export type OpenEarnedAppResult = 'opened' | 'unavailable';

export async function openEarnedApp(
  appId: AppBrandId,
  appName: string,
): Promise<OpenEarnedAppResult> {
  const url = APP_OPEN_URL[appId];
  if (!url) {
    Alert.alert('Not linked yet', `${appName} open is not configured in this build.`);
    return 'unavailable';
  }

  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert(
        `${appName} not installed`,
        Platform.OS === 'ios'
          ? `Install ${appName} from the App Store, then try again.`
          : `Install ${appName}, then try again.`,
      );
      return 'unavailable';
    }
    await Linking.openURL(url);
    return 'opened';
  } catch {
    Alert.alert('Could not open', `Something went wrong opening ${appName}.`);
    return 'unavailable';
  }
}
