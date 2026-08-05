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
export const LOCK_CHALLENGE_HREF = '/rewards' as const;
