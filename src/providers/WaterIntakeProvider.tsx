import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { formatHomeWaterDisplay } from '@/constants/waterToday';
import { clampWaterGoalMl } from '@/lib/water-recommendation';
import {
  activeWaterDateKey,
  defaultWaterIntakeSnapshot,
  loadWaterIntakeSnapshot,
  loadWaterIntakeStore,
  saveWaterIntakeSnapshot,
  totalWaterMlForRollingWeek,
  waterMlForRollingWeek,
  type WaterIntakeSnapshot,
} from '@/lib/water-intake-storage';
import { applyWaterLogDeltaMl, trimWaterHourlyToMax, sumWaterHourlyMl } from '@/lib/water-hourly';

export type WaterRollingWeekDay = {
  dateKey: string;
  weekday: string;
  day: string;
  ml: number;
  isToday: boolean;
};

type WaterIntakeContextValue = {
  ready: boolean;
  loggedMl: number;
  goalMl: number;
  remainingMl: number;
  hourlyMl: readonly number[];
  rollingWeek: readonly WaterRollingWeekDay[];
  totalWeekMl: number;
  homeDisplay: { value: string; unit: 'L' };
  addMl: (delta: number) => void;
  removeMl: (amount: number) => void;
  setGoalMl: (ml: number) => void;
  reloadFromStorage: () => Promise<void>;
};

const WaterIntakeContext = createContext<WaterIntakeContextValue | null>(null);

function persist(snapshot: WaterIntakeSnapshot) {
  void saveWaterIntakeSnapshot(snapshot);
}

function snapshotFromState(
  loggedMl: number,
  goalMl: number,
  hourlyMl: readonly number[],
): WaterIntakeSnapshot {
  return {
    dateKey: activeWaterDateKey(),
    loggedMl,
    goalMl,
    hourlyMl: [...hourlyMl],
  };
}

