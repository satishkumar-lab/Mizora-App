import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import {
  DEFAULT_HOME_DASHBOARD,
  loadHomeDashboardPreferences,
  saveHomeDashboardPreferences,
  type HealthOverviewLayout,
  type HomeDashboardPreferences,
  type StepsHomeChartStyle,
} from '@/lib/home-dashboard-preferences';

type HomeDashboardPreferencesContextValue = {
  ready: boolean;
  prefs: HomeDashboardPreferences;
  setStepsChartStyle: (style: StepsHomeChartStyle) => void;
  setHealthOverviewLayout: (layout: HealthOverviewLayout) => void;
};

const HomeDashboardPreferencesContext = createContext<HomeDashboardPreferencesContextValue | null>(
  null,
);

export function HomeDashboardPreferencesProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [prefs, setPrefs] = useState<HomeDashboardPreferences>(DEFAULT_HOME_DASHBOARD);

  useEffect(() => {
    let mounted = true;
    loadHomeDashboardPreferences()
      .then((loaded) => {
        if (mounted) {
          setPrefs(loaded);
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

  const setStepsChartStyle = useCallback((style: StepsHomeChartStyle) => {
    setPrefs((prev) => {
      const next = { ...prev, stepsChartStyle: style };
      void saveHomeDashboardPreferences(next);
      return next;
    });
  }, []);

  const setHealthOverviewLayout = useCallback((layout: HealthOverviewLayout) => {
    setPrefs((prev) => {
      const next = { ...prev, healthOverviewLayout: layout };
      void saveHomeDashboardPreferences(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ ready, prefs, setStepsChartStyle, setHealthOverviewLayout }),
    [ready, prefs, setStepsChartStyle, setHealthOverviewLayout],
  );

  return (
    <HomeDashboardPreferencesContext.Provider value={value}>
      {children}
    </HomeDashboardPreferencesContext.Provider>
  );
}

export function useHomeDashboardPreferences(): HomeDashboardPreferencesContextValue {
  const ctx = useContext(HomeDashboardPreferencesContext);
  if (!ctx) {
    throw new Error(
      'useHomeDashboardPreferences must be used within HomeDashboardPreferencesProvider',
    );
  }
  return ctx;
}
