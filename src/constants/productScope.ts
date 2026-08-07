/**
 * Mizora V1 vs V2 product scope.
 *
 * V1: steps, water, goals, streaks, dashboard — no functional app lock / screen time.
 * V2: unlock rewards list, lock challenge, unlock impact dashboard.
 *
 * Archive + restore checklist: docs/features/V2_UNLOCK_REWARDS_AND_IMPACT.md
 */
export const UNLOCK_REWARDS_V2_ENABLED = false;

export const UNLOCK_IMPACT_HREF = '/rewards/impact' as const;
export const WEEKLY_REPORT_HREF = '/weekly-report' as const;
export const LOCK_CHALLENGE_HREF = '/rewards' as const;

/** Where the inbox weekly card opens in the current product scope. */
export function weeklyReportHref(): typeof UNLOCK_IMPACT_HREF | typeof WEEKLY_REPORT_HREF {
  return UNLOCK_REWARDS_V2_ENABLED ? UNLOCK_IMPACT_HREF : WEEKLY_REPORT_HREF;
}
