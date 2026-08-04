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

type WaterIntakeContextValue = {
  ready: boolean;
  loggedMl: number;
  goalMl: number;
  remainingMl: number;
  homeDisplay: { value: string; unit: 'L' };
  addMl: (delta: number) => void;
  removeMl: (amount: number) => void;
  setGoalMl: (ml: number) => void;
};

const WaterIntakeContext = createContext<WaterIntakeContextValue | null>(null);

function persist(snapshot: WaterIntakeSnapshot) {
  void saveWaterIntakeSnapshot(snapshot);
}

export function WaterIntakeProvider({ children }: PropsWithChildren) {
  const seed = defaultWaterIntakeSnapshot();
  const [ready, setReady] = useState(false);
  const [loggedMl, setLoggedMl] = useState(seed.loggedMl);
  const [goalMl, setGoalMlState] = useState(seed.goalMl);

  useEffect(() => {
    let mounted = true;
    loadWaterIntakeSnapshot()
      .then((loaded) => {
        if (!mounted) return;
        setLoggedMl(loaded.loggedMl);
        setGoalMlState(loaded.goalMl);
        setReady(true);
      })
      .catch(() => {
        if (mounted) setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const applyLogged = useCallback(
    (nextLogged: number, nextGoal = goalMl) => {
      const goal = clampWaterGoalMl(nextGoal);
      const logged = Math.min(Math.max(0, nextLogged), goal);
      setLoggedMl(logged);
      setGoalMlState(goal);
      persist({
        dateKey: activeWaterDateKey(),
        loggedMl: logged,
        goalMl: goal,
      });
    },
    [goalMl],
  );

  const setGoalMl = useCallback(
    (ml: number) => {
      const goal = clampWaterGoalMl(ml);
      applyLogged(Math.min(loggedMl, goal), goal);
    },
    [applyLogged, loggedMl],
  );

  const addMl = useCallback(
    (delta: number) => {
      applyLogged(loggedMl + delta);
    },
    [applyLogged, loggedMl],
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
      homeDisplay: formatHomeWaterDisplay(loggedMl, goalMl),
      addMl,
      removeMl,
      setGoalMl,
    }),
    [ready, loggedMl, goalMl, remainingMl, addMl, removeMl, setGoalMl],
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
