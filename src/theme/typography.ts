import type { TextStyle } from 'react-native';

import { fonts } from '@/theme/tokens';

/**
 * Satoshi typography roles — `docs/DESIGN_CONTEXT.md` §2.2.
 * Pair with semantic colors from `useMizoraTheme()` (do not hardcode theme colors here).
 *
 * Font files: `assets/fonts/Satoshi-*.ttf`
 * Verified PostScript names: Satoshi-Regular, Satoshi-Medium, Satoshi-Bold, Satoshi-Black
 */
export const mizoraType = {
  displayLarge: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 28,
  },
  headingH1: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 20,
  },
  headingH2: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
  },
  headingH3: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 18,
  },
  bodyMedium: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  bodyRegular: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  captionMedium: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 14,
  },
  captionRegular: {
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 14,
  },
  labelSmall: {
    fontFamily: fonts.regular,
    fontSize: 8,
    lineHeight: 12,
  },
  /** Section title — Medium 16px */
  sectionTitle: {
    fontFamily: fonts.medium,
    fontSize: 16,
    lineHeight: 20,
  },
  /** Card / row title — Bold 14px */
  cardTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
  },
  cardTitleCompact: {
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 17,
  },
  /** Steps ring hero — Bold 20–23px (default spacious card) */
  primaryMetricSpacious: {
    fontFamily: fonts.bold,
    fontSize: 26,
    lineHeight: 28,
  },
  primaryMetricCompact: {
    fontFamily: fonts.bold,
    fontSize: 23.4,
    lineHeight: 25.4,
  },
  primaryMetricHero: {
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 30,
  },
  /** Metric unit — Medium 12px */
  metricUnit: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  metricUnitSmall: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 14,
  },
  /** Secondary / goal copy — Medium 10px */
  secondaryCopy: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 14,
  },
  /** Tertiary / chart axis — Regular 8px */
  chartAxis: {
    fontFamily: fonts.regular,
    fontSize: 8,
    lineHeight: 12,
  },
  /** Inline links — Medium 12px */
  inlineLink: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  /** Premium chip (Mizora+) — Medium 12px */
  premiumChip: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  /** Side metric card value — Bold ~18–24px */
  sideMetricValue: {
    fontFamily: fonts.bold,
    fontSize: 18,
    lineHeight: 22,
  },
  sideMetricValueLarge: {
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 28,
  },
  /** Stats row primary number — Bold 14px */
  statsValue: {
    fontFamily: fonts.bold,
    fontSize: 14,
    lineHeight: 18,
  },
  /** Live badge — Medium 12px */
  liveBadge: {
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 16,
  },
  liveBadgeXs: {
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 14,
  },
} as const satisfies Record<string, TextStyle>;

export type MizoraTypeRole = keyof typeof mizoraType;
