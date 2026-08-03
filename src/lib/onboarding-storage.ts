import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  complete: '@mizora/onboarding_complete',
  displayName: '@mizora/display_name',
} as const;

export type OnboardingProfile = {
  displayName?: string;
};

export async function getOnboardingComplete(): Promise<boolean> {
  const value = await AsyncStorage.getItem(KEYS.complete);
  return value === 'true';
}

export async function getDisplayName(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.displayName);
}

export async function completeOnboarding(profile: OnboardingProfile = {}): Promise<void> {
  const trimmed = profile.displayName?.trim();
  await AsyncStorage.multiSet([
    [KEYS.complete, 'true'],
    [KEYS.displayName, trimmed && trimmed.length > 0 ? trimmed : ''],
  ]);
}

/** Dev / settings helper — not wired in UI yet */
export async function resetOnboardingForDev(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.complete, KEYS.displayName]);
}
