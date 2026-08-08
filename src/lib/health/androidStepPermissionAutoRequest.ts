import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const AUTO_REQUEST_KEY = '@mizora/android/steps_auto_request_attempted';

export async function consumeAndroidAutoRequestStepPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }
  const attempted = await AsyncStorage.getItem(AUTO_REQUEST_KEY);
  if (attempted === 'true') {
    return false;
  }
  await AsyncStorage.setItem(AUTO_REQUEST_KEY, 'true');
  return true;
}

export async function resetAndroidAutoRequestStepPermissionForDev(): Promise<void> {
  await AsyncStorage.removeItem(AUTO_REQUEST_KEY);
}
