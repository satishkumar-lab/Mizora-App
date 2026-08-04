import type { MizoraSemanticColors } from '@/hooks/useMizoraTheme';

/** Horizontal grid lines on line charts — subtle in dark mode. */
export const CHART_GRID_LINE_OPACITY_DARK = 0.1;

export function chartGridLineStyle(isDark: boolean, colors: MizoraSemanticColors) {
  return {
    stroke: isDark ? '#ffffff' : colors.borderDivider,
    strokeOpacity: isDark ? CHART_GRID_LINE_OPACITY_DARK : 1,
    strokeWidth: 1 as const,
  };
}

/** Hairline UI dividers inside cards — match chart grid subtlety in dark mode. */
export function themedHairlineColor(isDark: boolean, colors: MizoraSemanticColors) {
  return isDark ? 'rgba(255, 255, 255, 0.1)' : colors.borderDivider;
}
