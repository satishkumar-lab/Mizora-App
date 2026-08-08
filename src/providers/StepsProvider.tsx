import { useFocusEffect } from 'expo-router';
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
import { Platform } from 'react-native';

import {
  buildStepsWeek,
  createStepsTodaySnapshot,
  type StepsTodaySnapshot,
} from '@/constants/stepsToday';
import { HOURLY_STEP_SLOTS, type HourlyStepSlot } from '@/constants/hourlySteps';
import { localDateKey, localTodayDateKey } from '@/lib/localDate';
import {
  estimateActiveMinutesFromSteps,
  estimateDistanceKmFromSteps,
} from '@/lib/health/stepEstimates';
import { readTodayStepCount, type StepsTrackingStatus } from '@/lib/health/readTodaySteps';
import { upsertTodayHourlyBuckets } from '@/lib/health/steps-hourly-history-storage';
import { loadStepsHistory, upsertTodaySteps } from '@/lib/steps-history-storage';
import { setStepsLiveState } from '@/lib/steps-live-store';
import {
  getDailyStepGoal,
  migrateLegacyStepGoalIfNeeded,
  DEFAULT_DAILY_STEP_GOAL,
} from '@/lib/steps-preferences';
import { resetHealthConnectInitCache } from '@/lib/health/healthConnectSteps';
import {
  setRequestStepPermissionOnNextSync,
  consumeRequestStepPermissionOnNextSync,
} from '@/lib/health/stepPermissionRequestGate';

export type { StepsTrackingStatus } from '@/lib/health/readTodaySteps';

