import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

import { FIGMA_ONBOARDING_LIME } from '@/constants/onboardingFigmaAssets';
import { colors, fonts } from '@/theme/tokens';

/** CTA label + arrow — always #000000 (no Pressable `disabled` opacity tint). */
const CTA_INK = colors.text.primary;

type OnboardingLimeCtaProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  showArrow?: boolean;
  fullWidth?: boolean;
  /** Tighter gap above CTA (intro copy stack). */
  compactTop?: boolean;
};

/** Pill CTA matching screen 2 intro (`Continue`). */
export function OnboardingLimeCta({
  label,
  onPress,
  disabled,
  showArrow,
  fullWidth,
  compactTop,
}: OnboardingLimeCtaProps) {
  const { width } = useWindowDimensions();
  const s = width / 393;

  const handlePress = () => {
    if (disabled) return;
    onPress();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      // Avoid RN disabled opacity (blends with lime bg → olive-looking text).
      onPress={handlePress}
      style={({ pressed }) => [
        styles.cta,
        disabled ? styles.ctaDisabled : null,
        !disabled && pressed ? styles.ctaPressed : null,
        {
          marginTop: (compactTop ? 8 : 18) * s,
          paddingHorizontal: 36 * s,
          paddingVertical: 12 * s,
          minWidth: fullWidth ? undefined : 156 * s,
          alignSelf: fullWidth ? 'stretch' : 'center',
        },
      ]}
    >
      <View style={styles.row} pointerEvents="none">
        <Text
          allowFontScaling={false}
          style={[
            styles.label,
            { fontSize: 17 * Math.min(width / 393, 1.06) * 0.94, color: CTA_INK },
          ]}
        >
          {label}
        </Text>
        {showArrow ? <Ionicons name="arrow-forward" size={20} color={CTA_INK} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cta: {
    alignSelf: 'center',
    backgroundColor: FIGMA_ONBOARDING_LIME,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.95)',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
  ctaDisabled: {
    borderColor: 'rgba(255,255,255,0.55)',
  },
  ctaPressed: {
    transform: [{ scale: 0.97 }],
  },
  label: {
    fontFamily: fonts.black,
    color: CTA_INK,
    textAlign: 'center',
    letterSpacing: 0.2,
    includeFontPadding: false,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
