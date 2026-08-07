import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';

import { readTodayStepsFromHealthConnect } from '@/lib/health/healthConnectSteps';

export type StepsReadFailure = 'unavailable' | 'denied' | 'error' | 'pending';

export type StepsTrackingStatus = 'loading' | 'ready' | StepsReadFailure;

export type StepsReadResult = { ok: true; steps: number } | { ok: false; reason: StepsReadFailure };

export type ReadTodayStepsOptions = {
  /** When true, shows the system permission sheet if access is not granted yet. */
  requestPermission?: boolean;
};

/** Local calendar day bounds for step queries. */
export function localDayRange(now = new Date()): { start: Date; end: Date } {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  return { start, end };
}

export async function readTodayStepCount(
  now = new Date(),
  options: ReadTodayStepsOptions = {},
): Promise<StepsReadResult> {
  const requestPermission = options.requestPermission ?? false;

  if (Platform.OS === 'android') {
    return readTodayStepsFromHealthConnect(now, { requestPermission });
  }

  const available = await Pedometer.isAvailableAsync();
  if (!available) {
    return { ok: false, reason: 'unavailable' };
  }

  let permission = await Pedometer.getPermissionsAsync();
  if (permission.status === 'undetermined') {
    if (!requestPermission) {
      return { ok: false, reason: 'pending' };
    }
    permission = await Pedometer.requestPermissionsAsync();
  }

  if (permission.status !== 'granted') {
    return { ok: false, reason: 'denied' };
  }

  const { start, end } = localDayRange(now);

  try {
    const result = await Pedometer.getStepCountAsync(start, end);
    const steps = typeof result?.steps === 'number' ? result.steps : 0;
    return { ok: true, steps: Math.max(0, Math.round(steps)) };
  } catch {
    return { ok: false, reason: 'error' };
  }
}
