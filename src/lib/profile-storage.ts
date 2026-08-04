import AsyncStorage from '@react-native-async-storage/async-storage';

import { onboardingStorageKeys } from '@/lib/onboarding-storage';
import type { WaterActivityLevel, WaterProfileInput } from '@/lib/water-recommendation';

const KEYS = {
  healthProfile: '@mizora/profile/health_v1',
  notificationPrefs: '@mizora/profile/notification_prefs_v1',
  memberSince: '@mizora/profile/member_since',
  avatarUri: '@mizora/profile/avatar_uri_v1',
} as const;

export type NotificationPrefs = {
  masterEnabled: boolean;
  challengeReminders: boolean;
  unlockReady: boolean;
  streakReminders: boolean;
  walkNudges: boolean;
  quietHoursEnabled: boolean;
};

const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  masterEnabled: true,
  challengeReminders: true,
  unlockReady: true,
  streakReminders: true,
  walkNudges: true,
  quietHoursEnabled: true,
};

export type StoredHealthProfile = WaterProfileInput;

export async function ensureMemberSince(): Promise<string> {
  let iso = await AsyncStorage.getItem(KEYS.memberSince);
  if (!iso) {
    iso = new Date().toISOString();
    await AsyncStorage.setItem(KEYS.memberSince, iso);
  }
  return iso;
}

export async function getMemberSince(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.memberSince);
}

export async function setDisplayName(name: string): Promise<void> {
  const trimmed = name.trim();
  await AsyncStorage.setItem(onboardingStorageKeys.displayName, trimmed);
}

export { getDisplayName } from '@/lib/onboarding-storage';

export async function getHealthProfile(): Promise<StoredHealthProfile | null> {
  const raw = await AsyncStorage.getItem(KEYS.healthProfile);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredHealthProfile;
  } catch {
    return null;
  }
}

export async function saveHealthProfile(profile: StoredHealthProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.healthProfile, JSON.stringify(profile));
}

export async function getNotificationPrefs(): Promise<NotificationPrefs> {
  const raw = await AsyncStorage.getItem(KEYS.notificationPrefs);
  if (!raw) return { ...DEFAULT_NOTIFICATION_PREFS };
  try {
    return { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_NOTIFICATION_PREFS };
  }
}

export async function saveNotificationPrefs(prefs: NotificationPrefs): Promise<void> {
  await AsyncStorage.setItem(KEYS.notificationPrefs, JSON.stringify(prefs));
}

/** V1 — DiceBear preset id (`preset:ava-1`) stored here. */
export async function getProfileAvatarUri(): Promise<string | null> {
  return AsyncStorage.getItem(KEYS.avatarUri);
}

export async function setProfileAvatarUri(uri: string | null): Promise<void> {
  if (uri) {
    await AsyncStorage.setItem(KEYS.avatarUri, uri);
  } else {
    await AsyncStorage.removeItem(KEYS.avatarUri);
  }
}

/** Guest V1 — clear on-device personal data (store deletion path). */
export async function clearAllLocalUserData(): Promise<void> {
  await AsyncStorage.multiRemove([
    onboardingStorageKeys.displayName,
    KEYS.healthProfile,
    KEYS.notificationPrefs,
    KEYS.memberSince,
    KEYS.avatarUri,
  ]);
}

export function formatMemberSince(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

export const ACTIVITY_LEVEL_LABEL: Record<WaterActivityLevel, string> = {
  low: 'Mostly sedentary',
  moderate: 'Moderately active',
  high: 'Very active',
};
