import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

export type MetricBadgeKind =
  'calories' | 'water' | 'steps' | 'goal' | 'unlock' | 'distance' | 'activeTime' | 'floors';

type Preset = {
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  iconColor: string;
};

const PRESETS: Record<MetricBadgeKind, Preset> = {
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

type MetricBadgeIconProps = {
  kind: MetricBadgeKind;
  size?: number;
};

/** Health metric badge family — always use MetricBadgeIcon (see docs/DESIGN_CONTEXT.md §2.8) */
export function MetricBadgeIcon({ kind, size = 40 }: MetricBadgeIconProps) {
  const preset = PRESETS[kind];
  const glyphSize = size <= 24 ? Math.round(size * 0.55) : 20;

  return (
    <View
      className="items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: preset.backgroundColor,
      }}
    >
      <Ionicons name={preset.icon} size={glyphSize} color={preset.iconColor} />
    </View>
  );
}
