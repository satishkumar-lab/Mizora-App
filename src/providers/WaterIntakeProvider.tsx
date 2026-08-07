import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import { formatHomeWaterDisplay } from '@/constants/waterToday';
import { clampWaterGoalMl } from '@/lib/water-recommendation';
import {
  activeWaterDateKey,
  defaultWaterIntakeSnapshot,
  loadWaterIntakeSnapshot,
  saveWaterIntakeSnapshot,
  type WaterIntakeSnapshot,
} from '@/lib/water-intake-storage';
import { applyWaterLogDeltaMl, trimWaterHourlyToMax, sumWaterHourlyMl } from '@/lib/water-hourly';

type WaterIntakeContextValue = {
  ready: boolean;
  loggedMl: number;
  goalMl: number;
  remainingMl: number;
  hourlyMl: readonly number[];
  homeDisplay: { value: string; unit: 'L' };
  addMl: (delta: number) => void;
  removeMl: (amount: number) => void;
  setGoalMl: (ml: number) => void;
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

  useEffect(() => {
    let mounted = true;
    loadWaterIntakeSnapshot()
      .then((loaded) => {
        if (!mounted) return;
        setLoggedMl(loaded.loggedMl);
        setGoalMlState(loaded.goalMl);
        setHourlyMl([...loaded.hourlyMl]);
        setReady(true);
      })
      .catch(() => {
        if (mounted) setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const commit = useCallback((nextHourly: number[], nextGoal: number) => {
    const goal = clampWaterGoalMl(nextGoal);
    const trimmed = trimWaterHourlyToMax(nextHourly, goal);
    const logged = Math.min(sumWaterHourlyMl(trimmed), goal);
    setHourlyMl(trimmed);
    setLoggedMl(logged);
    setGoalMlState(goal);
    persist(snapshotFromState(logged, goal, trimmed));
  }, []);

  const setGoalMl = useCallback(
    (ml: number) => {
      commit(hourlyMl, ml);
    },
    [commit, hourlyMl],
  );

  const addMl = useCallback(
    (delta: number) => {
      if (delta === 0) return;
      const { hourlyMl: nextHourly, loggedMl: nextLogged } = applyWaterLogDeltaMl(
        hourlyMl,
        delta,
        goalMl,
      );
      setHourlyMl(nextHourly);
      setLoggedMl(nextLogged);
      persist(snapshotFromState(nextLogged, goalMl, nextHourly));
    },
    [goalMl, hourlyMl],
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
      homeDisplay: formatHomeWaterDisplay(loggedMl, goalMl),
      addMl,
      removeMl,
      setGoalMl,
    }),
    [ready, loggedMl, goalMl, remainingMl, hourlyMl, addMl, removeMl, setGoalMl],
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
