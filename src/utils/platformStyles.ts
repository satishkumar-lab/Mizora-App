import { Platform, type ViewStyle } from 'react-native';

/** Soft card lift on iOS; clean border on Android (elevation looks harsh on light UI). */
export function mizoraCardElevationStyle(): ViewStyle {
  if (Platform.OS === 'android') {
    return {
      elevation: 0,
      borderWidth: 1,
      borderColor: '#f2f3f0',
    };
  }

  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
  };
}
