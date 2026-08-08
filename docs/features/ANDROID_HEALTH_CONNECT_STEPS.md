# Android step tracking — Health Connect (V1 production)

On Android, **the source of truth for step counts is the user’s device health data** (steps recorded on the phone and contributed by apps the user already uses, such as Samsung Health or Google Fit). Mizora reads that data through **Google Health Connect as the transport layer only** — not as the canonical store. Implementation follows Google’s recommended pattern: **SDK availability → `initialize()` → READ_STEPS permission → `aggregateRecord` for totals** and **Changes API polling while foreground** for live updates.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Device health data (OEM / fitness apps → aggregated steps) │
│  Source of truth — what the user actually walked today      │
└───────────────────────────┬─────────────────────────────────┘
                            │ sync into platform store
┌───────────────────────────▼─────────────────────────────────┐
│ Health Connect (transport)                                   │
│  READ_STEPS aggregates; Changes API while foreground         │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│ UI (Home, Steps, Streak)                                     │
│  stepsTrackingUi — user copy (“Allow step tracking”)         │
│  shouldShowHomeStepsPermissionCard — denied only               │
│  AndroidStepTrackingSetupSheet — install/update (one-time)   │
└───────────────────────────┬─────────────────────────────────┘
                            │ useSteps() / runStepsSetupAction
