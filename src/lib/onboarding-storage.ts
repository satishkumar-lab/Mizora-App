import AsyncStorage from '@react-native-async-storage/async-storage';

/** Bump when onboarding must be shown again (e.g. new production flow). */
export const CURRENT_ONBOARDING_FLOW_VERSION = 2;

const KEYS = {
  complete: '@mizora/onboarding_complete',
  displayName: '@mizora/display_name',
  flowVersion: '@mizora/onboarding_flow_version',
} as const;

export const onboardingStorageKeys = KEYS;

export type OnboardingProfile = {
  displayName?: string;
};

export async function getOnboardingComplete(): Promise<boolean> {
  const pairs = await AsyncStorage.multiGet([KEYS.complete, KEYS.flowVersion]);
  const complete = pairs.find(([key]) => key === KEYS.complete)?.[1];
  const flowVersion = pairs.find(([key]) => key === KEYS.flowVersion)?.[1];
  if (complete !== 'true') return false;
  return flowVersion === String(CURRENT_ONBOARDING_FLOW_VERSION);
}

export async function getDisplayName(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.displayName);
}

export async function completeOnboarding(profile: OnboardingProfile = {}): Promise<void> {
  const trimmed = profile.displayName?.trim();
  const memberSince = new Date().toISOString();
  await AsyncStorage.multiSet([
    [KEYS.complete, 'true'],
    [KEYS.flowVersion, String(CURRENT_ONBOARDING_FLOW_VERSION)],
    [KEYS.displayName, trimmed && trimmed.length > 0 ? trimmed : ''],
    ['@mizora/profile/member_since', memberSince],
  ]);
}

/** Dev / settings helper — not wired in UI yet */
export async function resetOnboardingForDev(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.complete, KEYS.displayName, KEYS.flowVersion]);
}

/** Profile log out — show onboarding again; keeps step/water logs on device. */
export async function logoutToOnboarding(): Promise<void> {
  await AsyncStorage.multiRemove([KEYS.complete, KEYS.flowVersion]);
}
