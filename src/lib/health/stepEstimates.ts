/** Rough UX estimates until Health provides distance / active time. */
export function estimateDistanceKmFromSteps(steps: number): number {
  return Math.round(steps * 0.000762 * 10) / 10;
}

export function estimateActiveMinutesFromSteps(steps: number): number {
  return Math.max(0, Math.round(steps / 100));
}

/** Rough flights from steps until Health exposes flights climbed (~16 steps / floor). */
export function estimateFloorsFromSteps(steps: number): number {
  return Math.max(0, Math.floor(steps / 16));
}
