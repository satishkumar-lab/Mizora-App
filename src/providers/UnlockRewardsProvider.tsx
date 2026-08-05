import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import type { AppBrandId } from '@/components/icons/AppBrandIcon';
import { useSteps } from '@/providers/StepsProvider';
import { todayWaterGoalMl } from '@/constants/waterToday';
import { useWaterIntake } from '@/providers/WaterIntakeProvider';
import { recordUnlockStepCompletion } from '@/lib/unlock-impact-storage';
import { loadUnlockRewardConfigs, saveUnlockRewardConfigs } from '@/lib/unlock-rewards-storage';
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
  ready: boolean;
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
  const { todaySteps: stepsToday } = useSteps();
  const { loggedMl: waterLoggedMl } = useWaterIntake();

  const [ready, setReady] = useState(false);
  const [storedConfigs, setStoredConfigs] = useState<UnlockAppConfig[]>(() => [
    ...UNLOCK_APP_CONFIGS,
  ]);
  const completionRecordedRef = useRef<Set<string>>(new Set());

  const configs = useMemo(
    () => ensureChallengeBaselines(storedConfigs, stepsToday, waterLoggedMl),
    [storedConfigs, stepsToday, waterLoggedMl],
  );

  useEffect(() => {
    let mounted = true;
    loadUnlockRewardConfigs()
      .then((loaded) => {
        if (!mounted) return;
        setStoredConfigs(loaded);
        setReady(true);
      })
      .catch(() => {
        if (mounted) setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    void saveUnlockRewardConfigs(storedConfigs);
  }, [storedConfigs, ready]);

  const lockedAppCount = useMemo(() => countLocked(configs), [configs]);

  const activeConfigs = useMemo(() => configs.filter(isAppLockEnabled), [configs]);

  const apps = useMemo(
    () => activeConfigs.map((c) => buildRewardAppItem(c, stepsToday, waterLoggedMl)),
    [activeConfigs, stepsToday, waterLoggedMl],
  );

  useEffect(() => {
    for (const app of apps) {
      if (!app.goalComplete || app.challenge.kind !== 'steps') continue;
      if (completionRecordedRef.current.has(app.id)) continue;
      completionRecordedRef.current.add(app.id);
      void recordUnlockStepCompletion(app.id, app.challenge.earnedSteps);
    }
  }, [apps]);

  const getApp = useCallback((id: string) => apps.find((a) => a.id === id), [apps]);
  const getConfig = useCallback((id: string) => configs.find((c) => c.id === id), [configs]);

  const updateConfig = useCallback(
    (appId: string, updater: (c: UnlockAppConfig) => UnlockAppConfig) => {
      setStoredConfigs((prev) => prev.map((c) => (c.id === appId ? updater(c) : c)));
    },
    [],
  );

  const setLockEnabled = useCallback(
    (appId: AppBrandId, enabled: boolean): boolean => {
      let applied = true;
      setStoredConfigs((prev) => {
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
      ready,
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
      ready,
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
