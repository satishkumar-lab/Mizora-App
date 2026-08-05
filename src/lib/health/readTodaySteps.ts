import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';

export type StepsReadFailure = 'unavailable' | 'denied' | 'error';

export type StepsReadResult = { ok: true; steps: number } | { ok: false; reason: StepsReadFailure };

/** Local calendar day bounds for step queries. */
export function localDayRange(now = new Date()): { start: Date; end: Date } {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  return { start, end };
}

export async function readTodayStepCount(now = new Date()): Promise<StepsReadResult> {
  const available = await Pedometer.isAvailableAsync();
  if (!available) {
    return { ok: false, reason: 'unavailable' };
  }

  const permission = await Pedometer.requestPermissionsAsync();
  if (permission.status !== 'granted') {
    return { ok: false, reason: 'denied' };
  }

  const { start, end } = localDayRange(now);

  try {
    const result = await Pedometer.getStepCountAsync(start, end);
    const steps = typeof result?.steps === 'number' ? result.steps : 0;
    return { ok: true, steps: Math.max(0, Math.round(steps)) };
  } catch {
    if (Platform.OS === 'android') {
      return { ok: false, reason: 'unavailable' };
    }
    return { ok: false, reason: 'error' };
  }
}
