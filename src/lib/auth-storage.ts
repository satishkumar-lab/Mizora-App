import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@mizora/auth/google_user_v1';

export type MizoraAuthUser = {
  provider: 'google';
  id: string;
  email: string;
  name: string;
  picture?: string;
  signedInAt: string;
};

export async function getAuthUser(): Promise<MizoraAuthUser | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MizoraAuthUser;
  } catch {
    return null;
  }
}

export async function saveAuthUser(user: MizoraAuthUser): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(user));
}

export async function clearAuthUser(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
