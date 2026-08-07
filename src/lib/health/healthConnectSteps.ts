import { Platform } from 'react-native';
import {
  SdkAvailabilityStatus,
  aggregateRecord,
  getGrantedPermissions,
  getSdkStatus,
  initialize,
  requestPermission,
} from 'react-native-health-connect';

import { HOURLY_STEP_SLOTS } from '@/constants/hourlySteps';
import { localDayRange } from '@/lib/health/readTodaySteps';
import type { ReadHourlyStepsResult } from '@/lib/health/readHourlyStepsToday';
import type { StepsReadFailure, StepsReadResult } from '@/lib/health/readTodaySteps';

const STEPS_READ_PERMISSION = { accessType: 'read' as const, recordType: 'Steps' as const };

let initPromise: Promise<'ready' | StepsReadFailure> | null = null;

function isAndroid(): boolean {
  return Platform.OS === 'android';
}

async function ensureHealthConnectReady(
  options: {
    requestPermission?: boolean;
  } = {},
): Promise<{ ok: true } | { ok: false; reason: StepsReadFailure }> {
  if (!isAndroid()) {
    return { ok: false, reason: 'unavailable' };
  }

  const shouldRequestPermission = options.requestPermission ?? false;

  if (shouldRequestPermission) {
    initPromise = null;
  }

  if (!initPromise) {
    initPromise = (async (): Promise<'ready' | StepsReadFailure> => {
      const status = await getSdkStatus();
      if (status !== SdkAvailabilityStatus.SDK_AVAILABLE) {
        return 'unavailable';
      }

      const initialized = await initialize();
      if (!initialized) {
        return 'unavailable';
      }

      const granted = await getGrantedPermissions();
      const hasSteps = granted.some(
        (p) => 'recordType' in p && p.recordType === 'Steps' && p.accessType === 'read',
      );
      if (hasSteps) {
        return 'ready';
      }

      if (!shouldRequestPermission) {
        return 'pending';
      }

      const requested = await requestPermission([STEPS_READ_PERMISSION]);
      const allowed = requested.some(
        (p) => 'recordType' in p && p.recordType === 'Steps' && p.accessType === 'read',
      );
      return allowed ? 'ready' : 'denied';
    })().then((result) => {
      if (result !== 'ready') {
        initPromise = null;
      }
      return result;
    });
  }

  const result = await initPromise;
  if (result === 'ready') {
    return { ok: true };
  }
  return { ok: false, reason: result };
}

/** Reset cached init (tests / permission revoke flows). */
export function resetHealthConnectInitCache(): void {
  initPromise = null;
}

export async function aggregateStepsBetween(start: Date, end: Date): Promise<number> {
  if (end.getTime() <= start.getTime()) {
    return 0;
  }

  const result = await aggregateRecord({
    recordType: 'Steps',
    timeRangeFilter: {
      operator: 'between',
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    },
  });

  return Math.max(0, Math.round(result.COUNT_TOTAL ?? 0));
}

export async function readTodayStepsFromHealthConnect(
  now = new Date(),
  options: { requestPermission?: boolean } = {},
): Promise<StepsReadResult> {
  const ready = await ensureHealthConnectReady(options);
  if (!ready.ok) {
    return { ok: false, reason: ready.reason };
  }

  try {
    const { start, end } = localDayRange(now);
    const steps = await aggregateStepsBetween(start, end);
    return { ok: true, steps };
  } catch {
    return { ok: false, reason: 'error' };
  }
}

export async function readHourlyStepsTodayFromHealthConnect(
  now = new Date(),
): Promise<ReadHourlyStepsResult> {
  const ready = await ensureHealthConnectReady();
  if (!ready.ok) {
    const reason =
      ready.reason === 'denied' || ready.reason === 'pending' ? 'unavailable' : ready.reason;
    return { ok: false, reason };
  }

  const { start: dayStart } = localDayRange(now);
  const nowMs = now.getTime();

  try {
    const buckets = await Promise.all(
      HOURLY_STEP_SLOTS.map(async (_slot, hour) => {
        const hourStart = new Date(dayStart);
        hourStart.setHours(hour, 0, 0, 0);
        if (hourStart.getTime() >= nowMs) {
          return 0;
        }
        const hourEnd = new Date(dayStart);
        hourEnd.setHours(hour + 1, 0, 0, 0);
        const end = new Date(Math.min(hourEnd.getTime(), nowMs));
        return aggregateStepsBetween(hourStart, end);
      }),
    );
    return { ok: true, buckets };
  } catch {
    return { ok: false, reason: 'error' };
  }
}
