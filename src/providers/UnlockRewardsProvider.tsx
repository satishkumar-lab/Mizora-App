import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type { AppBrandId } from '@/components/icons/AppBrandIcon';
import { STEPS_TODAY } from '@/constants/stepsToday';
import { todayWaterGoalMl } from '@/constants/waterToday';
import { useWaterIntake } from '@/providers/WaterIntakeProvider';
import {
  buildRewardAppItem,
  clampStepUnlockGoal,
  clampUnlockWaterGoalMl,
  ensureChallengeBaselines,
  isAppLockEnabled,
  MAX_LOCKED_APPS_PER_DAY,
  snapshotChallengeBaselines,
  UNLOCK_APP_CONFIGS,
  type RewardAppItem,
  type UnlockAppConfig,
  type UnlockChallengeConfig,
} from '@/constants/unlockRewards';

type UnlockRewardsContextValue = {
  configs: UnlockAppConfig[];
  apps: RewardAppItem[];
  lockedAppCount: number;
  maxLockedApps: number;
  getApp: (id: string) => RewardAppItem | undefined;
  getConfig: (id: string) => UnlockAppConfig | undefined;
  setLockEnabled: (appId: AppBrandId, enabled: boolean) => boolean;
  setChallengeKind: (appId: string, kind: UnlockChallengeConfig['kind']) => void;
  adjustStepGoal: (appId: string, delta: number) => void;
  adjustWaterGoal: (appId: string, deltaMl: number) => void;
  setStepGoalSteps: (appId: AppBrandId, steps: number) => void;
  setWaterGoalMl: (appId: AppBrandId, ml: number) => void;
  setUserLockedToday: (appId: string, locked: boolean) => void;
};

const UnlockRewardsContext = createContext<UnlockRewardsContextValue | null>(null);

function defaultWaterGoalMl(): number {
  return todayWaterGoalMl();
}

function defaultStepGoal(): number {
  return 2000;
}

function countLocked(configs: UnlockAppConfig[]): number {
  return configs.filter(isAppLockEnabled).length;
}

