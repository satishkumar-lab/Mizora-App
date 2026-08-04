/** Water detail screen — system blue accent (DS water metric). */
export const WATER_PAGE = {
  icon: '#0a84ff',
  iconBg: '#ebf7ff',
  fill: '#0a84ff',
  fillMuted: '#5eb3ff',
  surface: '#f5fbff',
  border: '#e0f0ff',
} as const;

/** Charts elsewhere still use lime; water page uses WATER_PAGE. */
export const WATER_VISUAL = {
  track: '#e5ece2',
  trackSoft: '#ebf7ff',
  fill: WATER_PAGE.fill,
  fillBright: WATER_PAGE.fillMuted,
  fillGradientTop: '#b8dfff',
  mutedSurface: '#fafbf4',
  border: '#f2f3f0',
  chipBg: WATER_PAGE.iconBg,
  chipText: WATER_PAGE.icon,
} as const;
