import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OnboardingFigmaGoalsScreen } from '@/components/onboarding/OnboardingFigmaGoalsScreen';
import { OnboardingFigmaIntroScreen } from '@/components/onboarding/OnboardingFigmaIntroScreen';
import type { OnboardingGender } from '@/components/onboarding/OnboardingGenderSelect';
import { OnboardingV2TopBar } from '@/components/onboarding/OnboardingV2TopBar';
import {
  parseOnboardingRecommendationInput,
  recommendOnboardingDailySteps,
  recommendOnboardingDailyWaterLiters,
} from '@/lib/onboarding/onboardingRecommendations';
import { completeOnboarding } from '@/lib/onboarding-storage';
import { saveHealthProfile } from '@/lib/profile-storage';
import { loadHealthGoals, saveHealthGoals } from '@/lib/steps-preferences';
import { loadWaterIntakeSnapshot, saveWaterIntakeSnapshot } from '@/lib/water-intake-storage';
import { clampWaterGoalMl } from '@/lib/water-recommendation';

type GoalsPhase = 'inputs' | 'recommendation';

function parseHeightCm(text: string): number | null {
  const n = parseInt(text.trim(), 10);
  if (!Number.isFinite(n) || n < 120 || n > 220) return null;
  return n;
}

function parseWeightKg(text: string): number | null {
  const n = parseFloat(text.trim().replace(',', '.'));
  if (!Number.isFinite(n) || n < 35 || n > 180) return null;
  return n;
}

export function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [stepIndex, setStepIndex] = useState(0);
  const [goalsPhase, setGoalsPhase] = useState<GoalsPhase>('inputs');
  const [heightText, setHeightText] = useState('');
  const [weightText, setWeightText] = useState('');
  const [gender, setGender] = useState<OnboardingGender | null>(null);
  const [hasCompletedWelcome, setHasCompletedWelcome] = useState(false);
  const [welcomeChromeReady, setWelcomeChromeReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isWelcomeStep = stepIndex === 0;
  const isGoalsStep = stepIndex === 1;
  const isRecommendation = isGoalsStep && goalsPhase === 'recommendation';

  const canShowRecommendations =
    gender !== null && parseHeightCm(heightText) !== null && parseWeightKg(weightText) !== null;

  const finishOnboarding = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const input = parseOnboardingRecommendationInput(gender, heightText, weightText);
      await completeOnboarding({});

      if (input) {
        await saveHealthProfile({ weightKg: input.weightKg, heightCm: input.heightCm });
        const steps = recommendOnboardingDailySteps(input);
        const goals = await loadHealthGoals();
        await saveHealthGoals({ ...goals, steps });

        const waterL = recommendOnboardingDailyWaterLiters(input);
        const water = await loadWaterIntakeSnapshot();
        await saveWaterIntakeSnapshot({
          ...water,
          goalMl: clampWaterGoalMl(Math.round(waterL * 1000)),
        });
      }

      router.replace('/home');
    } finally {
      setSubmitting(false);
    }
  }, [gender, heightText, router, submitting, weightText]);

  const onSkipPress = () => {
    setGoalsPhase('inputs');
    setStepIndex(1);
    setHasCompletedWelcome(true);
  };

  const onBackPress = () => {
    if (isRecommendation) {
      setGoalsPhase('inputs');
      return;
    }
    if (stepIndex <= 0) return;
    setGoalsPhase('inputs');
    setStepIndex(0);
  };

  const onSkipGoalsPress = () => {
    if (isRecommendation) return;
    setHeightText('170');
    setWeightText('68');
    setGender('male');
    setGoalsPhase('recommendation');
  };

  const showTopBack = stepIndex > 0;
  const showTopSkip =
    (isWelcomeStep && welcomeChromeReady) || (isGoalsStep && goalsPhase === 'inputs');

  const bottomPadding = Math.max(insets.bottom, 20);

  if (isWelcomeStep) {
    return (
      <View style={{ flex: 1 }}>
        <OnboardingFigmaIntroScreen
          bottomPadding={bottomPadding}
          introOnly={hasCompletedWelcome}
          onIntroInteractive={() => setWelcomeChromeReady(true)}
          onContinue={() => {
            setHasCompletedWelcome(true);
            setStepIndex(1);
          }}
        />
        {welcomeChromeReady || hasCompletedWelcome ? (
          <OnboardingV2TopBar
            variant="lime"
            showBack={showTopBack}
            showSkip={showTopSkip}
            onBack={onBackPress}
            onSkip={onSkipPress}
          />
        ) : null}
      </View>
    );
  }

  if (isGoalsStep) {
    return (
      <View style={{ flex: 1 }}>
        <OnboardingFigmaGoalsScreen
          phase={goalsPhase}
          gender={gender}
          onGenderChange={setGender}
          heightText={heightText}
          weightText={weightText}
          onHeightChange={setHeightText}
          onWeightChange={setWeightText}
          bottomPadding={bottomPadding}
          canContinue={canShowRecommendations}
          onPrimary={() => setGoalsPhase('recommendation')}
          onAccept={() => void finishOnboarding()}
          onCustomize={() => setGoalsPhase('inputs')}
          acceptDisabled={submitting}
        />
        <OnboardingV2TopBar
          variant="lime"
          showBack={showTopBack}
          showSkip={showTopSkip}
          onBack={onBackPress}
          onSkip={onSkipGoalsPress}
        />
      </View>
    );
  }

  return null;
}
