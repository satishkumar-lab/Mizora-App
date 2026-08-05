/** Sync read model for streak math — updated by StepsProvider after each refresh. */
let historyByDate: Record<string, number> = {};
let todayStepsLive = 0;

export function getStepsHistory(): Record<string, number> {
  return historyByDate;
}

export function getTodayStepsLive(): number {
  return todayStepsLive;
}

export function setStepsLiveState(todaySteps: number, history: Record<string, number>): void {
  todayStepsLive = todaySteps;
  historyByDate = { ...history };
}
