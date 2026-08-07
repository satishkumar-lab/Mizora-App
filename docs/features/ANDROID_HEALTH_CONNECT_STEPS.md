# Android step tracking — Health Connect (implemented)

Mizora Android uses **Health Connect** as the authoritative source for daily and hourly steps, with the same hybrid UX as iOS: baseline reconciliation on launch/foreground/manual sync/midnight, and foreground live updates that only move the **current hour** bucket.

## Platform limitation (live updates)

iOS uses Core Motion `watchStepCount()` (steps since subscription). Health Connect has **no equivalent push callback** in `react-native-health-connect`.

While the app is **foreground**, Mizora:

1. Polls the Health Connect **Changes API** (`getChanges` for `Steps` only) on a fixed interval.
2. When upserts/deletions arrive, **debounces** (~400 ms) and re-**aggregates** today’s total (midnight → now).
3. Applies the total delta to the **current hour** only (same as iOS live delta).

This is **not** a timer that re-aggregates blindly; aggregate runs on baseline events and when Changes reports step updates. The interval applies only to `getChanges`, which is the supported sync pattern until a native data-notification bridge exists.

**Background:** Changes polling stops; totals refresh on next foreground baseline (full daily + hourly read).

## Permissions and availability

1. `getSdkStatus` → must be `SDK_AVAILABLE`.
2. `initialize()` then `requestPermission` for `{ accessType: 'read', recordType: 'Steps' }`.
3. Unavailable / denied → same degraded path as iOS (`StepsProvider` falls back to cached history).

Expo config (`app.config.js`):

- Plugin `react-native-health-connect`
- `expo-build-properties`: `minSdkVersion` 26, `compileSdkVersion` / `targetSdkVersion` 36

Rebuild required (`expo prebuild`, `expo run:android`); not supported in Expo Go.

## Source of truth

| Concern                   | Implementation                                                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Daily total               | `aggregateRecord` (`Steps`, local midnight → now)                                                                           |
| Hourly baseline           | Per-hour `aggregateRecord` for each started local hour (mirrors iOS Core Motion hour queries; runs only on baseline events) |
| Live foreground           | Changes → debounced aggregate → delta on current hour                                                                       |
| Persist / streak / unlock | Shared `StepsProvider` + `upsertTodaySteps`                                                                                 |

Code:

- `src/lib/health/healthConnectSteps.ts` — init, permissions, aggregates
- `src/lib/health/androidLiveStepTracking.ts` — lifecycle mirror of `iosLiveStepTracking.ts`
- `src/providers/StepsProvider.tsx` — iOS + Android live trackers

## Testing

- Physical device with Health Connect and step permission granted.
- Walk with app open; UI should update within a few seconds of Health Connect receiving steps (depends on contributing app sync).
- Background, walk, foreground: total matches Health Connect without double-count.
- Midnight with app open: today resets via scheduled resync.

## Out of scope

- Writing steps to Health Connect.
- Background tracking / widgets.
- Play Console Health Connect declaration (required for Play release).
