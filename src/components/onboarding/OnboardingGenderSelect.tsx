import { Ionicons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/tokens';
import { ONBOARDING_ANDROID_CARD } from '@/constants/onboardingFigmaAssets';

export type OnboardingGender = 'male' | 'female';

type OnboardingGenderSelectProps = {
  value: OnboardingGender | null;
  onChange: (value: OnboardingGender) => void;
};

export function OnboardingGenderSelect({ value, onChange }: OnboardingGenderSelectProps) {
  return (
    <View style={styles.root}>
      <Text style={styles.label}>Gender</Text>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          onPress={() => onChange('male')}
          style={[styles.option, value === 'male' && styles.optionActive]}
        >
          <Ionicons name="male" size={18} color={value === 'male' ? '#FFFFFF' : '#141c12'} />
          <Text style={[styles.optionText, value === 'male' && styles.optionTextActive]}>Male</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => onChange('female')}
          style={[styles.option, value === 'female' && styles.optionActive]}
        >
          <Ionicons name="female" size={18} color={value === 'female' ? '#FFFFFF' : '#141c12'} />
          <Text style={[styles.optionText, value === 'female' && styles.optionTextActive]}>
            Female
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginBottom: 16,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: '#141c12',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 100,
    backgroundColor:
      Platform.OS === 'android' ? ONBOARDING_ANDROID_CARD.fill : 'rgba(255,255,255,0.88)',
    borderWidth: Platform.OS === 'android' ? ONBOARDING_ANDROID_CARD.borderWidth : 1,
    borderColor:
      Platform.OS === 'android' ? ONBOARDING_ANDROID_CARD.border : 'rgba(255,255,255,0.95)',
    ...(Platform.OS === 'android'
      ? {
          shadowColor: 'transparent',
          shadowOpacity: 0,
          elevation: 0,
        }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 2,
        }),
  },
  optionActive: {
    backgroundColor: '#141c12',
    borderColor: '#141c12',
  },
  optionText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: '#141c12',
  },
  optionTextActive: {
    color: '#FFFFFF',
  },
});
