import { Platform, StyleSheet, type ViewStyle } from 'react-native';

/** Soft card lift on iOS; clean border on Android (elevation looks harsh on light UI). */
export function mizoraCardElevationStyle(isDark = false): ViewStyle {
  if (Platform.OS === 'android') {
    return {
      elevation: 0,
      borderWidth: isDark ? 0.7 : 1,
      borderColor: isDark ? '#2a332a' : '#f2f3f0',
    };
  }

  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
  };
}

/** Bottom sheet panel — lifts off the scrim (stronger than inline cards). */
export function mizoraBottomSheetStyle(backgroundColor: string, borderColor: string): ViewStyle {
  const radius = { borderTopLeftRadius: 24, borderTopRightRadius: 24 };

  if (Platform.OS === 'android') {
    return {
      ...radius,
      backgroundColor,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor,
      elevation: 20,
    };
  }

  return {
    ...radius,
    backgroundColor,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor,
    shadowColor: '#141c12',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
  };
}

/** Nested card on sheets / tinted surfaces — visible depth vs flat white-on-white. */
export function mizoraProminentCardStyle(borderColor: string, backgroundColor: string): ViewStyle {
  const base = {
    backgroundColor,
    borderRadius: 20,
    borderWidth: 0.67,
    borderColor,
    overflow: 'hidden' as const,
  };

  if (Platform.OS === 'android') {
    return { ...base, elevation: 3 };
  }

  return {
    ...base,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  };
}
