import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mizora/health_goals_v1';

export const DEFAULT_DAILY_STEP_GOAL = 10_000;
export const STEP_GOAL_STEP = 1_000;

export type OptionalGoal = {
  enabled: boolean;
  value: number;
};

export type HealthGoalsState = {
  steps: number;
  calories: OptionalGoal;
  distanceKm: OptionalGoal;
  activeMinutes: OptionalGoal;
  floors: OptionalGoal;
};

export const DEFAULT_HEALTH_GOALS: HealthGoalsState = {
  steps: DEFAULT_DAILY_STEP_GOAL,
  calories: { enabled: false, value: 500 },
  distanceKm: { enabled: false, value: 5 },
  activeMinutes: { enabled: false, value: 30 },
  floors: { enabled: false, value: 10 },
};

function clampSteps(n: number): number {
  return Math.min(Math.max(Math.round(n), STEP_GOAL_STEP), 100_000);
}

function parseStored(raw: string | null): HealthGoalsState {
  if (!raw) return { ...DEFAULT_HEALTH_GOALS };
  try {
    const data = JSON.parse(raw) as Partial<HealthGoalsState>;
    return {
      steps: clampSteps(data.steps ?? DEFAULT_DAILY_STEP_GOAL),
      calories: {
        enabled: Boolean(data.calories?.enabled),
        value: Math.max(0, Math.round(data.calories?.value ?? DEFAULT_HEALTH_GOALS.calories.value)),
      },
      distanceKm: {
        enabled: Boolean(data.distanceKm?.enabled),
        value: Math.max(0, Number(data.distanceKm?.value ?? DEFAULT_HEALTH_GOALS.distanceKm.value)),
      },
      activeMinutes: {
        enabled: Boolean(data.activeMinutes?.enabled),
        value: Math.max(
          0,
          Math.round(data.activeMinutes?.value ?? DEFAULT_HEALTH_GOALS.activeMinutes.value),
        ),
      },
      floors: {
        enabled: Boolean(data.floors?.enabled),
        value: Math.max(0, Math.round(data.floors?.value ?? DEFAULT_HEALTH_GOALS.floors.value)),
      },
    };
  } catch {
    return { ...DEFAULT_HEALTH_GOALS };
  }
}

export async function loadHealthGoals(): Promise<HealthGoalsState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return parseStored(raw);
}

export async function saveHealthGoals(state: HealthGoalsState): Promise<void> {
  const payload: HealthGoalsState = {
    ...state,
    steps: clampSteps(state.steps),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

/** Legacy API — steps ring & home card */
export async function getDailyStepGoal(): Promise<number> {
  return (await loadHealthGoals()).steps;
}

export async function setDailyStepGoal(goal: number): Promise<void> {
  const current = await loadHealthGoals();
  await saveHealthGoals({ ...current, steps: clampSteps(goal) });
}

/** Migrate old single-key storage */
export async function migrateLegacyStepGoalIfNeeded(): Promise<void> {
  const legacy = await AsyncStorage.getItem('@mizora/daily_step_goal');
  if (!legacy) return;
  const existing = await AsyncStorage.getItem(STORAGE_KEY);
  if (existing) {
    await AsyncStorage.removeItem('@mizora/daily_step_goal');
    return;
  }
  const n = Number.parseInt(legacy, 10);
  if (Number.isFinite(n) && n > 0) {
    await saveHealthGoals({ ...DEFAULT_HEALTH_GOALS, steps: clampSteps(n) });
  }
  await AsyncStorage.removeItem('@mizora/daily_step_goal');
}