export function UnlockRewardsProvider({ children }: { children: ReactNode }) {
  const stepsToday = STEPS_TODAY.steps;
  const { loggedMl: waterLoggedMl } = useWaterIntake();

  const [configs, setConfigs] = useState<UnlockAppConfig[]>(() =>
    ensureChallengeBaselines(UNLOCK_APP_CONFIGS, stepsToday, waterLoggedMl),
  );

  const lockedAppCount = useMemo(() => countLocked(configs), [configs]);

  const activeConfigs = useMemo(() => configs.filter(isAppLockEnabled), [configs]);

  const apps = useMemo(
    () => activeConfigs.map((c) => buildRewardAppItem(c, stepsToday, waterLoggedMl)),
    [activeConfigs, stepsToday, waterLoggedMl],
  );

  const getApp = useCallback((id: string) => apps.find((a) => a.id === id), [apps]);
  const getConfig = useCallback((id: string) => configs.find((c) => c.id === id), [configs]);

  const updateConfig = useCallback(
    (appId: string, updater: (c: UnlockAppConfig) => UnlockAppConfig) => {
      setConfigs((prev) => prev.map((c) => (c.id === appId ? updater(c) : c)));
    },
    [],
  );

  const setLockEnabled = useCallback(
    (appId: AppBrandId, enabled: boolean): boolean => {
      let applied = true;
      setConfigs((prev) => {
        if (enabled) {
          const count = countLocked(prev);
          const wasOn = prev.find((c) => c.id === appId)?.lockEnabled !== false;
          if (!wasOn && count >= MAX_LOCKED_APPS_PER_DAY) {
            applied = false;
            return prev;
          }
        }
        return prev.map((c) => {
          if (c.id !== appId) return c;
          if (!enabled) {
            return {
              ...c,
              lockEnabled: false,
              stepsProgressBaseline: undefined,
              waterProgressBaselineMl: undefined,
            };
          }
          if (c.lockEnabled !== false) {
            return c;
          }
          const withLock: UnlockAppConfig = { ...c, lockEnabled: true };
          return {
            ...withLock,
            ...snapshotChallengeBaselines(withLock, stepsToday, waterLoggedMl),
          };
        });
      });
      return applied;
    },
    [stepsToday, waterLoggedMl],
  );

  const setChallengeKind = useCallback(
    (appId: string, kind: UnlockChallengeConfig['kind']) => {
      updateConfig(appId, (c) => {
        if (c.challenge.kind === kind) return c;
        let next: UnlockAppConfig;
        if (kind === 'steps') {
          next = { ...c, challenge: { kind: 'steps', goalSteps: defaultStepGoal() } };
        } else {
          next = { ...c, challenge: { kind: 'water', goalMl: defaultWaterGoalMl() } };
        }
        return { ...next, ...snapshotChallengeBaselines(next, stepsToday, waterLoggedMl) };
      });
    },
    [updateConfig, stepsToday, waterLoggedMl],
  );

  const adjustStepGoal = useCallback(
    (appId: string, delta: number) => {
      updateConfig(appId, (c) => {
        if (c.challenge.kind !== 'steps') return c;
        const next: UnlockAppConfig = {
          ...c,
          challenge: {
            kind: 'steps',
            goalSteps: clampStepUnlockGoal(c.challenge.goalSteps + delta),
          },
        };
        return { ...next, ...snapshotChallengeBaselines(next, stepsToday, waterLoggedMl) };
      });
    },
    [updateConfig, stepsToday, waterLoggedMl],
  );

  const adjustWaterGoal = useCallback(
    (appId: string, deltaMl: number) => {
      updateConfig(appId, (c) => {
        if (c.challenge.kind !== 'water') return c;
        const next: UnlockAppConfig = {
          ...c,
          challenge: {
            kind: 'water',
            goalMl: clampUnlockWaterGoalMl(c.challenge.goalMl + deltaMl),
          },
        };
        return { ...next, ...snapshotChallengeBaselines(next, stepsToday, waterLoggedMl) };
      });
    },
    [updateConfig, stepsToday, waterLoggedMl],
  );

  const setStepGoalSteps = useCallback(
    (appId: AppBrandId, steps: number) => {
      updateConfig(appId, (c) => {
        const next: UnlockAppConfig = {
          ...c,
          challenge: { kind: 'steps', goalSteps: clampStepUnlockGoal(steps) },
        };
        return { ...next, ...snapshotChallengeBaselines(next, stepsToday, waterLoggedMl) };
      });
    },
    [updateConfig, stepsToday, waterLoggedMl],
  );

  const setWaterGoalMl = useCallback(
    (appId: AppBrandId, ml: number) => {
      updateConfig(appId, (c) => {
        const next: UnlockAppConfig = {
          ...c,
          challenge: { kind: 'water', goalMl: clampUnlockWaterGoalMl(ml) },
        };
        return { ...next, ...snapshotChallengeBaselines(next, stepsToday, waterLoggedMl) };
      });
    },
    [updateConfig, stepsToday, waterLoggedMl],
  );

  const setUserLockedToday = useCallback(
    (appId: string, locked: boolean) => {
      updateConfig(appId, (c) => ({ ...c, userLockedToday: locked }));
    },
    [updateConfig],
  );

  const value = useMemo(
    () => ({
      configs,
      apps,
      lockedAppCount,
      maxLockedApps: MAX_LOCKED_APPS_PER_DAY,
      getApp,
      getConfig,
      setLockEnabled,
      setChallengeKind,
      adjustStepGoal,
      adjustWaterGoal,
      setStepGoalSteps,
      setWaterGoalMl,
      setUserLockedToday,
    }),
    [
      configs,
      apps,
      lockedAppCount,
      getApp,
      getConfig,
      setLockEnabled,
      setChallengeKind,
      adjustStepGoal,
      adjustWaterGoal,
      setStepGoalSteps,
      setWaterGoalMl,
      setUserLockedToday,
    ],
  );

  return <UnlockRewardsContext.Provider value={value}>{children}</UnlockRewardsContext.Provider>;
}

export function useUnlockRewards() {
  const ctx = useContext(UnlockRewardsContext);
  if (!ctx) {
    throw new Error('useUnlockRewards must be used within UnlockRewardsProvider');
  }
  return ctx;
}
