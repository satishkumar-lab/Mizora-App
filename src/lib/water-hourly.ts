export const WATER_HOUR_COUNT = 24;

export function emptyWaterHourlyMl(): number[] {
  return Array.from({ length: WATER_HOUR_COUNT }, () => 0);
}

export function sumWaterHourlyMl(hourly: readonly number[]): number {
  return hourly.reduce((sum, ml) => sum + (ml > 0 ? ml : 0), 0);
}

export function normalizeWaterHourlyMl(raw: unknown): number[] {
  if (!Array.isArray(raw) || raw.length !== WATER_HOUR_COUNT) {
    return emptyWaterHourlyMl();
  }
  return raw.map((value) =>
    typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : 0,
  );
}

/** Trim buckets from the end of the day when total exceeds max. */
export function trimWaterHourlyToMax(hourly: readonly number[], maxTotalMl: number): number[] {
  const next = normalizeWaterHourlyMl(hourly);
  let excess = sumWaterHourlyMl(next) - Math.max(0, maxTotalMl);
  if (excess <= 0) {
    return next;
  }
  for (let hour = WATER_HOUR_COUNT - 1; hour >= 0 && excess > 0; hour -= 1) {
    const take = Math.min(next[hour], excess);
    next[hour] -= take;
    excess -= take;
  }
  return next;
}

function currentLocalHour(): number {
  return new Date().getHours();
}

function subtractMlFromHourly(hourly: readonly number[], amountMl: number): number[] {
  let remaining = Math.max(0, amountMl);
  if (remaining === 0) {
    return normalizeWaterHourlyMl(hourly);
  }

  const next = normalizeWaterHourlyMl(hourly);
  const startHour = currentLocalHour();

  for (let hour = startHour; hour >= 0 && remaining > 0; hour -= 1) {
    const take = Math.min(next[hour], remaining);
    next[hour] -= take;
    remaining -= take;
  }
  for (let hour = WATER_HOUR_COUNT - 1; hour > startHour && remaining > 0; hour -= 1) {
    const take = Math.min(next[hour], remaining);
    next[hour] -= take;
    remaining -= take;
  }

  return next;
}

export function applyWaterLogDeltaMl(
  hourly: readonly number[],
  deltaMl: number,
  goalMl: number,
): { hourlyMl: number[]; loggedMl: number } {
  const goal = Math.max(0, goalMl);
  let next = normalizeWaterHourlyMl(hourly);

  if (deltaMl > 0) {
    const hour = currentLocalHour();
    next[hour] += deltaMl;
    next = trimWaterHourlyToMax(next, goal);
  } else if (deltaMl < 0) {
    next = subtractMlFromHourly(next, -deltaMl);
  }

  const loggedMl = Math.min(sumWaterHourlyMl(next), goal);
  return { hourlyMl: next, loggedMl };
}

/** One-time migration when only daily total was stored. */
export function migrateHourlyFromLoggedTotal(
  hourly: readonly number[],
  loggedMl: number,
): number[] {
  const normalized = normalizeWaterHourlyMl(hourly);
  if (loggedMl <= 0 || sumWaterHourlyMl(normalized) > 0) {
    return normalized;
  }
  const next = emptyWaterHourlyMl();
  next[currentLocalHour()] = loggedMl;
  return next;
}
