/** Distance estimate from steps until native walking/running distance is wired everywhere. */
export function estimateDistanceKmFromSteps(steps: number): number {
  return Math.round(steps * 0.000762 * 10) / 10;
}

/** Estimated active minutes from steps until native health data is implemented. */
export function estimateActiveMinutesFromSteps(steps: number): number {
  return Math.max(0, Math.round(steps / 100));
}
