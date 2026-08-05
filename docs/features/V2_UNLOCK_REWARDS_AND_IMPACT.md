# V2: Unlock Rewards, Lock Challenge & Unlock Impact

**Status:** Built in repo, **hidden for Mizora V1** (`UNLOCK_REWARDS_V2_ENABLED = false` in `src/constants/productScope.ts`).

This document preserves the full product + engineering picture so we can ship the feature again without redesigning from scratch.

**Visual reference (saved Aug 2026):** `docs/features/assets/unlock-impact-v2-reference.png`

---

## Why this matters

V1 ships steps, water, goals, streaks, and a **locked preview** on Home (`UnlockRewardsLockedPreview`) — no functional app lock or screen-time accounting.

The **Unlock impact** dashboard was the emotional payoff of the lock system: weekly screen time saved, walk-for-apps charts, and per-app unlock rows. It should return intact in V2.

---

## User-facing surfaces (V2)

### 1. Home — Unlock Rewards (live list)

| Piece                 | Location                                                       |
| --------------------- | -------------------------------------------------------------- |
| Section title         | `UnlockRewardsSection`                                         |
| App rows + progress   | `UnlockRewardsListCard`                                        |
| Footer                | “Manage blocked apps” → `/rewards`                             |
| **View all / impact** | Historically tied to **FAB (+)** and weekly report (see below) |

V1 shows only `UnlockRewardsLockedPreview` (blur teaser + Coming Soon).

### 2. Bottom nav — lime **+ FAB**

- Component: `src/components/home/MainNav.tsx`
- Default action: navigate to **`/rewards/impact`**
- FAB “primary” stack: any path under `/rewards/*` (tab pill hidden while there)

V1: FAB not rendered when `UNLOCK_REWARDS_V2_ENABLED` is false.

### 3. **Unlock impact** screen (hero product page)

| Route | `app/(main)/rewards/impact.tsx` |
| Screen | `src/screens/UnlockImpactScreen.tsx` |
| Title | “Unlock impact” |
| Header | Back + unlock metric badge (key icon) |

**Card stack (top → bottom):**

1. **`UnlockImpactHeroCard`**
   - “Weekly unlock impact” + Live badge
   - Subtitle: `{n} apps · ↑ {pct}% vs last week`
   - **`UnlockScreenTimeArcRing`**: arc gauge — minutes saved vs weekly goal
   - Stat row: Unlock steps · Walk time · Save goal %

2. **`UnlockImpactWeekChartCard`**
   - “This week” — “Which apps you walk for most”
   - Mode chips: **Steps** | **Screen saved**
   - Week **`CalendarDayPill`** row (Mon–Sun)
   - SVG line/area chart + selected-day highlight bar
   - Summary line: e.g. “screen saved · Wed · mostly Instagram”
   - “Main unlock app · each day” — Instagram icons per weekday

3. **`UnlockImpactLockedAppsCard`**
   - Per locked app weekly steps / today status
   - Tap → `/rewards/[appId]`

4. **`UnlockImpactMethodologyCard`**
   - Explains steps → walk time → screen time saved formula

### 4. Lock Challenge (manage apps)

| Route | `app/(main)/rewards/index.tsx` → `BlockedAppsManageScreen` |
| Profile | Profile → “Lock Challenge” → `/rewards` |

### 5. Per-app reward detail

| Route | `app/(main)/rewards/[appId].tsx` → `RewardAppDetailScreen` |

### 6. Notifications — Weekly report

- `WeeklyReportInboxCard` on `NotificationsScreen`
- Opens **`/rewards/impact`** (same dashboard as FAB)

### 7. Steps detail — “Unlock impact” nudge

- `StepsDetailScreen` → `UnlockNudgeCard` under section “Unlock impact” (mock `ACTIVE_STEP_UNLOCK` in V2-era build)

---

## Data & state (already wired)

| Concern                            | Files                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------- |
| Unlock configs / app list          | `UnlockRewardsProvider`, `src/lib/unlock-rewards-storage.ts`              |
| Impact week logging                | `src/lib/unlock-impact-storage.ts`                                        |
| Aggregations & chart math          | `src/lib/unlockImpactStats.ts`                                            |
| Week shape & app order             | `src/constants/unlockImpactWeek.ts`                                       |
| Home preview notify-me             | `src/lib/unlock-preview-notify-storage.ts`                                |
| Personalization (lock suggestions) | `PersonalizationProvider` (still mounted in V1; suggestions unused in UI) |

---

## File inventory (do not delete for V2)

```
app/(main)/rewards/impact.tsx
app/(main)/rewards/index.tsx
app/(main)/rewards/[appId].tsx
src/screens/UnlockImpactScreen.tsx
src/screens/BlockedAppsManageScreen.tsx
src/screens/RewardAppDetailScreen.tsx
src/components/home/UnlockRewardsListCard.tsx
src/components/home/UnlockRewardsLockedPreview.tsx   # V1 preview only
src/components/unlock/impact/*
src/lib/unlockImpactStats.ts
src/lib/unlock-impact-storage.ts
src/constants/unlockImpactWeek.ts
src/components/v2/V2UnlockRouteGuard.tsx
```

---

## Re-enable for V2 (checklist)

1. Set `UNLOCK_REWARDS_V2_ENABLED = true` in `src/constants/productScope.ts`.
2. Restore Home list: in `UnlockRewardsSection`, swap preview for `UnlockRewardsListCard` + optional “View all” → impact (pattern from git history).
3. Verify FAB, Profile → Lock Challenge, Weekly report, and `/rewards/*` deep links.
4. Finish native **Screen Time / app lock** integration (out of scope for V1).
5. Align copy in `helpFaq.ts`, `ProfileAboutScreen`, and store listings with live lock behavior.
6. Run through impact with real step completions via `recordUnlockStepCompletion` in `UnlockRewardsProvider`.

---

## V1 behavior (current)

- Routes under `/rewards/*` **redirect to Home** via `V2UnlockRouteGuard`.
- FAB, Weekly report card, Profile Lock Challenge row, and Steps unlock nudge are **hidden** when the flag is false.
- Providers remain mounted so re-enabling is mostly UI + flag + native lock work.
