/** Mock daily steps by ISO date — replace with persisted history from Health. */
export const MOCK_STREAK_STEPS_BY_DATE: Record<string, number> = {
  '2026-06-26': 8100,
  '2026-06-27': 7600,
  '2026-06-28': 0,
  '2026-06-29': 7200,
  '2026-06-30': 8400,
  '2026-07-01': 7900,
  '2026-07-02': 8200,
  '2026-07-03': 7100,
  '2026-07-14': 7500,
  '2026-07-15': 8800,
  '2026-07-16': 9200,
  '2026-07-17': 8000,
  '2026-07-28': 8000,
  '2026-07-29': 7500,
  '2026-07-30': 8100,
  '2026-07-31': 7200,
  '2026-08-01': 7600,
  '2026-08-02': 8200,
  '2026-08-03': 7100,
  '2026-08-04': 8200,
  '2026-08-05': 12_500,
  '2026-08-06': 4200,
  '2026-08-07': 3245,
};

/** Demo “today” for streak screens (aligns with STEPS_TODAY week). */
export const STREAK_DISPLAY_TODAY = { year: 2026, month: 8, day: 7 } as const;
