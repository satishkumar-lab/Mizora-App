/** Stored in AsyncStorage — `preset:<id>` or a local file URI from the gallery. */
export const PROFILE_AVATAR_PRESET_PREFIX = 'preset:' as const;

export type ProfileAvatarPresetId = 'ava-1' | 'ava-2' | 'ava-3' | 'ava-4' | 'ava-5' | 'ava-6';

export type ProfileAvatarPreset = {
  id: ProfileAvatarPresetId;
  /** DiceBear seed — deterministic illustration per avatar */
  seed: string;
};

/** Curated seeds — DiceBear Lorelei + Adventurer (MIT, dicebear.com). */
export const PROFILE_AVATAR_PRESETS: ProfileAvatarPreset[] = [
  { id: 'ava-1', seed: 'mizora-leah' },
  { id: 'ava-2', seed: 'mizora-omar' },
  { id: 'ava-3', seed: 'mizora-priya' },
  { id: 'ava-4', seed: 'mizora-jordan' },
  { id: 'ava-5', seed: 'mizora-sofia' },
  { id: 'ava-6', seed: 'mizora-kai' },
];

export function presetById(id: ProfileAvatarPresetId): ProfileAvatarPreset | undefined {
  return PROFILE_AVATAR_PRESETS.find((p) => p.id === id);
}

export function isPresetProfileAvatar(stored: string | null | undefined): stored is string {
  return Boolean(stored?.startsWith(PROFILE_AVATAR_PRESET_PREFIX));
}

export function profileAvatarPresetId(stored: string): ProfileAvatarPresetId | null {
  if (!isPresetProfileAvatar(stored)) return null;
  const id = stored.slice(PROFILE_AVATAR_PRESET_PREFIX.length) as ProfileAvatarPresetId;
  return PROFILE_AVATAR_PRESETS.some((p) => p.id === id) ? id : null;
}

export function presetProfileAvatarStorageId(id: ProfileAvatarPresetId): string {
  return `${PROFILE_AVATAR_PRESET_PREFIX}${id}`;
}

/** Mizora-tinted backdrop options for DiceBear */
export const DICEBEAR_BACKGROUND_COLORS = [
  'e5ece2',
  'dce8d6',
  'fce8dc',
  'f5ffbb',
  'fafbf4',
  'd7ffc7',
] as const;
