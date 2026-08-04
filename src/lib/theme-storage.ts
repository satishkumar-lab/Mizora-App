import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mizora/theme_scheme_v1';

export type MizoraThemeScheme = 'light' | 'dark';

export async function loadMizoraTheme(): Promise<MizoraThemeScheme | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (raw === 'light' || raw === 'dark') return raw;
  return null;
}

export async function saveMizoraTheme(scheme: MizoraThemeScheme): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, scheme);
}
