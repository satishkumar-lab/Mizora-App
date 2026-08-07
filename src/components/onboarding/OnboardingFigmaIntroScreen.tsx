import { Ionicons } from '@expo/vector-icons';
import type { ImageSourcePropType, ImageStyle, StyleProp, ViewStyle } from 'react-native';
import { Image, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  FadeIn,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MizoraFullLogo } from '@/components/brand/MizoraFullLogo';
import { OnboardingFigmaRadialGlow } from '@/components/onboarding/OnboardingFigmaRadialGlow';
import { OnboardingLimeCta } from '@/components/onboarding/OnboardingLimeCta';
import {
  ONBOARDING_SPLASH_MS,
  ONBOARDING_VALUE_COPY,
} from '@/components/onboarding/onboardingSlidesV2';
import {
  FIGMA_ONBOARDING_FRAME_H,
  FIGMA_ONBOARDING_FRAME_W,
  FIGMA_ONBOARDING_LIME,
  onboardingFigmaCollage,
} from '@/constants/onboardingFigmaAssets';
import { fonts } from '@/theme/tokens';

const VALUE_COPY = ONBOARDING_VALUE_COPY;

const INTRO_ENTER_MS = 520;
const LOGO_LOCKUP_ASPECT = 50.519 / 147;
const MORPH_MS = 720;

/** Splash hold, then logo flies to intro position and scales down. */
const SPLASH_LOGO_MAX_W = 200;
const INTRO_LOGO_MAX_W = 158;

/** Same easing on iOS/Android — springs in layout entering differ by platform. */
function introEnter(delay: number) {
  return FadeIn.delay(delay).duration(INTRO_ENTER_MS).easing(Easing.out(Easing.cubic));
}

/** Typography scales with width but stays closer to Figma artboard on large phones. */
function contentTypeScale(layoutScale: number) {
  return Math.min(layoutScale, 1.06) * 0.94;
}

type OnboardingFigmaIntroScreenProps = {
  bottomPadding: number;
  onContinue: () => void;
  /** Skip splash hold + morph (e.g. user navigated back from goals). */
  introOnly?: boolean;
  onIntroInteractive?: () => void;
};

function IntroIconBadge({
  icon,
  boxSize,
  iconSize,
  color,
  style,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  boxSize: number;
  iconSize: number;
  color: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          width: boxSize,
          height: boxSize,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={iconSize} color={color} />
    </View>
  );
}

function CollagePhoto({
  source,
  width,
  height,
  style,
  imageStyle,
}: {
  source: ImageSourcePropType;
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}) {
  return (
    <View style={[{ width, height, overflow: 'hidden' }, style]}>
      <Image source={source} style={[{ width, height }, imageStyle]} resizeMode="cover" />
    </View>
  );
}

function IntroCollageFloat({
  children,
  style,
  drift = 5,
  enteringDelay = 0,
  animateEnter = true,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  drift?: number;
  enteringDelay?: number;
  animateEnter?: boolean;
}) {
  const phase = useSharedValue(0);

  useEffect(() => {
    const startMs = enteringDelay + INTRO_ENTER_MS;
    const timer = setTimeout(() => {
      phase.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2800 + drift * 100, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 2800 + drift * 100, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        false,
      );
    }, startMs);
    return () => clearTimeout(timer);
  }, [drift, enteringDelay, phase]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(phase.value, [0, 1], [0, -drift]) }],
  }));

  return (
    <View style={style}>
      <Animated.View entering={animateEnter ? introEnter(enteringDelay) : undefined}>
        <Animated.View style={floatStyle}>{children}</Animated.View>
      </Animated.View>
    </View>
  );
}

