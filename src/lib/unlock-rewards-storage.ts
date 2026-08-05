import AsyncStorage from '@react-native-async-storage/async-storage';

import type { AppBrandId } from '@/components/icons/AppBrandIcon';
import {
  clampStepUnlockGoal,
  clampUnlockWaterGoalMl,
  UNLOCK_APP_CONFIGS,
  type UnlockAppConfig,
  type UnlockChallengeConfig,
} from '@/constants/unlockRewards';
import { localTodayDateKey } from '@/lib/localDate';

const STORAGE_KEY = '@mizora/unlock_rewards_v1';

const KNOWN_APP_IDS = new Set<AppBrandId>(UNLOCK_APP_CONFIGS.map((c) => c.id));

type StoredUnlockSnapshot = {
  dateKey: string;
  configs: UnlockAppConfig[];
};

function isAppBrandId(id: unknown): id is AppBrandId {
  return typeof id === 'string' && KNOWN_APP_IDS.has(id as AppBrandId);
}

function parseChallenge(raw: unknown, fallback: UnlockChallengeConfig): UnlockChallengeConfig {
  if (!raw || typeof raw !== 'object') return fallback;
  const data = raw as { kind?: string; goalSteps?: number; goalMl?: number };
  if (data.kind === 'water') {
    return {
      kind: 'water',
      goalMl: clampUnlockWaterGoalMl(
        Number(data.goalMl ?? (fallback.kind === 'water' ? fallback.goalMl : 2000)),
      ),
    };
  }
  return {
    kind: 'steps',
    goalSteps: clampStepUnlockGoal(
      Number(data.goalSteps ?? (fallback.kind === 'steps' ? fallback.goalSteps : 2000)),
    ),
  };
}

function parseConfig(raw: unknown, template: UnlockAppConfig): UnlockAppConfig | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Partial<UnlockAppConfig>;
  if (!isAppBrandId(data.id) || data.id !== template.id) return null;

  const stepsBaseline =
    typeof data.stepsProgressBaseline === 'number' && data.stepsProgressBaseline >= 0
      ? Math.round(data.stepsProgressBaseline)
      : undefined;
  const waterBaseline =
    typeof data.waterProgressBaselineMl === 'number' && data.waterProgressBaselineMl >= 0
      ? Math.round(data.waterProgressBaselineMl)
      : undefined;

  return {
    id: template.id,
    name: template.name,
    lockEnabled:
      data.lockEnabled === false
        ? false
        : data.lockEnabled === true
          ? true
          : template.lockEnabled !== false,
    userLockedToday: Boolean(data.userLockedToday),
    challenge: parseChallenge(data.challenge, template.challenge),
    stepsProgressBaseline: stepsBaseline,
    waterProgressBaselineMl: waterBaseline,
  };
}

/** Merge saved configs with current defaults (new apps, stable display names). */
export function mergeUnlockConfigsWithDefaults(stored: UnlockAppConfig[]): UnlockAppConfig[] {
  const byId = new Map(stored.filter((c) => isAppBrandId(c.id)).map((c) => [c.id, c]));
  return UNLOCK_APP_CONFIGS.map((template) => {
    const saved = byId.get(template.id);
    if (!saved) return { ...template };
    return {
      ...template,
      lockEnabled: saved.lockEnabled,
      userLockedToday: saved.userLockedToday,
      challenge: saved.challenge,
      stepsProgressBaseline: saved.stepsProgressBaseline,
      waterProgressBaselineMl: saved.waterProgressBaselineMl,
    };
  });
}

/** New local day: clear per-day flags and challenge baselines so progress restarts. */
export function rolloverUnlockConfigsForNewDay(configs: UnlockAppConfig[]): UnlockAppConfig[] {
  return configs.map((c) => ({
    ...c,
    userLockedToday: false,
    stepsProgressBaseline: undefined,
    waterProgressBaselineMl: undefined,
  }));
}

function parseStored(raw: string | null): UnlockAppConfig[] {
  if (!raw) return mergeUnlockConfigsWithDefaults([]);
  try {
    const data = JSON.parse(raw) as Partial<StoredUnlockSnapshot> & { configs?: unknown[] };
    const list = Array.isArray(data.configs) ? data.configs : [];
    const parsed: UnlockAppConfig[] = [];
    for (const template of UNLOCK_APP_CONFIGS) {
      const entry = list.find(
        (item) => item && typeof item === 'object' && (item as UnlockAppConfig).id === template.id,
      );
      const cfg = parseConfig(entry, template);
      parsed.push(cfg ?? { ...template });
    }
    let merged = mergeUnlockConfigsWithDefaults(parsed);
    const today = localTodayDateKey();
    if (data.dateKey !== today) {
      merged = rolloverUnlockConfigsForNewDay(merged);
    }
    return merged;
  } catch {
    return mergeUnlockConfigsWithDefaults([]);
  }
}

export async function loadUnlockRewardConfigs(): Promise<UnlockAppConfig[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return parseStored(raw);
}

export async function saveUnlockRewardConfigs(configs: UnlockAppConfig[]): Promise<void> {
  const payload: StoredUnlockSnapshot = {
    dateKey: localTodayDateKey(),
    configs: mergeUnlockConfigsWithDefaults(configs),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}
