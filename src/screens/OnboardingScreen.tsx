import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { OnboardingBackdrop } from '@/components/onboarding/OnboardingBackdrop';
import { ONBOARDING_SLIDES } from '@/components/onboarding/onboardingSlides';
import { OnboardingSlideVisual } from '@/components/onboarding/OnboardingSlideVisual';
import { OnboardingStepIndicator } from '@/components/onboarding/OnboardingStepIndicator';
import { GradientButton } from '@/components/ui/GradientButton';
import { completeOnboarding } from '@/lib/onboarding-storage';
import { fonts } from '@/theme/tokens';

export function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stepIndex, setStepIndex] = useState(0);
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const slide = ONBOARDING_SLIDES[stepIndex];
  const isLastStep = stepIndex === ONBOARDING_SLIDES.length - 1;

  const primaryLabel = useMemo(() => {
    if (isLastStep) return 'Open my dashboard';
    if (stepIndex === 0) return 'Show me how';
    return 'Continue';
  }, [isLastStep, stepIndex]);

  const finish = useCallback(
    async (name?: string) => {
      if (submitting) return;
      setSubmitting(true);
      try {
        await completeOnboarding({ displayName: name ?? displayName });
        router.replace('/home');
      } finally {
        setSubmitting(false);
      }
    },
    [displayName, router, submitting],
  );

  const onPrimaryPress = () => {
    if (isLastStep) {
      void finish();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, ONBOARDING_SLIDES.length - 1));
  };

  const onSkipPress = () => {
    if (isLastStep) {
      void finish('');
      return;
    }
    setStepIndex(ONBOARDING_SLIDES.length - 1);
  };

  const stepLabel = `${String(stepIndex + 1).padStart(2, '0')} / ${String(ONBOARDING_SLIDES.length).padStart(2, '0')}`;

  return (
    <View className="flex-1 bg-mizora-bg">
      <OnboardingBackdrop variant={slide.backdrop} />

      <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View className="flex-1 px-5">
            <View className="flex-row items-center justify-between py-2">
              <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: '#626b5e' }}>
                {stepLabel}
              </Text>
              {!isLastStep ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={onSkipPress}
                  hitSlop={12}
                  className="rounded-full border border-[#ebefea] bg-white/80 px-4 py-2"
                >
                  <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: '#141c12' }}>
                    Skip
                  </Text>
                </Pressable>
              ) : (
                <View className="w-[72px]" />
              )}
            </View>

            <View className="flex-1 justify-end pb-4 pt-2">
              <Animated.View
                key={slide.id}
                entering={FadeInUp.duration(420).springify().damping(18)}
                exiting={FadeOut.duration(180)}
                className="min-h-[300px] justify-center"
              >
                <OnboardingSlideVisual id={slide.id} />
              </Animated.View>
            </View>
          </View>

          <View
            className="rounded-t-[32px] bg-white px-5 pt-7"
            style={{
              paddingBottom: Math.max(insets.bottom, 20),
              shadowColor: '#0F172A',
              shadowOffset: { width: 0, height: -8 },
              shadowOpacity: 0.06,
              shadowRadius: 24,
              elevation: 12,
            }}
          >
            <Animated.View
              key={`copy-${slide.id}`}
              entering={FadeInDown.duration(320).springify().damping(22)}
            >
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 11,
                  letterSpacing: 1.2,
                  textTransform: 'uppercase',
                  color: '#49a621',
                  marginBottom: 8,
                }}
              >
                {slide.eyebrow}
              </Text>

              <Text
                style={{ fontFamily: fonts.bold, fontSize: 26, lineHeight: 32, color: '#141c12' }}
              >
                {slide.title}
                {slide.titleAccent ? (
                  <Text style={{ color: '#5c6d05' }}>
                    {'\n'}
                    {slide.titleAccent}
                  </Text>
                ) : null}
              </Text>

              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 14,
                  lineHeight: 22,
                  color: '#626b5e',
                  marginTop: 10,
                }}
              >
                {slide.body}
              </Text>

              {isLastStep ? (
                <View className="mt-5">
                  <TextInput
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="What should we call you?"
                    placeholderTextColor="#8e8e93"
                    autoCapitalize="words"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={() => void finish()}
                    className="rounded-[15px] border border-[#ebefea] bg-[#fafbf4] px-4 py-4 text-base text-black"
                    style={{ fontFamily: fonts.medium }}
                  />
                </View>
              ) : null}
            </Animated.View>

            <View className="mt-6 gap-4">
              <OnboardingStepIndicator total={ONBOARDING_SLIDES.length} currentIndex={stepIndex} />
              <GradientButton label={primaryLabel} onPress={onPrimaryPress} disabled={submitting} />
              {isLastStep ? (
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void finish('')}
                  disabled={submitting}
                  className="items-center py-1"
                >
                  <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: '#626b5e' }}>
                    Continue without name
                  </Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
