import { useCallback, useEffect, useState } from 'react';

import {
  DEFAULT_DAILY_STEP_GOAL,
  DEFAULT_HEALTH_GOALS,
  getDailyStepGoal,
  loadHealthGoals,
  migrateLegacyStepGoalIfNeeded,
  saveHealthGoals,
  type HealthGoalsState,
} from '@/lib/steps-preferences';

/** Legacy API — prefer `useSteps().goal` inside the main app (StepsProvider). */
export function useDailyStepGoal() {
  const [goal, setGoalState] = useState(DEFAULT_DAILY_STEP_GOAL);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    await migrateLegacyStepGoalIfNeeded();
    const value = await getDailyStepGoal();
    setGoalState(value);
    setReady(true);
  }, []);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      await migrateLegacyStepGoalIfNeeded();
      const value = await getDailyStepGoal();
      if (mounted) {
        setGoalState(value);
        setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const saveGoal = useCallback(async (next: number) => {
    const current = await loadHealthGoals();
    await saveHealthGoals({ ...current, steps: next });
    setGoalState(await getDailyStepGoal());
  }, []);

  return { goal, ready, refresh, saveGoal };
}

export function useHealthGoals() {
  const [goals, setGoals] = useState<HealthGoalsState>(DEFAULT_HEALTH_GOALS);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    await migrateLegacyStepGoalIfNeeded();
    setGoals(await loadHealthGoals());
    setReady(true);
  }, []);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      await migrateLegacyStepGoalIfNeeded();
      const loaded = await loadHealthGoals();
      if (mounted) {
        setGoals(loaded);
        setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const persist = useCallback(async (next: HealthGoalsState) => {
    setGoals(next);
    await saveHealthGoals(next);
  }, []);

  return { goals, ready, refresh, persist };
}
