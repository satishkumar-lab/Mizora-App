import { Pedometer } from 'expo-sensors';
import type { EventSubscription } from 'expo-modules-core';
import { AppState, type AppStateStatus } from 'react-native';

import type { HourlyStepSlot } from '@/constants/hourlySteps';
import { localTodayDateKey } from '@/lib/localDate';
import {
  applyLiveDeltaToCurrentHour,
  emptyHourlyBuckets,
  hourlyBucketsSignature,
  hourlySlotsFromBuckets,
  reconcileHourlyBucketsToDailyTotal,
} from '@/lib/health/hourlyStepsModel';
import { readHourlyStepsToday } from '@/lib/health/readHourlyStepsToday';
import { readTodayStepCount, type StepsTrackingStatus } from '@/lib/health/readTodaySteps';

const PERSIST_DEBOUNCE_MS = 3_000;

export type IosLiveStepTrackingOptions = {
  onSteps: (steps: number) => void;
  onHourlySlots: (slots: HourlyStepSlot[]) => void;
  onStatus: (status: StepsTrackingStatus) => void;
  persistSteps: (steps: number) => Promise<Record<string, number>>;
  onHistoryPersisted: (history: Record<string, number>) => void;
};

/**
 * iOS live steps + hybrid hourly chart:
 * - Baseline (launch, foreground, manual sync, midnight): daily total + 24 Core Motion hour queries.
 * - Foreground live: watchStepCount updates daily total; only the current hour bucket moves by delta.
 */
