import { Ionicons } from '@expo/vector-icons';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OnboardingAboutMetricCard } from '@/components/onboarding/OnboardingAboutMetricCard';
import type { OnboardingGender } from '@/components/onboarding/OnboardingGenderSelect';
import { OnboardingGenderSelect } from '@/components/onboarding/OnboardingGenderSelect';
import { OnboardingFigmaRadialGlow } from '@/components/onboarding/OnboardingFigmaRadialGlow';
import { OnboardingGoalsRecommendationHero } from '@/components/onboarding/OnboardingGoalsRecommendationHero';
import { OnboardingLimeCta } from '@/components/onboarding/OnboardingLimeCta';
import { ONBOARDING_GOALS_RECOMMENDATION_COPY } from '@/components/onboarding/onboardingSlidesV2';
import { FIGMA_ONBOARDING_FRAME_W, FIGMA_ONBOARDING_LIME } from '@/constants/onboardingFigmaAssets';
import { fonts } from '@/theme/tokens';

const CM_PER_IN = 2.54;
const KG_PER_LB = 0.453592;

function contentTypeScale(layoutScale: number) {
  return Math.min(layoutScale, 1.06) * 0.94;
}

type GoalsPhase = 'inputs' | 'recommendation';

type OnboardingFigmaGoalsScreenProps = {
  phase: GoalsPhase;
  gender: OnboardingGender | null;
  onGenderChange: (value: OnboardingGender) => void;
  heightText: string;
  weightText: string;
  onHeightChange: (v: string) => void;
  onWeightChange: (v: string) => void;
  bottomPadding: number;
  canContinue: boolean;
  onPrimary: () => void;
  onAccept: () => void;
  onCustomize: () => void;
  acceptDisabled?: boolean;
};

