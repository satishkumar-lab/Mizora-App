import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mizora/personalization_prefs_v1';

export type PersonalizationPrefs = {
  /** Daily insight on home (on-device rules from your activity). */
  homeInsightsEnabled: boolean;
  /** Suggested unlock step/water targets in app rules. */
  smartUnlockGoalsEnabled: boolean;
  /** Which apps to consider locking when slots remain. */
  lockSuggestionsEnabled: boolean;
};

export const DEFAULT_PERSONALIZATION_PREFS: PersonalizationPrefs = {
  homeInsightsEnabled: true,
  smartUnlockGoalsEnabled: true,
  lockSuggestionsEnabled: true,
};

function parseStored(raw: string | null): PersonalizationPrefs {
  if (!raw) return { ...DEFAULT_PERSONALIZATION_PREFS };
  try {
    const data = JSON.parse(raw) as Partial<PersonalizationPrefs>;
    return {
      homeInsightsEnabled: data.homeInsightsEnabled !== false,
      smartUnlockGoalsEnabled: data.smartUnlockGoalsEnabled !== false,
      lockSuggestionsEnabled: data.lockSuggestionsEnabled !== false,
    };
  } catch {
    return { ...DEFAULT_PERSONALIZATION_PREFS };
  }
}

export async function loadPersonalizationPrefs(): Promise<PersonalizationPrefs> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return parseStored(raw);
}

export async function savePersonalizationPrefs(prefs: PersonalizationPrefs): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}
