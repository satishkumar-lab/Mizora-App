import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@mizora/home_dashboard_v1';

export type StepsHomeChartStyle = 'bars' | 'gradient';

/** Full-width steps on top (default) vs steps left + metrics right */
export type HealthOverviewLayout = 'stacked' | 'split';

export type HomeDashboardPreferences = {
  stepsChartStyle: StepsHomeChartStyle;
  healthOverviewLayout: HealthOverviewLayout;
};

export const DEFAULT_HOME_DASHBOARD: HomeDashboardPreferences = {
  stepsChartStyle: 'bars',
  healthOverviewLayout: 'stacked',
};

export async function loadHomeDashboardPreferences(): Promise<HomeDashboardPreferences> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return { ...DEFAULT_HOME_DASHBOARD };
  try {
    const data = JSON.parse(raw) as Partial<HomeDashboardPreferences> & {
      homeSectionOrder?: unknown;
    };
    const layout =
      data.healthOverviewLayout === 'split'
        ? 'split'
        : data.healthOverviewLayout === 'stacked'
          ? 'stacked'
          : DEFAULT_HOME_DASHBOARD.healthOverviewLayout;
    return {
      stepsChartStyle: data.stepsChartStyle === 'gradient' ? 'gradient' : 'bars',
      healthOverviewLayout: layout,
    };
  } catch {
    return { ...DEFAULT_HOME_DASHBOARD };
  }
}

export async function saveHomeDashboardPreferences(prefs: HomeDashboardPreferences): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}
