import { LinearGradient } from 'expo-linear-gradient';
import { View } from 'react-native';

import type { OnboardingSlideConfig } from '@/components/onboarding/onboardingSlides';

type OnboardingBackdropProps = {
  variant: OnboardingSlideConfig['backdrop'];
};

const GRADIENTS: Record<
  OnboardingSlideConfig['backdrop'],
  { colors: [string, string, ...string[]]; locations?: [number, number, ...number[]] }
> = {
  lime: {
    colors: ['#f5ffbb', '#fafafa', '#fafafa'],
    locations: [0, 0.45, 1],
  },
  mint: {
    colors: ['#e5ece2', '#f4f6f3', '#fafafa'],
    locations: [0, 0.35, 1],
  },
  neutral: {
    colors: ['#fafbf4', '#fafafa', '#ffffff'],
    locations: [0, 0.5, 1],
  },
  glow: {
    colors: ['#d7ffc7', '#f5ffbb', '#fafafa'],
    locations: [0, 0.4, 1],
  },
};

export function OnboardingBackdrop({ variant }: OnboardingBackdropProps) {
  const gradient = GRADIENTS[variant];

  return (
    <View className="absolute inset-0 overflow-hidden">
      <LinearGradient colors={gradient.colors} locations={gradient.locations} style={{ flex: 1 }} />

      <View
        className="absolute -right-16 top-24 h-48 w-48 rounded-full opacity-60"
        style={{ backgroundColor: '#ddfb43' }}
      />
      <View
        className="absolute -left-20 top-40 h-56 w-56 rounded-full opacity-30"
        style={{ backgroundColor: '#34c759' }}
      />
      <View
        className="absolute right-8 top-16 h-3 w-3 rounded-full opacity-80"
        style={{ backgroundColor: '#c8f526' }}
      />
      <View
        className="absolute left-12 top-28 h-2 w-2 rounded-full opacity-70"
        style={{ backgroundColor: '#34c759' }}
      />
      <View
        className="absolute bottom-32 right-12 h-2.5 w-2.5 rounded-full opacity-50"
        style={{ backgroundColor: '#5c6d05' }}
      />
    </View>
  );
}
