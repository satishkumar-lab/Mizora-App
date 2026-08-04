import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { useMizoraTheme } from '@/hooks/useMizoraTheme';

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

/** Ionicons glyph for a metric kind (nav, labels, etc.). */
export function metricIoniconName(kind: MetricBadgeKind): keyof typeof Ionicons.glyphMap {
  return PRESETS[kind].icon;
}

type MetricBadgeIconProps = {
  kind: MetricBadgeKind;
  size?: number;
  /** Muted circle + glyph — e.g. read notifications (see activeTime neutrals). */
  appearance?: 'default' | 'read';
};

/** Health metric badge family — always use MetricBadgeIcon (see docs/DESIGN_CONTEXT.md §2.8) */
export function MetricBadgeIcon({ kind, size = 40, appearance = 'default' }: MetricBadgeIconProps) {
  const { colors, isDark } = useMizoraTheme();
  const preset = PRESETS[kind];
  const glyphSize = size <= 24 ? Math.round(size * 0.55) : 20;
  const isRead = appearance === 'read';

  const backgroundColor = isRead
    ? isDark
      ? colors.iconBadgeBg
      : '#f4f6f3'
    : isDark
      ? colors.iconBadgeBg
      : preset.backgroundColor;

  const iconColor = isRead ? (isDark ? colors.textMuted : '#626b5e') : preset.iconColor;

  const showBadgeBorder = isDark || isRead;

  return (
    <View
      className="items-center justify-center rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor,
        borderWidth: showBadgeBorder ? 1 : 0,
        borderColor: isDark ? colors.iconBadgeBorder : isRead ? '#ebefea' : 'transparent',
      }}
    >
      <Ionicons name={preset.icon} size={glyphSize} color={iconColor} />
    </View>
  );
}
