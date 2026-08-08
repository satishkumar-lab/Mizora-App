import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { AppBrandId } from '@/components/icons/AppBrandIcon';
import {
  buildHomeInsight,
  buildHomeInsightWithoutLiveSteps,
  buildLockSuggestions,
  type HomeInsightSegment,
  type LockSuggestion,
} from '@/lib/personalization/insights';
import { isStepsTrackingReady } from '@/lib/health/stepsTrackingUi';
import {
  averageStepsFromWeek,
  recommendStepUnlockGoal,
  recommendWaterUnlockGoalMl,
} from '@/lib/personalization/challengeGoals';
import {
  DEFAULT_PERSONALIZATION_PREFS,
  loadPersonalizationPrefs,
  savePersonalizationPrefs,
  type PersonalizationPrefs,
} from '@/lib/personalization/preferences-storage';
import { UNLOCK_REWARDS_V2_ENABLED } from '@/constants/productScope';
import { useSteps } from '@/providers/StepsProvider';
import { useUnlockRewards } from '@/providers/UnlockRewardsProvider';
import { useWaterIntake } from '@/providers/WaterIntakeProvider';

type PersonalizationContextValue = {
  ready: boolean;
  prefs: PersonalizationPrefs;
  setPrefs: (patch: Partial<PersonalizationPrefs>) => void;
  homeInsight: HomeInsightSegment | null;
  lockSuggestions: LockSuggestion[];
  suggestedStepGoal: (appId?: AppBrandId) => number;
  suggestedWaterGoalMl: () => number;
};

const PersonalizationContext = createContext<PersonalizationContextValue | null>(null);

export function PersonalizationProvider({ children }: { children: ReactNode }) {
  const { snapshot, todaySteps, goal: stepGoal, status } = useSteps();
  const { loggedMl, goalMl: waterGoalMl } = useWaterIntake();
  const { apps, configs } = useUnlockRewards();

  const [ready, setReady] = useState(false);
  const [prefs, setPrefsState] = useState<PersonalizationPrefs>(DEFAULT_PERSONALIZATION_PREFS);

  useEffect(() => {
    let mounted = true;
    loadPersonalizationPrefs()
      .then((loaded) => {
        if (mounted) {
          setPrefsState(loaded);
          setReady(true);
        }
      })
      .catch(() => {
        if (mounted) setReady(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const setPrefs = useCallback((patch: Partial<PersonalizationPrefs>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...patch };
      void savePersonalizationPrefs(next);
      return next;
    });
  }, []);

  const avgSteps7 = useMemo(
    () => averageStepsFromWeek(snapshot.week.map((d) => d.steps)),
    [snapshot.week],
  );

  const homeInsight = useMemo((): HomeInsightSegment | null => {
    if (!prefs.homeInsightsEnabled) return null;
    if (!isStepsTrackingReady(status)) {
      return buildHomeInsightWithoutLiveSteps({
        waterLoggedMl: loggedMl,
        waterGoalMl,
      });
    }
    return buildHomeInsight({
      todaySteps,
      stepGoal,
      waterLoggedMl: loggedMl,
      waterGoalMl,
      unlockApps: UNLOCK_REWARDS_V2_ENABLED ? apps : [],
    });
  }, [prefs.homeInsightsEnabled, status, todaySteps, stepGoal, loggedMl, waterGoalMl, apps]);

  const lockSuggestions = useMemo((): LockSuggestion[] => {
    if (!UNLOCK_REWARDS_V2_ENABLED || !prefs.lockSuggestionsEnabled) return [];
    return buildLockSuggestions(configs);
  }, [prefs.lockSuggestionsEnabled, configs]);

  const suggestedStepGoal = useCallback(
    (_appId?: AppBrandId) => recommendStepUnlockGoal(stepGoal, avgSteps7),
    [stepGoal, avgSteps7],
  );

  const suggestedWaterGoalMl = useCallback(() => {
    return recommendWaterUnlockGoalMl(waterGoalMl);
  }, [waterGoalMl]);

  const value = useMemo(
    (): PersonalizationContextValue => ({
      ready,
      prefs,
      setPrefs,
      homeInsight,
      lockSuggestions,
      suggestedStepGoal,
      suggestedWaterGoalMl,
    }),
    [ready, prefs, setPrefs, homeInsight, lockSuggestions, suggestedStepGoal, suggestedWaterGoalMl],
  );

  return (
    <PersonalizationContext.Provider value={value}>{children}</PersonalizationContext.Provider>
  );
}

export function usePersonalization(): PersonalizationContextValue {
  const ctx = useContext(PersonalizationContext);
  if (!ctx) {
    throw new Error('usePersonalization must be used within PersonalizationProvider');
  }
  return ctx;
}
