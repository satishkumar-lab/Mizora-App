/** One calendar day, 12 AM → 11 PM (24 hours) — mock until Health API */
export const HOURLY_STEP_SLOTS = [
  { label: '12 AM', hour: 0, steps: 0 },
  { label: '1 AM', hour: 1, steps: 0 },
  { label: '2 AM', hour: 2, steps: 0 },
  { label: '3 AM', hour: 3, steps: 0 },
  { label: '4 AM', hour: 4, steps: 0 },
  { label: '5 AM', hour: 5, steps: 12 },
  { label: '6 AM', hour: 6, steps: 210 },
  { label: '7 AM', hour: 7, steps: 380 },
  { label: '8 AM', hour: 8, steps: 520 },
  { label: '9 AM', hour: 9, steps: 290 },
  { label: '10 AM', hour: 10, steps: 410 },
  { label: '11 AM', hour: 11, steps: 180 },
  { label: '12 PM', hour: 12, steps: 640 },
  { label: '1 PM', hour: 13, steps: 320 },
  { label: '2 PM', hour: 14, steps: 145 },
  { label: '3 PM', hour: 15, steps: 90 },
  { label: '4 PM', hour: 16, steps: 260 },
  { label: '5 PM', hour: 17, steps: 400 },
  { label: '6 PM', hour: 18, steps: 350 },
  { label: '7 PM', hour: 19, steps: 120 },
  { label: '8 PM', hour: 20, steps: 80 },
  { label: '9 PM', hour: 21, steps: 45 },
  { label: '10 PM', hour: 22, steps: 5 },
  { label: '11 PM', hour: 23, steps: 8 },
] as const;

export type HourlyStepSlot = (typeof HOURLY_STEP_SLOTS)[number];

/** Index for the device’s current hour (0–23). */
export function indexForCurrentHour(
  slots: readonly Pick<HourlyStepSlot, 'hour'>[] = HOURLY_STEP_SLOTS,
): number {
  const now = new Date().getHours();
  const idx = slots.findIndex((s) => s.hour === now);
  return idx >= 0 ? idx : now;
}

/** X-axis ticks for a full day (matches 24 slots, left → right). */
export const FULL_DAY_AXIS_LABELS = ['12 AM', '6 AM', '12 PM', '6 PM', '11 PM'] as const;

/** Narrow card — start, midday, end only */
export const NARROW_DAY_AXIS_LABELS = ['12 AM', '12 PM', '11 PM'] as const;

export type HourlyChartAxisMode = 'full' | 'narrow';
