/** Fixed nav row height (FAB / pill). */
export const MAIN_TAB_BAR_HEIGHT = 61;

/** Space reserved above the fixed bottom tab bar (pill + FAB + breathing room). */
export const MAIN_TAB_BAR_CLEARANCE = 100;

/** Bottom inset for sticky footers sitting above the tab bar. */
export function mainTabBarFooterInset(safeBottom: number): number {
  return Math.max(safeBottom, 16) + MAIN_TAB_BAR_HEIGHT + 12;
}