export function startIosLiveStepTracking(options: IosLiveStepTrackingOptions): {
  stop: () => void;
  syncNow: () => Promise<void>;
} {
  const { onSteps, onHourlySlots, onStatus, persistSteps, onHistoryPersisted } = options;

  let baselineTotal = 0;
  let activeDateKey = localTodayDateKey();
  let lastEmittedSteps = -1;
  let hourlyBuckets: number[] = emptyHourlyBuckets();
  let lastHourlySignature = '';
  let syncGeneration = 0;
  let watchSubscription: EventSubscription | null = null;
  let appStateSubscription: ReturnType<typeof AppState.addEventListener> | null = null;
  let persistTimer: ReturnType<typeof setTimeout> | null = null;
  let midnightTimer: ReturnType<typeof setTimeout> | null = null;
  let pendingPersistSteps: number | null = null;
  let persistInFlight: Promise<void> | null = null;
  let stopped = false;
  let foregroundSyncChain: Promise<void> = Promise.resolve();

  function clearPersistTimer(): void {
    if (persistTimer !== null) {
      clearTimeout(persistTimer);
      persistTimer = null;
    }
  }

  function clearMidnightTimer(): void {
    if (midnightTimer !== null) {
      clearTimeout(midnightTimer);
      midnightTimer = null;
    }
  }

  function scheduleMidnightResync(): void {
    clearMidnightTimer();
    if (stopped) {
      return;
    }

    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setDate(nextMidnight.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);
    const delayMs = Math.max(0, nextMidnight.getTime() - now.getTime());

    midnightTimer = setTimeout(() => {
      midnightTimer = null;
      if (stopped) {
        return;
      }
      void enqueueForegroundSync();
    }, delayMs);
  }

  async function flushPersist(): Promise<void> {
    clearPersistTimer();
    const steps = pendingPersistSteps;
    pendingPersistSteps = null;
    if (steps === null) {
      if (persistInFlight) {
        await persistInFlight;
      }
      return;
    }

    const run = async () => {
      const merged = await persistSteps(steps);
      if (stopped) {
        return;
      }
      onHistoryPersisted(merged);
    };
    persistInFlight = run();
    try {
      await persistInFlight;
    } finally {
      persistInFlight = null;
    }
  }

  function schedulePersist(steps: number): void {
    if (stopped) {
      return;
    }
    pendingPersistSteps = steps;
    if (persistTimer !== null) {
      return;
    }
    persistTimer = setTimeout(() => {
      persistTimer = null;
      void flushPersist();
    }, PERSIST_DEBOUNCE_MS);
  }

  function stopWatch(): void {
    watchSubscription?.remove();
    watchSubscription = null;
  }

  function publishHourlyBuckets(buckets: readonly number[]): void {
    if (stopped) {
      return;
    }
    const signature = hourlyBucketsSignature(buckets);
    if (signature === lastHourlySignature) {
      return;
    }
    lastHourlySignature = signature;
    hourlyBuckets = [...buckets];
    onHourlySlots(hourlySlotsFromBuckets(hourlyBuckets));
  }

  function emitSteps(steps: number, options?: { liveDelta?: number }): void {
    if (stopped) {
      return;
    }
    const normalized = Math.max(0, Math.round(steps));
    const previous = lastEmittedSteps;
    if (normalized === previous) {
      return;
    }

    if (options?.liveDelta !== undefined && previous >= 0) {
      const hour = new Date().getHours();
      const nextBuckets = applyLiveDeltaToCurrentHour(hourlyBuckets, options.liveDelta, hour);
      if (nextBuckets) {
        publishHourlyBuckets(nextBuckets);
      }
    }

    lastEmittedSteps = normalized;
    onSteps(normalized);
    schedulePersist(normalized);
  }

  function handleWatchUpdate(result: { steps: number }): void {
    if (stopped) {
      return;
    }

    const todayKey = localTodayDateKey();
    if (todayKey !== activeDateKey) {
      void enqueueForegroundSync();
      return;
    }

    const sinceWatchStart = Math.max(0, Math.round(result.steps));
    const nextTotal = baselineTotal + sinceWatchStart;
    const previous = lastEmittedSteps >= 0 ? lastEmittedSteps : baselineTotal;
    const delta = nextTotal - previous;
    emitSteps(nextTotal, { liveDelta: delta });
  }

  function startWatchIfForeground(): void {
    if (stopped || AppState.currentState !== 'active') {
      return;
    }
    stopWatch();
    watchSubscription = Pedometer.watchStepCount(handleWatchUpdate);
  }

  async function loadAuthoritativeHourly(dailyTotal: number, now: Date): Promise<void> {
    const hourlyRead = await readHourlyStepsToday(now);
    const currentHour = now.getHours();
    if (hourlyRead.ok) {
      const reconciled = reconcileHourlyBucketsToDailyTotal(
        hourlyRead.buckets,
        dailyTotal,
        currentHour,
      );
      publishHourlyBuckets(reconciled);
      return;
    }
    const fallback = reconcileHourlyBucketsToDailyTotal(
      emptyHourlyBuckets(),
      dailyTotal,
      currentHour,
    );
    publishHourlyBuckets(fallback);
  }

  async function establishBaseline(): Promise<boolean> {
    const generation = ++syncGeneration;
    stopWatch();
    lastEmittedSteps = -1;

    const now = new Date();
    const read = await readTodayStepCount(now);
    if (stopped || generation !== syncGeneration) {
      return false;
    }

    if (!read.ok) {
      onStatus(read.reason);
      return false;
    }

    baselineTotal = read.steps;
    activeDateKey = localTodayDateKey();
    await loadAuthoritativeHourly(read.steps, now);
    if (stopped || generation !== syncGeneration) {
      return false;
    }

    onStatus('ready');
    emitSteps(baselineTotal);
    return true;
  }

  async function runForegroundSync(): Promise<void> {
    if (stopped) {
      return;
    }
    const ok = await establishBaseline();
    if (stopped) {
      return;
    }
    if (ok) {
      startWatchIfForeground();
      scheduleMidnightResync();
    }
  }

  function enqueueForegroundSync(): Promise<void> {
    foregroundSyncChain = foregroundSyncChain
      .then(() => runForegroundSync())
      .catch(() => undefined);
    return foregroundSyncChain;
  }

  function onBackground(): void {
    void flushPersist();
    stopWatch();
  }

  function handleAppStateChange(next: AppStateStatus): void {
    if (next === 'active') {
      void enqueueForegroundSync();
    } else if (next === 'background') {
      onBackground();
    }
  }

  onStatus('loading');
  void enqueueForegroundSync();

  appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

  return {
    stop: () => {
      stopped = true;
      syncGeneration += 1;
      clearMidnightTimer();
      void flushPersist();
      stopWatch();
      appStateSubscription?.remove();
      appStateSubscription = null;
      clearPersistTimer();
    },
    syncNow: enqueueForegroundSync,
  };
}