export function WaterIntakeProvider({ children }: PropsWithChildren) {
  const seed = defaultWaterIntakeSnapshot();
  const [ready, setReady] = useState(false);
  const [loggedMl, setLoggedMl] = useState(seed.loggedMl);
  const [goalMl, setGoalMlState] = useState(seed.goalMl);
  const [hourlyMl, setHourlyMl] = useState<number[]>(() => [...seed.hourlyMl]);
  const [rollingWeek, setRollingWeek] = useState<WaterRollingWeekDay[]>([]);
  const [totalWeekMl, setTotalWeekMl] = useState(0);
  const [dateKey, setDateKey] = useState(activeWaterDateKey());

  const syncWeekFromStore = useCallback(async () => {
    const store = await loadWaterIntakeStore();
    setRollingWeek(waterMlForRollingWeek(store));
    setTotalWeekMl(totalWaterMlForRollingWeek(store));
  }, []);

  const reloadFromStorage = useCallback(async () => {
    const loaded = await loadWaterIntakeSnapshot();
    setLoggedMl(loaded.loggedMl);
    setGoalMlState(loaded.goalMl);
    setHourlyMl([...loaded.hourlyMl]);
    setDateKey(loaded.dateKey);
    await syncWeekFromStore();
    setReady(true);
  }, [syncWeekFromStore]);

  useEffect(() => {
    let mounted = true;
    // Initial load from AsyncStorage on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async hydration from device storage
    void reloadFromStorage()
      .catch(() => {
        if (mounted) setReady(true);
      })
      .finally(() => {
        if (mounted) {
          void syncWeekFromStore();
        }
      });
    return () => {
      mounted = false;
    };
  }, [reloadFromStorage, syncWeekFromStore]);

  useEffect(() => {
    const onAppState = (state: AppStateStatus) => {
      if (state !== 'active') return;
      const todayKey = activeWaterDateKey();
      if (todayKey !== dateKey) {
        void reloadFromStorage();
        return;
      }
      void syncWeekFromStore();
    };
    const sub = AppState.addEventListener('change', onAppState);
    return () => sub.remove();
  }, [dateKey, reloadFromStorage, syncWeekFromStore]);

  useEffect(() => {
    let midnightTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleMidnightReload = () => {
      if (midnightTimer !== null) {
        clearTimeout(midnightTimer);
      }
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setDate(nextMidnight.getDate() + 1);
      nextMidnight.setHours(0, 0, 0, 0);
      const delayMs = Math.max(0, nextMidnight.getTime() - now.getTime());
      midnightTimer = setTimeout(() => {
        midnightTimer = null;
        void reloadFromStorage();
        scheduleMidnightReload();
      }, delayMs);
    };

    scheduleMidnightReload();
    return () => {
      if (midnightTimer !== null) {
        clearTimeout(midnightTimer);
      }
    };
  }, [reloadFromStorage]);

  const ensureCurrentDayBeforeWrite = useCallback(async (): Promise<void> => {
    const todayKey = activeWaterDateKey();
    if (todayKey !== dateKey) {
      await reloadFromStorage();
    }
  }, [dateKey, reloadFromStorage]);

  const commit = useCallback(
    async (nextHourly: number[], nextGoal: number) => {
      await ensureCurrentDayBeforeWrite();
      const goal = clampWaterGoalMl(nextGoal);
      const trimmed = trimWaterHourlyToMax(nextHourly, goal);
      const logged = Math.min(sumWaterHourlyMl(trimmed), goal);
      setHourlyMl(trimmed);
      setLoggedMl(logged);
      setGoalMlState(goal);
      persist(snapshotFromState(logged, goal, trimmed));
      void syncWeekFromStore();
    },
    [ensureCurrentDayBeforeWrite, syncWeekFromStore],
  );

  const setGoalMl = useCallback(
    (ml: number) => {
      void commit(hourlyMl, ml);
    },
    [commit, hourlyMl],
  );

  const addMl = useCallback(
    (delta: number) => {
      if (delta === 0) return;
      void (async () => {
        await ensureCurrentDayBeforeWrite();
        const loaded = await loadWaterIntakeSnapshot();
        const { hourlyMl: nextHourly, loggedMl: nextLogged } = applyWaterLogDeltaMl(
          loaded.hourlyMl,
          delta,
          loaded.goalMl,
        );
        setHourlyMl(nextHourly);
        setLoggedMl(nextLogged);
        setGoalMlState(loaded.goalMl);
        setDateKey(loaded.dateKey);
        persist(snapshotFromState(nextLogged, loaded.goalMl, nextHourly));
        void syncWeekFromStore();
      })();
    },
    [ensureCurrentDayBeforeWrite, syncWeekFromStore],
  );

  const removeMl = useCallback(
    (amount: number) => {
      addMl(-amount);
    },
    [addMl],
  );

  const remainingMl = Math.max(0, goalMl - loggedMl);

  const value = useMemo(
    (): WaterIntakeContextValue => ({
      ready,
      loggedMl,
      goalMl,
      remainingMl,
      hourlyMl,
      rollingWeek,
      totalWeekMl,
      homeDisplay: formatHomeWaterDisplay(loggedMl, goalMl),
      addMl,
      removeMl,
      setGoalMl,
      reloadFromStorage,
    }),
    [
      ready,
      loggedMl,
      goalMl,
      remainingMl,
      hourlyMl,
      rollingWeek,
      totalWeekMl,
      addMl,
      removeMl,
      setGoalMl,
      reloadFromStorage,
    ],
  );

  return <WaterIntakeContext.Provider value={value}>{children}</WaterIntakeContext.Provider>;
}

export function useWaterIntake(): WaterIntakeContextValue {
  const ctx = useContext(WaterIntakeContext);
  if (!ctx) {
    throw new Error('useWaterIntake must be used within WaterIntakeProvider');
  }
  return ctx;
}
