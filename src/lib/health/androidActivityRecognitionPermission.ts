import { PermissionsAndroid, Platform } from 'react-native';

import { logAndroidHealthDebug } from '@/lib/health/androidHealthDebugLog';

const PERMISSION = PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION;

/** Android 10+ (API 29+) runtime permission for physical activity. */
export async function ensureActivityRecognitionPermission(
  requestIfNeeded: boolean,
): Promise<'granted' | 'denied' | 'unavailable'> {
  if (Platform.OS !== 'android') {
    return 'unavailable';
  }

  if (typeof Platform.Version === 'number' && Platform.Version < 29) {
    return 'granted';
  }

  const already = await PermissionsAndroid.check(PERMISSION);
  if (already) {
    return 'granted';
  }

  if (!requestIfNeeded) {
    return 'denied';
  }

  logAndroidHealthDebug('ActivityRecognition_Request');
  const result = await PermissionsAndroid.request(PERMISSION, {
    title: 'Allow step tracking',
    message: 'Mizora counts your steps for today’s goals, streaks, and charts.',
    buttonPositive: 'Allow',
    buttonNegative: 'Not now',
  });

  if (result === PermissionsAndroid.RESULTS.GRANTED) {
    logAndroidHealthDebug('ActivityRecognition_Granted');
    return 'granted';
  }
  logAndroidHealthDebug('ActivityRecognition_Denied');
  return 'denied';
}
