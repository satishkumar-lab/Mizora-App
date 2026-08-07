/** Native daily metrics (Phase 1). Null = unavailable — show "--", never estimate. */
export type DailyHealthMetrics = {
  distanceKm: number | null;
  /** Flights climbed (iOS) or floors climbed (Android), unified for UI. */
  floorsClimbed: number | null;
};

export const EMPTY_DAILY_HEALTH_METRICS: DailyHealthMetrics = {
  distanceKm: null,
  floorsClimbed: null,
};

export function formatMetricValue(
  value: number | null | undefined,
  format: (n: number) => string,
): string {
  if (value === null || value === undefined) {
    return '--';
  }
  return format(value);
}
