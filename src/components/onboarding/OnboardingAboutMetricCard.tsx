import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { OnboardingGlassSurface } from '@/components/onboarding/OnboardingGlassSurface';
import { ONBOARDING_ANDROID_CARD } from '@/constants/onboardingFigmaAssets';
import { OnboardingHorizontalRuler } from '@/components/onboarding/OnboardingHorizontalRuler';
import { fonts } from '@/theme/tokens';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

type UnitMode = 'primary' | 'secondary';

type OnboardingAboutMetricCardProps = {
  title: string;
  subtitle: string;
  icon: IoniconName;
  iconTint: string;
  /** Stored canonical string (cm or kg). */
  canonicalValue: string;
  onCanonicalChange: (value: string) => void;
  primaryUnit: string;
  secondaryUnit: string;
  primaryMin: number;
  primaryMax: number;
  primaryStep?: number;
  secondaryMin: number;
  secondaryMax: number;
  secondaryStep?: number;
  toSecondary: (primary: number) => number;
  toPrimary: (secondary: number) => number;
  formatPrimary: (n: number) => string;
  formatSecondary: (n: number) => string;
  keyboardType?: 'number-pad' | 'decimal-pad';
  decimals?: number;
};

export function OnboardingAboutMetricCard({
  title,
  subtitle,
  icon,
  iconTint,
  canonicalValue,
  onCanonicalChange,
  primaryUnit,
  secondaryUnit,
  primaryMin,
  primaryMax,
  primaryStep = 1,
  secondaryMin,
  secondaryMax,
  secondaryStep = 1,
  toSecondary,
  toPrimary,
  formatPrimary,
  formatSecondary,
  keyboardType = 'number-pad',
  decimals = 0,
}: OnboardingAboutMetricCardProps) {
  const [unitMode, setUnitMode] = useState<UnitMode>('primary');

  const primaryNum = parseFloat(canonicalValue.replace(',', '.'));
  const safePrimary = Number.isFinite(primaryNum) ? primaryNum : primaryMin;

  const displayValue = useMemo(() => {
    if (unitMode === 'primary') return safePrimary;
    return toSecondary(safePrimary);
  }, [safePrimary, toSecondary, unitMode]);

  const rulerMin = unitMode === 'primary' ? primaryMin : secondaryMin;
  const rulerMax = unitMode === 'primary' ? primaryMax : secondaryMax;
  const rulerStep = unitMode === 'primary' ? primaryStep : secondaryStep;

  const unitLabel = unitMode === 'primary' ? primaryUnit : secondaryUnit;

  const setFromRuler = (display: number) => {
    const canonical = unitMode === 'primary' ? display : toPrimary(display);
    const formatted =
      decimals > 0
        ? canonical.toFixed(decimals).replace(/\.?0+$/, '')
        : String(Math.round(canonical));
    onCanonicalChange(formatted);
  };

  const onChangeText = (text: string) => {
    onCanonicalChange(text);
  };

  const onBlur = () => {
    const parsed = parseFloat(canonicalValue.replace(',', '.'));
    if (!Number.isFinite(parsed)) return;
    const clamped = Math.min(primaryMax, Math.max(primaryMin, parsed));
    const formatted =
      decimals > 0 ? clamped.toFixed(decimals).replace(/\.?0+$/, '') : String(Math.round(clamped));
    onCanonicalChange(formatted);
  };

  const displayForInput =
    unitMode === 'primary' ? canonicalValue : formatSecondary(toSecondary(safePrimary));

  return (
    <OnboardingGlassSurface style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <View style={[styles.iconBubble, { backgroundColor: iconTint }]}>
            <Ionicons name={icon} size={18} color="#141c12" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
          </View>
        </View>
        <View style={styles.unitToggle}>
          <Pressable
            accessibilityRole="button"
            onPress={() => setUnitMode('primary')}
            style={[styles.unitPill, unitMode === 'primary' && styles.unitPillActive]}
          >
            <Text style={[styles.unitText, unitMode === 'primary' && styles.unitTextActive]}>
              {primaryUnit}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => setUnitMode('secondary')}
            style={[styles.unitPill, unitMode === 'secondary' && styles.unitPillActive]}
          >
            <Text style={[styles.unitText, unitMode === 'secondary' && styles.unitTextActive]}>
              {secondaryUnit}
            </Text>
          </Pressable>
        </View>
      </View>

      <OnboardingHorizontalRuler
        min={rulerMin}
        max={rulerMax}
        step={rulerStep}
        value={Math.min(rulerMax, Math.max(rulerMin, displayValue))}
        onChange={setFromRuler}
        majorEvery={unitMode === 'primary' && primaryUnit === 'cm' ? 10 : 5}
        formatLabel={(n) => String(Math.round(n))}
      />

      <View style={styles.valueRow}>
        <TextInput
          value={unitMode === 'primary' ? canonicalValue : displayForInput}
          onChangeText={(t) => {
            if (unitMode === 'primary') {
              onChangeText(t);
              return;
            }
            const sec = parseFloat(t.replace(',', '.'));
            if (!Number.isFinite(sec)) {
              onChangeText('');
              return;
            }
            const canonical = toPrimary(sec);
            onChangeText(
              decimals > 0
                ? canonical.toFixed(decimals).replace(/\.?0+$/, '')
                : String(Math.round(canonical)),
            );
          }}
          onBlur={onBlur}
          keyboardType={keyboardType}
          style={styles.valueInput}
          maxLength={6}
        />
        <Text style={styles.valueUnit}>{unitLabel}</Text>
      </View>
    </OnboardingGlassSurface>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  cardTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 17,
    color: '#141c12',
  },
  cardSubtitle: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: 'rgba(20,28,18,0.55)',
    marginTop: 2,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: Platform.OS === 'android' ? '#F3F0DC' : 'rgba(255,255,255,0.55)',
    borderRadius: 100,
    padding: 3,
    borderWidth: Platform.OS === 'android' ? ONBOARDING_ANDROID_CARD.borderWidth : 1,
    borderColor:
      Platform.OS === 'android' ? ONBOARDING_ANDROID_CARD.border : 'rgba(255,255,255,0.8)',
  },
  unitPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 100,
  },
  unitPillActive: {
    backgroundColor: '#141c12',
  },
  unitText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: 'rgba(20,28,18,0.55)',
  },
  unitTextActive: {
    color: '#FFFFFF',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  valueInput: {
    fontFamily: fonts.bold,
    fontSize: 42,
    color: '#141c12',
    minWidth: 88,
    textAlign: 'center',
    paddingVertical: 0,
  },
  valueUnit: {
    fontFamily: fonts.medium,
    fontSize: 18,
    color: 'rgba(20,28,18,0.45)',
    marginBottom: 6,
  },
});