type StepsContextValue = {
  snapshot: StepsTodaySnapshot;
  todaySteps: number;
  hourlySlots: HourlyStepSlot[];
  goal: number;
  status: StepsTrackingStatus;
  refresh: () => Promise<void>;
  retryTracking: () => Promise<void>;
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

function mergeStoredHistoryWithLiveToday(
  storedHistory: Record<string, number>,
  liveToday: number,
): Record<string, number> {
  const todayKey = localTodayDateKey();
  if (liveToday <= (storedHistory[todayKey] ?? 0)) {
    return storedHistory;
  }
  return { ...storedHistory, [todayKey]: liveToday };
}

function buildSnapshot(
  todaySteps: number,
  goal: number,
  history: Record<string, number>,
  hourlySlots: HourlyStepSlot[],
): StepsTodaySnapshot {
  const yesterdaySteps = history[yesterdayDateKey()] ?? 0;
  const base = createStepsTodaySnapshot(todaySteps, goal);
  return {
    ...base,
    week: buildStepsWeek(todaySteps, history),
    vsYesterday: todaySteps - yesterdaySteps,
    distanceKm: estimateDistanceKmFromSteps(todaySteps),
    activeMinutes: estimateActiveMinutesFromSteps(todaySteps),
    hourlySlots,
  };
}

const LIVE_TRACKING_PLATFORMS = new Set<string>(['ios', 'android']);

export function StepsProvider({ children }: { children: ReactNode }) {
  const [goal, setGoal] = useState(DEFAULT_DAILY_STEP_GOAL);
  const [todaySteps, setTodaySteps] = useState(0);
  const [hourlySlots, setHourlySlots] = useState<HourlyStepSlot[]>(() =>
    HOURLY_STEP_SLOTS.map((s) => ({ ...s })),
  );
  const [history, setHistory] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<StepsTrackingStatus>('loading');
  const historyRef = useRef(history);
  const todayStepsRef = useRef(todaySteps);
  const liveSyncRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    historyRef.current = history;
    todayStepsRef.current = todaySteps;
  }, [history, todaySteps]);

  const applyLive = useCallback(
    (steps: number, mergedHistory: Record<string, number>, nextStatus: StepsTrackingStatus) => {
      todayStepsRef.current = steps;
      historyRef.current = mergedHistory;
      setTodaySteps(steps);
      setHistory(mergedHistory);
      setStatus(nextStatus);
      setStepsLiveState(steps, mergedHistory);
    },
    [],
  );

  const applyLiveRef = useRef(applyLive);

  useEffect(() => {
    applyLiveRef.current = applyLive;
  }, [applyLive]);

  const loadMetadata = useCallback(async () => {
    await migrateLegacyStepGoalIfNeeded();
    const [goalValue, storedHistory] = await Promise.all([getDailyStepGoal(), loadStepsHistory()]);
    setGoal(goalValue);
    const mergedHistory = mergeStoredHistoryWithLiveToday(storedHistory, todayStepsRef.current);
    historyRef.current = mergedHistory;
    setHistory(mergedHistory);
    setStepsLiveState(todayStepsRef.current, mergedHistory);
  }, []);

  const refresh = useCallback(async () => {
    await migrateLegacyStepGoalIfNeeded();
    const [goalValue, storedHistory] = await Promise.all([getDailyStepGoal(), loadStepsHistory()]);
    setGoal(goalValue);

    if (LIVE_TRACKING_PLATFORMS.has(Platform.OS)) {
      const mergedHistory = mergeStoredHistoryWithLiveToday(storedHistory, todayStepsRef.current);
      historyRef.current = mergedHistory;
      setHistory(mergedHistory);
      await liveSyncRef.current?.();
      return;
    }

    const read = await readTodayStepCount(undefined, {
      requestPermission: consumeRequestStepPermissionOnNextSync(),
    });
    if (!read.ok) {
      const todayKey = localTodayDateKey();
      const fallback = storedHistory[todayKey] ?? 0;
      applyLive(fallback, storedHistory, read.reason);
      return;
    }

    const merged = await upsertTodaySteps(read.steps);
    applyLive(read.steps, merged, 'ready');
  }, [applyLive]);

  const retryTracking = useCallback(async () => {
    if (Platform.OS === 'android') {
      resetHealthConnectInitCache();
    }
    setRequestStepPermissionOnNextSync(true);
    setStatus('loading');
    await refresh();
  }, [refresh]);

  useEffect(() => {
    if (!LIVE_TRACKING_PLATFORMS.has(Platform.OS)) {
      return;
    }

    const liveOptions = {
      onSteps: (steps: number) => {
        todayStepsRef.current = steps;
        setTodaySteps(steps);
        setStepsLiveState(steps, historyRef.current);
      },
      onHourlySlots: (slots: HourlyStepSlot[]) => {
        setHourlySlots(slots);
      },
      onStatus: (nextStatus: StepsTrackingStatus) => {
        setStatus(nextStatus);
        if (nextStatus !== 'ready' && nextStatus !== 'loading') {
          void loadStepsHistory().then((storedHistory) => {
            const fallback = storedHistory[localTodayDateKey()] ?? 0;
            applyLiveRef.current(fallback, storedHistory, nextStatus);
          });
        }
      },
      persistSteps: upsertTodaySteps,
      onHistoryPersisted: (merged: Record<string, number>) => {
        historyRef.current = merged;
        setHistory(merged);
        setStepsLiveState(todayStepsRef.current, merged);
      },
    };

    let live: { stop: () => void; syncNow: () => Promise<void> };
    if (Platform.OS === 'ios') {
      // Lazy require: avoid loading Health Connect (Android-only) on iOS at module init.
      const { startIosLiveStepTracking } =
        require('@/lib/health/iosLiveStepTracking') as typeof import('@/lib/health/iosLiveStepTracking');
      live = startIosLiveStepTracking(liveOptions);
    } else if (Platform.OS === 'android') {
      const { startAndroidLiveStepTracking } =
        require('@/lib/health/androidLiveStepTracking') as typeof import('@/lib/health/androidLiveStepTracking');
      live = startAndroidLiveStepTracking(liveOptions);
    } else {
      return;
    }

    liveSyncRef.current = live.syncNow;
    void Promise.all([
      migrateLegacyStepGoalIfNeeded(),
      getDailyStepGoal(),
      loadStepsHistory(),
    ]).then(([, goalValue, storedHistory]) => {
      setGoal(goalValue);
      const mergedHistory = mergeStoredHistoryWithLiveToday(storedHistory, todayStepsRef.current);
      historyRef.current = mergedHistory;
      setHistory(mergedHistory);
      setStepsLiveState(todayStepsRef.current, mergedHistory);
    });

    return () => {
      liveSyncRef.current = null;
      live.stop();
    };
    // Mount once: StepsProvider wraps (main) and does not remount on stack navigation.
  }, []);

  useEffect(() => {
    if (LIVE_TRACKING_PLATFORMS.has(Platform.OS)) {
      return;
    }
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
    if (status !== 'ready') return;
    const buckets = hourlySlots.map((slot) => Math.max(0, Math.round(slot.steps)));
    void upsertTodayHourlyBuckets(buckets);
  }, [hourlySlots, status]);

  useFocusEffect(
    useCallback(() => {
      if (LIVE_TRACKING_PLATFORMS.has(Platform.OS)) {
        void loadMetadata();
        void liveSyncRef.current?.();
        return;
      }
      void refresh();
    }, [loadMetadata, refresh]),
  );

  const snapshot = useMemo(
    () => buildSnapshot(todaySteps, goal, history, hourlySlots),
    [todaySteps, goal, history, hourlySlots],
  );

  const value = useMemo(
    () => ({
      snapshot,
      todaySteps,
      hourlySlots,
      goal,
      status,
      refresh,
      retryTracking,
    }),
    [snapshot, todaySteps, hourlySlots, goal, status, refresh, retryTracking],
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