export function OnboardingFigmaGoalsScreen({
  phase,
  gender,
  onGenderChange,
  heightText,
  weightText,
  onHeightChange,
  onWeightChange,
  bottomPadding,
  canContinue,
  onPrimary,
  onAccept,
  onCustomize,
  acceptDisabled,
}: OnboardingFigmaGoalsScreenProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const s = width / FIGMA_ONBOARDING_FRAME_W;
  const ts = contentTypeScale(s);
  const isInputs = phase === 'inputs';

  const topChrome = insets.top + 48;

  return (
    <View style={[styles.root, { backgroundColor: FIGMA_ONBOARDING_LIME }]}>
      <Animated.View entering={FadeIn.duration(700)} style={StyleSheet.absoluteFill}>
        <OnboardingFigmaRadialGlow />
      </Animated.View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 48}
      >
        <ScrollView
          contentContainerStyle={
            isInputs
              ? {
                  paddingTop: topChrome,
                  paddingBottom: bottomPadding + 16,
                  paddingHorizontal: 18,
                }
              : {
                  flexGrow: 1,
                  justifyContent: 'center',
                  minHeight: height,
                  paddingTop: topChrome,
                  paddingBottom: bottomPadding + 16,
                  paddingHorizontal: 18,
                }
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {isInputs ? (
            <>
              <Text style={styles.pageTitle}>Your daily targets</Text>
              <Text
                style={styles.pageSubtitle}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.85}
              >
                Scroll or tap to set gender, height & weight
              </Text>

              <Animated.View entering={FadeInUp.delay(80).duration(480)}>
                <OnboardingGenderSelect value={gender} onChange={onGenderChange} />
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(140).duration(480)}>
                <OnboardingAboutMetricCard
                  title="Height"
                  subtitle="Scroll or type — cm or inches"
                  icon="resize-outline"
                  iconTint="rgba(193,253,58,0.45)"
                  canonicalValue={heightText}
                  onCanonicalChange={onHeightChange}
                  primaryUnit="cm"
                  secondaryUnit="in"
                  primaryMin={120}
                  primaryMax={220}
                  secondaryMin={48}
                  secondaryMax={87}
                  toSecondary={(cm) => Math.round(cm / CM_PER_IN)}
                  toPrimary={(inch) => inch * CM_PER_IN}
                  formatPrimary={(n) => String(Math.round(n))}
                  formatSecondary={(n) => String(Math.round(n))}
                />
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(200).duration(480)}>
                <OnboardingAboutMetricCard
                  title="Weight"
                  subtitle="Scroll or type — kg or lbs"
                  icon="scale-outline"
                  iconTint="rgba(10,132,255,0.18)"
                  canonicalValue={weightText}
                  onCanonicalChange={onWeightChange}
                  primaryUnit="kg"
                  secondaryUnit="lbs"
                  primaryMin={35}
                  primaryMax={180}
                  primaryStep={1}
                  secondaryMin={77}
                  secondaryMax={397}
                  toSecondary={(kg) => Math.round(kg / KG_PER_LB)}
                  toPrimary={(lb) => lb * KG_PER_LB}
                  formatPrimary={(n) => String(Math.round(n * 10) / 10)}
                  formatSecondary={(n) => String(Math.round(n))}
                  keyboardType="decimal-pad"
                  decimals={1}
                />
              </Animated.View>

              <OnboardingLimeCta
                label="Get my targets"
                onPress={onPrimary}
                disabled={!canContinue}
                showArrow
                fullWidth
              />

              <View style={styles.privacyRow}>
                <Ionicons name="shield-checkmark-outline" size={16} color="rgba(20,28,18,0.5)" />
                <Text style={styles.privacyText}>Your data stays on this device</Text>
              </View>
            </>
          ) : (
            <>
              <OnboardingGoalsRecommendationHero
                gender={gender}
                heightText={heightText}
                weightText={weightText}
              />

              <Animated.View entering={FadeInUp.delay(160).duration(480)} style={styles.copyBlock}>
                <Text style={[styles.eyebrow, { fontSize: 11 * ts }]}>
                  {ONBOARDING_GOALS_RECOMMENDATION_COPY.eyebrow}
                </Text>
                <Text style={[styles.headline, { fontSize: 28 * ts, lineHeight: 34 * ts }]}>
                  {ONBOARDING_GOALS_RECOMMENDATION_COPY.title}
                  {'\n'}
                  <Text style={styles.headlineAccent}>
                    {ONBOARDING_GOALS_RECOMMENDATION_COPY.titleAccent}
                  </Text>
                </Text>
                <Text
                  style={[
                    styles.subhead,
                    { fontSize: 15 * ts, lineHeight: 21 * ts, marginTop: 10 * ts },
                  ]}
                >
                  {ONBOARDING_GOALS_RECOMMENDATION_COPY.body}
                </Text>
              </Animated.View>

              <Animated.View
                entering={FadeInUp.delay(240).duration(480)}
                style={{ marginTop: 6 * s }}
              >
                <Text style={[styles.unlockHint, { fontSize: 12 * ts }]}>
                  You can fine-tune these anytime in Settings.
                </Text>
              </Animated.View>

              <OnboardingLimeCta
                label="Accept recommendation"
                onPress={onAccept}
                disabled={acceptDisabled}
                fullWidth
                showArrow
              />
              <Pressable
                accessibilityRole="button"
                onPress={onCustomize}
                style={styles.secondaryCta}
              >
                <Text style={[styles.secondaryLabel, { fontSize: 15 * ts }]}>Customize</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  pageTitle: {
    fontFamily: fonts.bold,
    fontSize: 28,
    color: '#141c12',
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: 'rgba(20,28,18,0.62)',
    marginTop: 6,
    marginBottom: 18,
  },
  copyBlock: {
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 4,
  },
  eyebrow: {
    fontFamily: fonts.medium,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#3d5c0a',
    marginBottom: 8,
  },
  headline: {
    fontFamily: fonts.bold,
    color: '#000000',
    textAlign: 'center',
  },
  headlineAccent: {
    color: '#3d5c0a',
  },
  subhead: {
    fontFamily: fonts.medium,
    color: 'rgba(0,0,0,0.72)',
    textAlign: 'center',
  },
  unlockHint: {
    fontFamily: fonts.medium,
    color: 'rgba(20,28,18,0.5)',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
  },
  privacyText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: 'rgba(20,28,18,0.5)',
  },
  secondaryCta: {
    alignSelf: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  secondaryLabel: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: '#141c12',
  },
});
