import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

import { ONBOARDING_ANDROID_CARD } from '@/constants/onboardingFigmaAssets';

type OnboardingGlassSurfaceProps = ViewProps & {
  children: ReactNode;
  /** Slightly stronger frost for nested rows */
  nested?: boolean;
};

/**
 * Frosted card surface for lime onboarding.
 * iOS: native blur + light frost. Android: flat light-yellow card, no shadow.
 */
export function OnboardingGlassSurface({
  children,
  nested = false,
  style,
  ...rest
}: OnboardingGlassSurfaceProps) {
  const isAndroid = Platform.OS === 'android';

  const frost = nested ? 'rgba(255, 255, 255, 0.42)' : 'rgba(255, 255, 255, 0.58)';
  const border = nested ? 'rgba(255, 255, 255, 0.55)' : 'rgba(255, 255, 255, 0.72)';

  return (
    <View
      {...rest}
      style={[
        {
          borderRadius: 24,
          overflow: 'hidden',
          borderWidth: isAndroid
            ? ONBOARDING_ANDROID_CARD.borderWidth
            : StyleSheet.hairlineWidth * 2,
          borderColor: isAndroid ? ONBOARDING_ANDROID_CARD.border : border,
          ...(isAndroid
            ? {
                backgroundColor: ONBOARDING_ANDROID_CARD.fill,
                shadowColor: 'transparent',
                shadowOpacity: 0,
                shadowRadius: 0,
                elevation: 0,
              }
            : {
                shadowColor: '#0F172A',
                shadowOffset: { width: 0, height: 16 },
                shadowOpacity: 0.08,
                shadowRadius: 32,
                elevation: 8,
              }),
        },
        style,
      ]}
    >
      {isAndroid ? null : (
        <>
          <BlurView intensity={nested ? 28 : 36} tint="light" style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: frost }]} />
          <LinearGradient
            colors={['rgba(255,255,255,0.65)', 'transparent']}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 1,
            }}
            pointerEvents="none"
          />
        </>
      )}
      <View style={{ position: 'relative' }}>{children}</View>
    </View>
  );
}
