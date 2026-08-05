import { useFocusEffect } from 'expo-router';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import {
  buildStepsWeek,
  createStepsTodaySnapshot,
  type StepsTodaySnapshot,
} from '@/constants/stepsToday';
import { localDateKey, localTodayDateKey } from '@/lib/localDate';
import {
  estimateActiveMinutesFromSteps,
  estimateDistanceKmFromSteps,
} from '@/lib/health/stepEstimates';
import { readTodayStepCount, type StepsReadFailure } from '@/lib/health/readTodaySteps';
import { loadStepsHistory, upsertTodaySteps } from '@/lib/steps-history-storage';
import { setStepsLiveState } from '@/lib/steps-live-store';
import { getDailyStepGoal } from '@/lib/steps-preferences';

export type StepsTrackingStatus = 'loading' | 'ready' | StepsReadFailure;

type StepsContextValue = {
  snapshot: StepsTodaySnapshot;
  todaySteps: number;
  goal: number;
  status: StepsTrackingStatus;
  refresh: () => Promise<void>;
};

const StepsContext = createContext<StepsContextValue | null>(null);

function yesterdayDateKey(from = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() - 1);
  return localDateKey({
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
  });
}

function buildSnapshot(
  todaySteps: number,
  goal: number,
  history: Record<string, number>,
): StepsTodaySnapshot {
  const yesterdaySteps = history[yesterdayDateKey()] ?? 0;
  const base = createStepsTodaySnapshot(todaySteps, goal);
  return {
    ...base,
    week: buildStepsWeek(todaySteps, history),
    vsYesterday: todaySteps - yesterdaySteps,
    distanceKm: estimateDistanceKmFromSteps(todaySteps),
    activeMinutes: estimateActiveMinutesFromSteps(todaySteps),
  };
}

export function StepsProvider({ children }: { children: ReactNode }) {
  const [goal, setGoal] = useState(10_000);
  const [todaySteps, setTodaySteps] = useState(0);
  const [history, setHistory] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<StepsTrackingStatus>('loading');

  const applyLive = useCallback(
    (steps: number, mergedHistory: Record<string, number>, nextStatus: StepsTrackingStatus) => {
      setTodaySteps(steps);
      setHistory(mergedHistory);
      setStatus(nextStatus);
      setStepsLiveState(steps, mergedHistory);
    },
    [],
  );

  const refresh = useCallback(async () => {
    const [goalValue, storedHistory] = await Promise.all([getDailyStepGoal(), loadStepsHistory()]);
    setGoal(goalValue);

    const read = await readTodayStepCount();
    if (!read.ok) {
      const todayKey = localTodayDateKey();
      const fallback = storedHistory[todayKey] ?? 0;
      applyLive(fallback, storedHistory, read.reason);
      return;
    }

    const merged = await upsertTodaySteps(read.steps);
    applyLive(read.steps, merged, 'ready');
  }, [applyLive]);

  useEffect(() => {
    let mounted = true;
    void Promise.resolve().then(() => {
      if (!mounted) return;
      return refresh();
    });
    return () => {
      mounted = false;
    };
  }, [refresh]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        void refresh();
      }
    });
    return () => sub.remove();
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const snapshot = useMemo(
    () => buildSnapshot(todaySteps, goal, history),
    [todaySteps, goal, history],
  );

  const value = useMemo(
    () => ({
      snapshot,
      todaySteps,
      goal,
      status,
      refresh,
    }),
    [snapshot, todaySteps, goal, status, refresh],
  );

  return <StepsContext.Provider value={value}>{children}</StepsContext.Provider>;
}

export function useSteps(): StepsContextValue {
  const ctx = useContext(StepsContext);
  if (!ctx) {
    throw new Error('useSteps must be used within StepsProvider');
  }
  return ctx;
}
