import { AppState, type AppStateStatus } from 'react-native';
import { getChanges } from 'react-native-health-connect';

import type { HourlyStepSlot } from '@/constants/hourlySteps';
import { localTodayDateKey } from '@/lib/localDate';
import {
  readHourlyStepsTodayFromHealthConnect,
  readTodayStepsFromHealthConnect,
} from '@/lib/health/healthConnectSteps';
import { consumeRequestStepPermissionOnNextSync } from '@/lib/health/stepPermissionRequestGate';
import {
  applyLiveDeltaToCurrentHour,
  emptyHourlyBuckets,
  hourlyBucketsSignature,
  hourlySlotsFromBuckets,
  reconcileHourlyBucketsToDailyTotal,
} from '@/lib/health/hourlyStepsModel';
import type { StepsTrackingStatus } from '@/lib/health/readTodaySteps';

const PERSIST_DEBOUNCE_MS = 3_000;
/** Debounce rapid Health Connect change bursts before re-aggregating. */
const LIVE_AGGREGATE_DEBOUNCE_MS = 400;
/**
 * Health Connect exposes no JS push listener. While foreground we poll the Changes API
 * (not today's aggregate) and only re-aggregate when step upserts/deletions arrive.
 */
const CHANGES_CHECK_MS = 2_500;

export type AndroidLiveStepTrackingOptions = {
  onSteps: (steps: number) => void;
  onHourlySlots: (slots: HourlyStepSlot[]) => void;
  onStatus: (status: StepsTrackingStatus) => void;
  persistSteps: (steps: number) => Promise<Record<string, number>>;
  onHistoryPersisted: (history: Record<string, number>) => void;
};

export function startAndroidLiveStepTracking(options: AndroidLiveStepTrackingOptions): {
  stop: () => void;
  syncNow: () => Promise<void>;
} {
  const { onSteps, onHourlySlots, onStatus, persistSteps, onHistoryPersisted } = options;

  let activeDateKey = localTodayDateKey();
  let lastEmittedSteps = -1;
  let hourlyBuckets: number[] = emptyHourlyBuckets();
  let lastHourlySignature = '';
  let syncGeneration = 0;
  let changesToken: string | undefined;
  let appStateSubscription: ReturnType<typeof AppState.addEventListener> | null = null;
  let persistTimer: ReturnType<typeof setTimeout> | null = null;
  let midnightTimer: ReturnType<typeof setTimeout> | null = null;
  let changesTimer: ReturnType<typeof setTimeout> | null = null;
  let liveAggregateTimer: ReturnType<typeof setTimeout> | null = null;
  let pendingPersistSteps: number | null = null;
  let persistInFlight: Promise<void> | null = null;
  let stopped = false;
  let foregroundSyncChain: Promise<void> = Promise.resolve();
  let changesLoopRunning = false;

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

  function clearChangesTimer(): void {
    if (changesTimer !== null) {
      clearTimeout(changesTimer);
      changesTimer = null;
    }
  }

  function clearLiveAggregateTimer(): void {
    if (liveAggregateTimer !== null) {
      clearTimeout(liveAggregateTimer);
      liveAggregateTimer = null;
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

  async function loadAuthoritativeHourly(dailyTotal: number, now: Date): Promise<void> {
    const hourlyRead = await readHourlyStepsTodayFromHealthConnect(now);
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
    lastEmittedSteps = -1;
    changesToken = undefined;

    const now = new Date();
    const requestPermission = consumeRequestStepPermissionOnNextSync();
    const read = await readTodayStepsFromHealthConnect(now, { requestPermission });
    if (stopped || generation !== syncGeneration) {
      return false;
    }

    if (!read.ok) {
      onStatus(read.reason);
      return false;
    }

    activeDateKey = localTodayDateKey();
    await loadAuthoritativeHourly(read.steps, now);
    if (stopped || generation !== syncGeneration) {
      return false;
    }

    onStatus('ready');
    emitSteps(read.steps);
    return true;
  }

  async function refreshLiveTotalFromHealthConnect(): Promise<void> {
    if (stopped) {
      return;
    }

    const todayKey = localTodayDateKey();
    if (todayKey !== activeDateKey) {
      void enqueueForegroundSync();
      return;
    }

    const read = await readTodayStepsFromHealthConnect();
    if (stopped || !read.ok) {
      return;
    }

    const previous = lastEmittedSteps >= 0 ? lastEmittedSteps : read.steps;
    const delta = read.steps - previous;
    emitSteps(read.steps, { liveDelta: delta });
  }

  function scheduleLiveAggregateFromChanges(): void {
    if (stopped || liveAggregateTimer !== null) {
      return;
    }
    liveAggregateTimer = setTimeout(() => {
      liveAggregateTimer = null;
      void refreshLiveTotalFromHealthConnect();
    }, LIVE_AGGREGATE_DEBOUNCE_MS);
  }

  async function pollChangesOnce(): Promise<void> {
    if (stopped || AppState.currentState !== 'active') {
      return;
    }

    try {
      let hasStepChanges = false;
      let hasMore = true;

      while (hasMore && !stopped && AppState.currentState === 'active') {
        const response = await getChanges({
          changesToken,
          recordTypes: ['Steps'],
        });

        if (response.changesTokenExpired) {
          changesToken = undefined;
          void enqueueForegroundSync();
          return;
        }

        changesToken = response.nextChangesToken;
        if (response.upsertionChanges.length > 0 || response.deletionChanges.length > 0) {
          hasStepChanges = true;
        }
        hasMore = response.hasMore;
      }

      if (hasStepChanges) {
        scheduleLiveAggregateFromChanges();
      }
    } catch {
      // Ignore transient HC errors; next foreground sync or poll will recover.
    }
  }

  function scheduleChangesPoll(): void {
    clearChangesTimer();
    if (stopped || AppState.currentState !== 'active') {
      return;
    }
    changesTimer = setTimeout(() => {
      changesTimer = null;
      void runChangesLoop();
    }, CHANGES_CHECK_MS);
  }

  async function runChangesLoop(): Promise<void> {
    if (stopped || AppState.currentState !== 'active' || changesLoopRunning) {
      return;
    }
    changesLoopRunning = true;
    try {
      await pollChangesOnce();
    } finally {
      changesLoopRunning = false;
      if (!stopped && AppState.currentState === 'active') {
        scheduleChangesPoll();
      }
    }
  }

  function startChangesWatcherIfForeground(): void {
    if (stopped || AppState.currentState !== 'active') {
      return;
    }
    void runChangesLoop();
  }

  function stopChangesWatcher(): void {
    clearChangesTimer();
    clearLiveAggregateTimer();
    changesLoopRunning = false;
  }

  async function runForegroundSync(): Promise<void> {
    if (stopped) {
      return;
    }
    stopChangesWatcher();
    const ok = await establishBaseline();
    if (stopped) {
      return;
    }
    if (ok) {
      startChangesWatcherIfForeground();
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
    stopChangesWatcher();
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
      stopChangesWatcher();
      void flushPersist();
      appStateSubscription?.remove();
      appStateSubscription = null;
      clearPersistTimer();
    },
    syncNow: enqueueForegroundSync,
  };
}
