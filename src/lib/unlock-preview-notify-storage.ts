import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mizora/unlock_preview_notify_v1';

export async function getUnlockPreviewNotifyRequested(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw === '1';
}

export async function setUnlockPreviewNotifyRequested(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, '1');
}
