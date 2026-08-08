/** Secondary text tone — matches app `BackChevronIcon`. */
export const BACK_CHEVRON_COLOR = '#626b5e';

export type MetricBadgeKind =
  'calories' | 'water' | 'steps' | 'goal' | 'unlock' | 'distance' | 'activeTime' | 'floors';

export type IonIconName =
  | 'home'
  | 'home-outline'
  | 'footsteps'
  | 'heart'
  | 'heart-outline'
  | 'notifications'
  | 'notifications-outline'
  | 'flame'
  | 'water'
  | 'flag'
  | 'key'
  | 'navigate'
  | 'timer'
  | 'layers'
  | 'add'
  | 'remove';

export type MetricPreset = {
  icon: IonIconName;
  backgroundColor: string;
  iconColor: string;
};

/** Mirrors `src/components/icons/MetricBadgeIcon.tsx` presets (light mode). */
export const METRIC_BADGE_PRESETS: Record<MetricBadgeKind, MetricPreset> = {
  calories: {
    icon: 'flame',
    backgroundColor: '#f8ffd2',
    iconColor: '#734a00',
  },
  water: {
    icon: 'water',
    backgroundColor: '#ebf7ff',
    iconColor: '#0a84ff',
  },
  steps: {
    icon: 'footsteps',
    backgroundColor: '#f8ffd2',
    iconColor: '#5c6d05',
  },
  goal: {
    icon: 'flag',
    backgroundColor: '#f8ffd2',
    iconColor: '#734a00',
  },
  unlock: {
    icon: 'key',
    backgroundColor: '#f8ffd2',
    iconColor: '#5c6d05',
  },
  distance: {
    icon: 'navigate',
    backgroundColor: '#ebf7ff',
    iconColor: '#0a84ff',
  },
  activeTime: {
    icon: 'timer',
    backgroundColor: '#f4f6f3',
    iconColor: '#626b5e',
  },
  floors: {
    icon: 'layers',
    backgroundColor: '#f8ffd2',
    iconColor: '#734a00',
  },
};

export function metricIoniconName(kind: MetricBadgeKind): IonIconName {
  return METRIC_BADGE_PRESETS[kind].icon;
}