/** Figma node `8732:6285` — splash morph + intro on one surface. */
export function OnboardingFigmaIntroScreen({
  bottomPadding,
  onContinue,
  introOnly = false,
  onIntroInteractive,
}: OnboardingFigmaIntroScreenProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const s = width / FIGMA_ONBOARDING_FRAME_W;
  const ts = contentTypeScale(s);

  const morph = useSharedValue(introOnly ? 1 : 0);
  const [introInteractive, setIntroInteractive] = useState(introOnly);

  const notifyInteractive = useCallback(() => {
    setIntroInteractive(true);
    onIntroInteractive?.();
  }, [onIntroInteractive]);

  useEffect(() => {
    if (introOnly) {
      onIntroInteractive?.();
      return;
    }

    const runMorph = () => {
      morph.value = withTiming(
        1,
        { duration: MORPH_MS, easing: Easing.inOut(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(notifyInteractive)();
        },
      );
    };

    const hold = setTimeout(runMorph, ONBOARDING_SPLASH_MS);
    return () => clearTimeout(hold);
  }, [introOnly, morph, notifyInteractive, onIntroInteractive]);

  const skipSplashHold = () => {
    if (introInteractive) return;
    // Reanimated shared values are mutated on the UI thread (valid pattern).
    // eslint-disable-next-line react-hooks/immutability -- morph is a Reanimated shared value
    morph.value = withTiming(
      1,
      { duration: MORPH_MS, easing: Easing.inOut(Easing.cubic) },
      (finished) => {
        if (finished) runOnJS(notifyInteractive)();
      },
    );
  };

  const frameTop = Math.max(insets.top, (height - FIGMA_ONBOARDING_FRAME_H * s) / 2);
  const centerX = width / 2;
  const midY = FIGMA_ONBOARDING_FRAME_H / 2;

  const splashLogoW = Math.min(width * 0.5, SPLASH_LOGO_MAX_W);
  const introLogoW = Math.min(width * 0.4, INTRO_LOGO_MAX_W);
  const introLogoH = introLogoW * LOGO_LOCKUP_ASPECT;
  const splashLogoH = splashLogoW * LOGO_LOCKUP_ASPECT;

  const logoCenterY = frameTop + (midY - 218.74) * s;
  const logoTop = logoCenterY - introLogoH / 2;

  const splashCenterY = height * 0.46;

  const logoMorphStyle = useAnimatedStyle(() => {
    const scale = interpolate(morph.value, [0, 1], [1, introLogoW / splashLogoW]);
    const centerY = interpolate(morph.value, [0, 1], [splashCenterY, logoTop + introLogoH / 2]);
    return {
      position: 'absolute',
      left: centerX - splashLogoW / 2,
      top: centerY - splashLogoH / 2,
      transform: [{ scale }],
      zIndex: 10,
    };
  });

  const collageW = 321 * s;
  const collageH = 271.493 * s;
  const collageCenterY = frameTop + (midY - 24.25) * s;
  const collageTop = collageCenterY - collageH / 2;
  const collageLeft = centerX - collageW / 2 + 2 * s;

  const mainSize = 130.955 * s;
  const mainRadius = 36.731 * s;
  const smallSize = 38.328 * s;
  const smallRadius = 11.179 * s;
  const brSize = 62.284 * s;
  const sunSize = 51.104 * s;
  const sunRadius = 15.97 * s;
  const flowerSize = 25.254 * s;
  const flowerRadius = 8.418 * s;

  /** Lowest collage art (bottom-right tile) — not full Figma collage box height. */
  const collageVisualBottom = 124.57 * s + brSize;
  const copyTop = collageTop + collageVisualBottom + 22 * s;
  const copyW = 333 * s;

  const revealLayerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(morph.value, [0.42, 0.92], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(morph.value, [0.42, 0.92], [14 * s, 0], Extrapolation.CLAMP),
      },
    ],
  }));

  const headlineSize = 28 * ts;
  const headlineLine = 34 * ts;
  const subheadSize = 15 * ts;
  const subheadLine = 21 * ts;

  const ctaBottomPad = Math.max(bottomPadding - insets.bottom, 12);

  return (
    <View style={[styles.root, { backgroundColor: FIGMA_ONBOARDING_LIME }]}>
      {!introInteractive ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Continue"
          onPress={skipSplashHold}
          style={[StyleSheet.absoluteFill, styles.splashTapLayer]}
        />
      ) : null}
      <Animated.View entering={FadeIn.duration(700)} style={StyleSheet.absoluteFill}>
        <OnboardingFigmaRadialGlow />
      </Animated.View>

      <View style={styles.contentLayer} pointerEvents={introInteractive ? 'box-none' : 'auto'}>
        <Animated.View style={logoMorphStyle}>
          <MizoraFullLogo width={splashLogoW} runnerVariant="black" />
        </Animated.View>

        <Animated.View
          style={[StyleSheet.absoluteFill, revealLayerStyle]}
          pointerEvents={introInteractive ? 'box-none' : 'none'}
        >
          <View
            style={{
              position: 'absolute',
              left: collageLeft,
              top: collageTop,
              width: collageW,
              height: collageH,
            }}
          >
            <View
              style={{
                position: 'absolute',
                left: collageW / 2 - mainSize / 2 - 1.6 * s,
                top: 19.16 * s,
              }}
            >
              <CollagePhoto
                source={onboardingFigmaCollage.mainWalk}
                width={mainSize}
                height={mainSize}
                style={{
                  borderTopRightRadius: mainRadius,
                  borderBottomLeftRadius: mainRadius,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 6.388 * s },
                  shadowOpacity: 0.05,
                  shadowRadius: 12.776 * s,
                  elevation: 4,
                }}
              />
            </View>

            <IntroCollageFloat
              enteringDelay={260}
              drift={4}
              animateEnter={false}
              style={{
                position: 'absolute',
                left: 63.88 * s,
                top: 0,
                borderRadius: sunRadius,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3.194 * s },
                shadowOpacity: 0.04,
                shadowRadius: 4.791 * s,
                elevation: 3,
              }}
            >
              <IntroIconBadge
                icon="sunny-outline"
                boxSize={sunSize}
                iconSize={24 * s}
                color="#F5C343"
                style={{ borderRadius: sunRadius }}
              />
            </IntroCollageFloat>

            <IntroCollageFloat
              enteringDelay={320}
              drift={6}
              animateEnter={false}
              style={{ position: 'absolute', left: 207.61 * s, top: -4.79 * s }}
            >
              <CollagePhoto
                source={onboardingFigmaCollage.topRight}
                width={smallSize}
                height={smallSize}
                style={{
                  borderRadius: smallRadius,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3.194 * s },
                  shadowOpacity: 0.06,
                  shadowRadius: 6.388 * s,
                  elevation: 3,
                }}
              />
            </IntroCollageFloat>

            <IntroCollageFloat
              enteringDelay={360}
              drift={5}
              animateEnter={false}
              style={{ position: 'absolute', left: 47.91 * s, top: 142.13 * s }}
            >
              <CollagePhoto
                source={onboardingFigmaCollage.bottomLeft}
                width={smallSize}
                height={smallSize}
                style={{
                  borderRadius: smallRadius,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 3.194 * s },
                  shadowOpacity: 0.06,
                  shadowRadius: 6.388 * s,
                  elevation: 3,
                }}
              />
            </IntroCollageFloat>

            <IntroCollageFloat
              enteringDelay={400}
              drift={7}
              animateEnter={false}
              style={{ position: 'absolute', left: 194.84 * s, top: 124.57 * s }}
            >
              <View
                style={{
                  width: brSize,
                  height: brSize,
                  borderTopLeftRadius: 15 * s,
                  borderTopRightRadius: 15 * s,
                  borderBottomLeftRadius: 15 * s,
                  borderBottomRightRadius: 15 * s,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 6.388 * s },
                  shadowOpacity: 0.05,
                  shadowRadius: 12.776 * s,
                  elevation: 4,
                }}
              >
                <Image
                  source={onboardingFigmaCollage.bottomRight}
                  style={{
                    position: 'absolute',
                    width: brSize * 1.1456,
                    height: brSize * 1.7184,
                    left: -brSize * 0.0459,
                    top: -brSize * 0.5379,
                  }}
                  resizeMode="cover"
                />
              </View>
            </IntroCollageFloat>

            <IntroCollageFloat
              enteringDelay={440}
              drift={3}
              animateEnter={false}
              style={{
                position: 'absolute',
                left: 244 * s,
                top: 111 * s,
                borderRadius: flowerRadius,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2.104 * s },
                shadowOpacity: 0.08,
                shadowRadius: 3.157 * s,
                elevation: 3,
              }}
            >
              <IntroIconBadge
                icon="water-outline"
                boxSize={flowerSize}
                iconSize={14 * s}
                color="#0a84ff"
                style={{ borderRadius: flowerRadius }}
              />
            </IntroCollageFloat>
          </View>

          <View
            style={{
              position: 'absolute',
              left: centerX - copyW / 2,
              top: copyTop,
              width: copyW,
              paddingBottom: ctaBottomPad,
              alignItems: 'center',
            }}
          >
            <View style={styles.copyBlock}>
              <Text style={[styles.headline, { fontSize: headlineSize, lineHeight: headlineLine }]}>
                {VALUE_COPY.title}
                {'\n'}
                {VALUE_COPY.titleAccent}
              </Text>
              <Text
                style={[
                  styles.subhead,
                  { fontSize: subheadSize, lineHeight: subheadLine, marginTop: 6 * ts },
                ]}
              >
                {VALUE_COPY.body}
              </Text>
            </View>

            <View style={{ marginTop: 4 * s, alignItems: 'center' }}>
              <OnboardingLimeCta label="Continue" onPress={onContinue} showArrow compactTop />
            </View>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  /** Tap-through splash only — must not wrap Continue (avoids nested buttons on web). */
  splashTapLayer: { zIndex: 50 },
  contentLayer: {
    ...StyleSheet.absoluteFill,
    zIndex: 2,
  },
  copyBlock: {
    alignItems: 'center',
    width: '100%',
  },
  headline: {
    fontFamily: fonts.bold,
    color: '#000000',
    textAlign: 'center',
  },
  subhead: {
    fontFamily: fonts.medium,
    color: 'rgba(0,0,0,0.72)',
    textAlign: 'center',
  },
});
