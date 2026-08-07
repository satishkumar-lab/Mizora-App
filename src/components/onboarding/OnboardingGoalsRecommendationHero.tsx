import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, type ReactNode } from 'react';
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { OnboardingGlassSurface } from '@/components/onboarding/OnboardingGlassSurface';
import type { OnboardingGender } from '@/components/onboarding/OnboardingGenderSelect';
import {
  formatRecommendationSteps,
  formatRecommendationWaterLiters,
  parseOnboardingRecommendationInput,
  recommendOnboardingDailySteps,
  recommendOnboardingDailyWaterLiters,
} from '@/lib/onboarding/onboardingRecommendations';
import { fonts } from '@/theme/tokens';
import { ONBOARDING_ANDROID_CARD } from '@/constants/onboardingFigmaAssets';

function FloatTile({
  children,
  style,
  drift = 5,
}: {
  children: ReactNode;
  style?: object;
  drift?: number;
}) {
  const phase = useSharedValue(0);

  useEffect(() => {
    phase.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [phase]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(phase.value, [0, 1], [0, -drift]) }],
  }));

  return <Animated.View style={[style, floatStyle]}>{children}</Animated.View>;
}

/** Floating glass targets — recommendation step hero. */
export function OnboardingGoalsRecommendationHero({
  gender,
  heightText,
  weightText,
}: {
  gender: OnboardingGender | null;
  heightText: string;
  weightText: string;
}) {
  const { width } = useWindowDimensions();
  const s = width / 393;

  const { steps, water } = useMemo(() => {
    const input = parseOnboardingRecommendationInput(gender, heightText, weightText);
    if (!input) {
      return { steps: 8_000, water: 2 };
    }
    return {
      steps: recommendOnboardingDailySteps(input),
      water: recommendOnboardingDailyWaterLiters(input),
    };
  }, [gender, heightText, weightText]);

  return (
    <Animated.View
      entering={FadeInUp.delay(60).duration(520).springify().damping(18)}
      style={styles.stage}
    >
      <View style={[styles.orbit, { width: 300 * s, height: 188 * s }]}>
        <FloatTile
          drift={6}
          style={[styles.tileWrap, { left: 0, top: 28 * s, transform: [{ rotate: '-6deg' }] }]}
        >
          <OnboardingGlassSurface
            style={[
              styles.tile,
              { width: 148 * s, minHeight: 132 * s, borderRadius: 28 * s, padding: 14 * s },
            ]}
          >
            <View style={[styles.iconRing, { backgroundColor: 'rgba(52,199,89,0.18)' }]}>
              <Ionicons name="footsteps" size={22 * s} color="#34c759" />
            </View>
            <Text style={[styles.metricValue, { fontSize: 28 * s, marginTop: 10 * s }]}>
              {formatRecommendationSteps(steps)}
            </Text>
            <Text style={[styles.metricLabel, { fontSize: 12 * s }]}>Daily steps</Text>
          </OnboardingGlassSurface>
        </FloatTile>

        <FloatTile
          drift={8}
          style={[styles.tileWrap, { right: 0, top: 8 * s, transform: [{ rotate: '7deg' }] }]}
        >
          <OnboardingGlassSurface
            style={[
              styles.tile,
              { width: 138 * s, minHeight: 124 * s, borderRadius: 26 * s, padding: 14 * s },
            ]}
          >
            <View style={[styles.iconRing, { backgroundColor: 'rgba(10,132,255,0.14)' }]}>
              <Ionicons name="water" size={20 * s} color="#0a84ff" />
            </View>
            <Text style={[styles.metricValue, { fontSize: 26 * s, marginTop: 10 * s }]}>
              {formatRecommendationWaterLiters(water)}
            </Text>
            <Text style={[styles.metricLabel, { fontSize: 12 * s }]}>Daily water</Text>
          </OnboardingGlassSurface>
        </FloatTile>

        <FloatTile drift={3} style={{ position: 'absolute', left: 118 * s, top: 0 }}>
          <View
            style={[
              styles.sparkPill,
              { paddingHorizontal: 12 * s, paddingVertical: 6 * s, borderRadius: 100 * s },
            ]}
          >
            <Ionicons name="sparkles" size={14 * s} color="#5c6d05" />
            <Text style={[styles.sparkText, { fontSize: 11 * s }]}>Tailored preview</Text>
          </View>
        </FloatTile>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 4,
  },
  orbit: {
    position: 'relative',
    alignSelf: 'center',
  },
  tileWrap: {
    position: 'absolute',
  },
  tile: {
    alignItems: 'flex-start',
  },
  iconRing: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontFamily: fonts.bold,
    color: '#000000',
    letterSpacing: -0.5,
  },
  metricLabel: {
    fontFamily: fonts.medium,
    color: 'rgba(20,28,18,0.55)',
    marginTop: 2,
  },
  sparkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    ...Platform.select({
      android: {
        backgroundColor: ONBOARDING_ANDROID_CARD.fill,
        borderWidth: ONBOARDING_ANDROID_CARD.borderWidth,
        borderColor: ONBOARDING_ANDROID_CARD.border,
        elevation: 0,
        shadowOpacity: 0,
      },
      default: {
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(255,255,255,0.95)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
      },
    }),
  },
  sparkText: {
    fontFamily: fonts.medium,
    color: '#5c6d05',
  },
});
