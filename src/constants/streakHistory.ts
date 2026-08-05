import { getLocalTodayParts } from '@/lib/localDate';

/** Persisted / Health-backed daily steps by ISO date — empty until tracking writes history. */
export const MOCK_STREAK_STEPS_BY_DATE: Record<string, number> = {};

export { getLocalTodayParts, localTodayDateKey } from '@/lib/localDate';

/** Real device calendar day (replaces fixed demo date). */
export function streakDisplayToday() {
  return getLocalTodayParts();
}
