import { useColorScheme } from 'nativewind';
import { useMemo } from 'react';

import { colors as lightTokens } from '@/theme/tokens';

export type MizoraSemanticColors = {
  bg: string;
  card: string;
  cardShell: string;
  surfaceSecondary: string;
  surfaceMuted: string;
  text: string;
  textStrong: string;
  textSecondary: string;
  textMuted: string;
  textAccentGreen: string;
  border: string;
  borderDivider: string;
  backButtonBg: string;
  backButtonBorder: string;
  backButtonIcon: string;
  iconBadgeBg: string;
  iconBadgeBorder: string;
  navPillBg: string;
  navPillBorder: string;
  track: string;
  insightBannerBg: string;
  popoverBg: string;
};

const light: MizoraSemanticColors = {
  bg: lightTokens.surface.background,
  card: lightTokens.surface.card,
  cardShell: lightTokens.accent.shell,
  surfaceSecondary: lightTokens.surface.secondary,
  surfaceMuted: lightTokens.surface.muted,
  text: lightTokens.text.primary,
  textStrong: lightTokens.text.strong,
  textSecondary: lightTokens.text.secondary,
  textMuted: lightTokens.text.muted,
  textAccentGreen: lightTokens.text.accentGreen,
  border: lightTokens.border.default,
  borderDivider: lightTokens.border.divider,
  backButtonBg: lightTokens.surface.secondary,
  backButtonBorder: '#ebefea',
  backButtonIcon: '#626b5e',
  iconBadgeBg: lightTokens.surface.secondary,
  iconBadgeBorder: '#ebefea',
  navPillBg: '#ffffff',
  navPillBorder: '#f2f2f7',
  track: lightTokens.surface.greenTint,
  insightBannerBg: lightTokens.surface.muted,
  popoverBg: '#ffffff',
};

const dark: MizoraSemanticColors = {
  bg: '#0f1410',
  card: '#1c2319',
  cardShell: '#141a14',
  surfaceSecondary: '#252d25',
  surfaceMuted: '#1a2118',
  text: '#f4f6f3',
  textStrong: '#f4f6f3',
  textSecondary: '#c7cfc4',
  textMuted: '#8e9389',
  textAccentGreen: '#d6ff92',
  border: '#2a332a',
  borderDivider: '#2a332a',
  backButtonBg: 'rgba(255, 255, 255, 0.08)',
  backButtonBorder: 'rgba(255, 255, 255, 0.12)',
  backButtonIcon: '#d6ff92',
  iconBadgeBg: 'rgba(255, 255, 255, 0.08)',
  iconBadgeBorder: 'rgba(255, 255, 255, 0.12)',
  navPillBg: '#1c2319',
  navPillBorder: '#2a332a',
  track: '#2a332a',
  insightBannerBg: '#1a2118',
  popoverBg: '#1c2319',
};

export function useMizoraTheme() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = useMemo(() => (isDark ? dark : light), [isDark]);
  return { isDark, colors };
}
