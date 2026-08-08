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
import { ensureActivityRecognitionPermission } from '@/lib/health/androidActivityRecognitionPermission';
import { logAndroidHealthDebug } from '@/lib/health/androidHealthDebugLog';
import { localDayRange } from '@/lib/health/readTodaySteps';
import type { ReadHourlyStepsResult } from '@/lib/health/readHourlyStepsToday';
import type { StepsReadFailure, StepsReadResult } from '@/lib/health/readTodaySteps';

const STEPS_READ_PERMISSION = { accessType: 'read' as const, recordType: 'Steps' as const };

type InitResult = 'ready' | StepsReadFailure;

let initPromise: Promise<InitResult> | null = null;

function isAndroid(): boolean {
  return Platform.OS === 'android';
}

function mapSdkStatus(status: number): StepsReadFailure | null {
  if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
    return null;
  }
  if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
    return 'provider_update';
  }
  if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
    return 'provider_install';
  }
  return 'unavailable';
}

function hasStepsReadPermission(
  granted: readonly { recordType?: string; accessType?: string }[],
): boolean {
  return granted.some((p) => p.recordType === 'Steps' && p.accessType === 'read');
}

function logSdkStatus(status: number): void {
  if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
    logAndroidHealthDebug('HealthConnect_Available');
    return;
  }
  if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
    logAndroidHealthDebug('HealthConnect_UpdateRequired');
    return;
  }
  if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
    logAndroidHealthDebug('HealthConnect_NotInstalled');
    return;
  }
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
    initPromise = (async (): Promise<InitResult> => {
      const sdkStatus = await getSdkStatus();
      logSdkStatus(sdkStatus);
      const sdkIssue = mapSdkStatus(sdkStatus);
      if (sdkIssue) {
        return sdkIssue;
      }

      if (shouldRequestPermission) {
        const activity = await ensureActivityRecognitionPermission(true);
        if (activity === 'denied') {
          return 'denied';
        }
      }

      const initialized = await initialize();
      if (!initialized) {
        const afterInit = mapSdkStatus(await getSdkStatus());
        return afterInit ?? 'unavailable';
      }

      const granted = await getGrantedPermissions();
      if (hasStepsReadPermission(granted)) {
        logAndroidHealthDebug('ReadSteps_Granted');
        logAndroidHealthDebug('Provider_Ready');
        return 'ready';
      }

      if (!shouldRequestPermission) {
        return 'pending';
      }

      logAndroidHealthDebug('ReadSteps_Request');
      const requested = await requestPermission([STEPS_READ_PERMISSION]);
      const allowed = hasStepsReadPermission(requested);
      if (allowed) {
        logAndroidHealthDebug('ReadSteps_Granted');
        logAndroidHealthDebug('Provider_Ready');
      } else {
        logAndroidHealthDebug('ReadSteps_Denied');
      }
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

/** Reset cached init (tests / permission revoke / return from Play Store). */
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
    logAndroidHealthDebug('Aggregate_Success');
    return { ok: true, steps };
  } catch {
    logAndroidHealthDebug('Aggregate_Failed');
    return { ok: false, reason: 'error' };
  }
}

export async function readHourlyStepsTodayFromHealthConnect(
  now = new Date(),
): Promise<ReadHourlyStepsResult> {
  const ready = await ensureHealthConnectReady();
  if (!ready.ok) {
    return { ok: false, reason: 'unavailable' as const };
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

/** Probe SDK without permission prompts (dashboard gating). */
export async function probeHealthConnectTrackingState(): Promise<StepsReadFailure | 'ready'> {
  const ready = await ensureHealthConnectReady({ requestPermission: false });
  return ready.ok ? 'ready' : ready.reason;
}
