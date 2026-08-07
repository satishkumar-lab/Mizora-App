import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';

import { HOURLY_STEP_SLOTS } from '@/constants/hourlySteps';
import { readHourlyStepsTodayFromHealthConnect } from '@/lib/health/healthConnectSteps';
import { localDayRange } from '@/lib/health/readTodaySteps';

export type ReadHourlyStepsResult =
  { ok: true; buckets: number[] } | { ok: false; reason: 'unavailable' | 'error' };

/**
 * Authoritative per-hour steps for the local calendar day via Core Motion.
 * One query per hour that has started (future hours return 0 without querying).
 */
export async function readHourlyStepsToday(now = new Date()): Promise<ReadHourlyStepsResult> {
  if (Platform.OS === 'android') {
    return readHourlyStepsTodayFromHealthConnect(now);
  }

  const available = await Pedometer.isAvailableAsync();
  if (!available) {
    return { ok: false, reason: 'unavailable' };
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
        if (end.getTime() <= hourStart.getTime()) {
          return 0;
        }
        const result = await Pedometer.getStepCountAsync(hourStart, end);
        return Math.max(0, Math.round(result?.steps ?? 0));
      }),
    );
    return { ok: true, buckets };
  } catch {
    return { ok: false, reason: 'error' };
  }
}