┌───────────────────────────▼─────────────────────────────────┐
│ StepsProvider                                                │
│  iOS: iosLiveStepTracking                                    │
│  Android: androidLiveStepTracking + AppState resume          │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│ androidLiveStepTracking                                      │
│  Baseline: daily + hourly aggregate (local midnight → now)   │
│  Foreground: getChanges(Steps) → debounced re-aggregate      │
│  Midnight / foreground / manual: full baseline resync        │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│ healthConnectSteps                                           │
│  getSdkStatus → provider_install | provider_update | ready   │
│  ensureActivityRecognitionPermission (API 29+, when requesting)│
│  initialize → getGrantedPermissions → requestPermission      │
│  aggregateRecord (COUNT_TOTAL) — no double-count             │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│ androidHealthConnectInstall / androidStepPermissionAutoRequest│
│  Play Store deep link (com.google.android.apps.healthdata)   │
│  One-time install prompt flag; auto permission attempt once    │
└─────────────────────────────────────────────────────────────┘
```

### Tracking states (`StepsTrackingStatus`)

| Status                  | Meaning                                      | Home UI                                                          |
| ----------------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| `loading` / `pending`   | Probing or awaiting permission sheet         | Steps ring + “Syncing” (dashboard, not a setup wizard)           |
| `ready`                 | READ_STEPS granted, aggregates OK            | Live ring + chart                                                |
| `denied`                | User denied activity or HC read              | “Enable step tracking” permission card                           |
| `provider_install`      | HC transport app missing (`SDK_UNAVAILABLE`) | **Modal bottom sheet** → Play Store; Home stays dashboard        |
| `provider_update`       | HC transport update required                 | Same one-time sheet → Play Store                                 |
| `unavailable` / `error` | Unsupported or transient error               | Ring + badge (“Unsupported” / “Paused”); detail screen for retry |

Home is never a permanent install/update wizard. Only **explicit deny** gets a persistent permission card on the dashboard.

### Permissions

1. **ACTIVITY_RECOGNITION** (Android 10+): requested only when Mizora is about to show the step permission flow (`requestPermission: true`), with plain-language rationale.
2. **Health Connect READ_STEPS**: requested via `requestPermission([{ accessType: 'read', recordType: 'Steps' }])` — read access to device step aggregates via the transport layer; no write, no background access in V1.

### Live updates (foreground)

Health Connect has no JS push API. While **active**, Mizora polls **`getChanges`** for `Steps` only; on upserts/deletions it debounces and re-runs **`aggregateRecord`** for today, then applies delta to the **current hour** bucket (same model as iOS).

### Install / update flow

- `SDK_UNAVAILABLE` → `provider_install` → **`AndroidStepTrackingSetupSheet`** opens once; primary action opens Play Store (install prompt stored once in AsyncStorage).
- Returning to the app clears the HC init cache, sets `requestPermission` for the next sync, and runs baseline → permission sheet if the transport layer is now available.
- `SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED` → `provider_update` → same sheet → Play Store update, same resume behavior.
- User can tap **Not now** and use Home normally (cached/offline steps UI); sheet can appear again on a later session until setup completes.

## Code map

| File                                      | Role                                  |
| ----------------------------------------- | ------------------------------------- |
| `healthConnectSteps.ts`                   | SDK status, init, aggregates          |
| `androidLiveStepTracking.ts`              | Lifecycle + Changes loop              |
| `androidActivityRecognitionPermission.ts` | Runtime activity permission           |
| `androidHealthConnectInstall.ts`          | Play Store + install prompt flag      |
| `androidStepPermissionAutoRequest.ts`     | One automatic permission attempt      |
| `stepsTrackingUi.ts`                      | Copy + home card gating (denied only) |
| `AndroidStepTrackingSetupSheet.tsx`       | One-time install/update modal         |
| `StepsProvider.tsx`                       | `runStepsSetupAction`, resume sync    |

## Test matrix

**Legend:** ✓ = must pass on physical device · HC = Health Connect (transport) · AR = Activity Recognition

### By Android version

| Scenario                                                    | 10 (Q) | 11  | 12  | 13  | 14   | 15   | 16*  |
| ----------------------------------------------------------- | ------ | --- | --- | --- | ---- | ---- | ---- |
| First launch → auto permission attempt                      | ✓      | ✓   | ✓   | ✓   | ✓    | ✓    | ✓    |
| HC already installed → READ_STEPS grant → dashboard live    | ✓      | ✓   | ✓   | ✓   | ✓†   | ✓†   | ✓†   |
| HC missing → sheet → Play Store → return → auto continue    | ✓      | ✓   | ✓   | ✓   | n/a† | n/a† | n/a† |
| HC update required → sheet → Play Store → return            | ✓      | ✓   | ✓   | ✓   | ✓    | ✓    | ✓    |
| Deny AR or READ_STEPS → “Enable step tracking” card on Home | ✓      | ✓   | ✓   | ✓   | ✓    | ✓    | ✓    |
| Reinstall app → permission flow                             | ✓      | ✓   | ✓   | ✓   | ✓    | ✓    | ✓    |
| Background walk → foreground refresh                        | ✓      | ✓   | ✓   | ✓   | ✓    | ✓    | ✓    |
| App kill → relaunch baseline                                | ✓      | ✓   | ✓   | ✓   | ✓    | ✓    | ✓    |
| Home: no permanent install/update card on dashboard         | ✓      | ✓   | ✓   | ✓   | ✓    | ✓    | ✓    |
| Steps match device total via HC aggregate (no double count) | ✓      | ✓   | ✓   | ✓   | ✓    | ✓    | ✓    |

† Android 14+: HC often built into system; `SDK_UNAVAILABLE` install path may not appear — use permission + aggregate paths instead.

\* Android 16: validate on preview hardware when available; same code path as 15.

### By OEM (representative devices)

| OEM                   | Device class        | HC install path | Permission + live steps | Notes                           |
| --------------------- | ------------------- | --------------- | ----------------------- | ------------------------------- |
| Google Pixel          | Reference           | ✓               | ✓                       | Baseline                        |
| Samsung               | Galaxy A/S          | ✓               | ✓                       | Samsung Health → HC sync        |
| Xiaomi / Redmi / Poco | MIUI / HyperOS      | ✓               | ✓                       | Install HC from Play if missing |
| OnePlus               | OxygenOS            | ✓               | ✓                       |                                 |
| Oppo / Realme         | ColorOS             | ✓               | ✓                       |                                 |
| Vivo                  | Funtouch / OriginOS | ✓               | ✓                       |                                 |
| Motorola              | Stock-like          | ✓               | ✓                       |                                 |
| Nothing               |                     | ✓               | ✓                       |                                 |
| Nokia                 | Android One / close | ✓               | ✓                       |                                 |

### Manual test checklist (each release)

1. Permission flow (grant / deny / retry / Settings).
2. First install (no HC → sheet → store → return).
3. Reinstall Mizora.
4. HC already installed, first open.
5. HC update banner in Play (force `provider_update` if possible).
6. Background resume after walk.
7. Cold start after force-stop.
8. Pull-to-refresh / tab focus sync on Home and Steps.
9. Copy audit: Home shows permission card only after deny; install/update uses sheet only.

## Build requirements

- `react-native-health-connect` Expo config plugin
- `minSdkVersion` 26+ (project uses 26)
- **Not** Expo Go — dev client or release build
- Play Console Health Connect data declaration before production

## Out of scope (V1)

- Writing steps to HC
- Background delivery / widgets
- Google Fit API
