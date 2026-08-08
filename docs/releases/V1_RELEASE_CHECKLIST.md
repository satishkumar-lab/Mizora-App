# Mizora V1 — Release Checklist

**Target version:** `1.0.0` (`app.json` / `package.json`)  
**Bundle IDs:** `app.mizora.mobile` (iOS + Android)  
**Health module:** Frozen for V1 — do not modify unless a confirmed production bug.  
**Product scope:** `src/constants/productScope.ts` (`UNLOCK_REWARDS_V2_ENABLED = false`, `WEEKLY_HEALTH_REPORT_ENABLED = true`)

**Status legend:** ☐ Not Started · ◐ In Progress · ☑ Complete

---

## 1. App functionality

Manual QA on **physical devices** (simulators/emulators are supplementary). Sign off each row on both platforms where applicable.

### 1.1 Shared flows (iOS + Android)

| Status | Area                       | What to verify                                                                                             |
| ------ | -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| ☐      | **Cold launch**            | App loads fonts/splash, routes to onboarding or home based on completion flag.                             |
| ☐      | **Onboarding**             | Full slide flow completes; lands on home; not shown again after completion.                                |
| ☐      | **Main navigation**        | Home, Daily progress (Steps), Streak, Notifications tabs; Profile avatar entry.                            |
| ☐      | **Home dashboard**         | Step/water/calorie overview; quick actions; personalization insight (no unlock section in V1).             |
| ☐      | **Daily progress (Steps)** | Today total, goal ring, hourly chart, week selector; permission card when tracking unavailable.            |
| ☐      | **Step goal**              | Profile → Daily step goal and `/steps/goal`; changes persist and reflect on home/steps.                    |
| ☐      | **Water tracker**          | `/water` — log/remove glasses; goal; hourly distribution; syncs with home water display.                   |
| ☐      | **Calories detail**        | `/calories` — week view; copy states estimates from steps.                                                 |
| ☐      | **Streak calendar**        | Streak UI, month navigation, ties to step history.                                                         |
| ☐      | **Achievements**           | `/streak/achievements` — V1 achievement set only (no V2-only monthly unlock/water roster badges).          |
| ☐      | **Notifications inbox**    | Feed sections; weekly report card opens `/weekly-report`; mark-read behavior.                              |
| ☐      | **Weekly report**          | Hero totals (steps, est. kcal, water); peak walk (or honest empty state); steps/water/calorie week charts. |
| ☐      | **Profile hub**            | Health profile, goals, notifications prefs, personalization, appearance (light/dark).                      |
| ☐      | **Permissions screen**     | Accurate V1 copy (Motion / Health Connect; no screen-time lock).                                           |
| ☐      | **Privacy & data**         | Summary matches V1 behavior.                                                                               |
| ☐      | **Delete data on device**  | Flow completes; understand partial clear per in-app/help FAQ.                                              |
| ☐      | **Help & FAQ**             | Entries match V1 (no push delivery claims).                                                                |
| ☐      | **About**                  | Version matches build.                                                                                     |
| ☐      | **Legal (in-app)**         | Privacy Policy + Terms render from `legalDocuments.ts`.                                                    |
| ☐      | **Deep links / V2 routes** | `/rewards`, `/rewards/impact`, etc. redirect to home when V2 off (production build).                       |
| ☐      | **Dark mode**              | Theme toggle; readable contrast on primary screens.                                                        |
| ☐      | **Offline / airplane**     | No crash; cached AsyncStorage data; steps may stall until connectivity/permission restored.                |

### 1.2 iOS-only manual tests

| Status | Area                         | What to verify                                                                                         |
| ------ | ---------------------------- | ------------------------------------------------------------------------------------------------------ |
| ☐      | **Motion permission**        | First launch / retry prompts; `NSMotionUsageDescription` matches UX.                                   |
| ☐      | **Deny Motion**              | Steps show unavailable state; water/profile still usable; weekly report steps gated honestly.          |
| ☐      | **Grant Motion later**       | Settings → enable Motion → in-app “Try again” restores live steps.                                     |
| ☐      | **Live step updates**        | Foreground walk increases count; hourly chart updates.                                                 |
| ☐      | **Midnight rollover**        | Open app across local midnight (or next-day open): today resets; week chart rolls; water day boundary. |
| ☐      | **iPad (if listing tablet)** | `supportsTablet: true` — layout usable on tablet form factor.                                          |
| ☐      | **Background → foreground**  | Steps resync; water week totals refresh.                                                               |

### 1.3 Android-only manual tests

| Status | Area                                    | What to verify                                                                        |
| ------ | --------------------------------------- | ------------------------------------------------------------------------------------- |
| ☐      | **Health Connect**                      | Install/update Health Connect if needed; Mizora permission flow succeeds.             |
| ☐      | **ACTIVITY_RECOGNITION**                | Declared in manifest via config; user can grant/deny.                                 |
| ☐      | **Deny Health Connect**                 | Same degraded behavior as iOS deny; retry path works.                                 |
| ☐      | **Health Connect change notifications** | Steps update when HC data changes (foreground/poll path).                             |
| ☐      | **minSdk 26+ device**                   | App installs; no crash on unsupported HC devices (clear messaging).                   |
| ☐      | **Midnight rollover**                   | Same as iOS for steps, water, weekly report week boundary.                            |
| ☐      | **Back gesture**                        | `predictiveBackGestureEnabled: false` — navigation matches design (no broken stacks). |

---

## 2. Store readiness

### 2.1 App Store (Apple)

| Status | Item                               | Notes                                                                                 |
| ------ | ---------------------------------- | ------------------------------------------------------------------------------------- |
| ☐      | **Apple Developer Program**        | Active enrollment; Team ID `XWG4778372` in config (or env override).                  |
| ☐      | **App Store Connect app record**   | Bundle ID `app.mizora.mobile`.                                                        |
| ☐      | **App Privacy (Nutrition Labels)** | Declare health/fitness (steps), on-device storage, no tracking for ads as per policy. |
| ☐      | **Age rating**                     | Complete questionnaire (health/fitness, no unrestricted web).                         |
| ☐      | **Export compliance**              | Standard encryption questionnaire (Expo default).                                     |
| ☐      | **Review notes**                   | Test account / steps permission steps for reviewer.                                   |
| ☑      | **Privacy Policy URL**             | `https://website-chi-red-98.vercel.app/privacy` — must match in-app policy.           |
| ☑      | **Support URL / contact**          | `https://website-chi-red-98.vercel.app/support`                                       |

### 2.2 Google Play

| Status | Item                           | Notes                                                                    |
| ------ | ------------------------------ | ------------------------------------------------------------------------ |
| ☐      | **Play Console app**           | Package `app.mizora.mobile`.                                             |
| ☐      | **Data safety form**           | Steps/health data, on-device storage, collection/sharing accurate to V1. |
| ☐      | **Health Connect declaration** | Permissions align with `react-native-health-connect` plugin usage.       |
| ☐      | **Content rating**             | IARC questionnaire complete.                                             |
| ☐      | **Target API**                 | `targetSdkVersion: 36` via `expo-build-properties` in `app.config.js`.   |
| ☐      | **Privacy Policy URL**         | Required — same hosted URL as iOS.                                       |
| ☐      | **App access**                 | Instructions if login not required (none for V1).                        |

### 2.3 Privacy Policy & Terms of Service

| Status | Item                                 | Notes                                                                                                        |
| ------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| ☑      | **In-app Privacy Policy**            | `src/constants/legalDocuments.ts` + `/privacy` route.                                                        |
| ☑      | **In-app Terms of Service**          | `src/constants/legalDocuments.ts` + `/terms` route.                                                          |
| ☑      | **Last updated date**                | August 8, 2026 in legal documents.                                                                           |
| ☑      | **Public web URLs**                  | `src/constants/legal.ts` → `https://website-chi-red-98.vercel.app/privacy` and `/terms` — verify in browser. |
| ☐      | **Store listing ↔ in-app alignment** | No claims for push, app lock, or cloud sync that V1 does not provide.                                        |

### 2.4 Permissions (declarations vs product)

| Status | Platform | Permission / usage         | V1 use                                                                           |
| ------ | -------- | -------------------------- | -------------------------------------------------------------------------------- |
| ☑      | iOS      | Motion & Fitness           | Step count, hourly activity (`NSMotionUsageDescription` in `app.json`).          |
| ☑      | Android  | Activity recognition       | Step tracking pipeline.                                                          |
| ☑      | Android  | Health Connect             | Read steps via `react-native-health-connect` plugin.                             |
| ☑      | Both     | Notifications (OS)         | V1: preferences only; **no push delivery** — do not over-declare in store forms. |
| ☑      | V1 scope | No app usage / screen time | Not required; legal and Profile copy state this.                                 |

### 2.5 App icons & splash

| Status | Asset                     | Path / config                                                              |
| ------ | ------------------------- | -------------------------------------------------------------------------- |
| ☑      | **iOS icon**              | `assets/images/icon.png` → `expo.icon`                                     |
| ☑      | **Android adaptive icon** | foreground / background / monochrome in `app.json`                         |
| ☑      | **Splash**                | `expo-splash-screen` plugin — `splash-icon.png`, `#ffffff` background      |
| ☐      | **Store marketing icon**  | Re-use or export 1024×1024 for Apple; Play high-res icon per console spec. |

### 2.6 Screenshots & store copy

| Status | Item                                | Notes                                                             |
| ------ | ----------------------------------- | ----------------------------------------------------------------- |
| ☐      | **iPhone screenshots**              | 6.7" / 6.5" (and others per Apple requirements).                  |
| ☐      | **iPad screenshots**                | If distributing for iPad.                                         |
| ☐      | **Android phone screenshots**       | Phone + optional 7" tablet if listed.                             |
| ☐      | **Feature graphic (Play)**          | 1024×500.                                                         |
| ☐      | **Short description (Play)**        | ≤ 80 chars.                                                       |
| ☐      | **Full description (Play + Apple)** | Steps, water, streaks, weekly report; no V2 unlock/lock promises. |
| ☐      | **Subtitle / keywords (Apple)**     | Health, habits, steps, water.                                     |
| ☐      | **Promotional text**                | Optional; keep V1-accurate.                                       |

---

## 3. Build & release

Reference: `docs/STORE_RELEASE.md`, `eas.json`, `app.config.js`.

### 3.1 EAS configuration

| Status | Item                        | Notes                                                                    |
| ------ | --------------------------- | ------------------------------------------------------------------------ |
| ☑      | **`eas.json` profiles**     | `development`, `preview` (APK internal), `production` (AAB + iOS store). |
| ☑      | **Production Android**      | `buildType: app-bundle`.                                                 |
| ☑      | **Versioning**              | `appVersionSource: remote`, `autoIncrement: true` on production.         |
| ☐      | **`eas init` / project ID** | Confirm `extra.eas.projectId` committed after linking Expo project.      |
| ☐      | **Expo account & secrets**  | Apple credentials / ASC API key; Play service account JSON for submit.   |
| ☐      | **iOS signing**             | Certificates/profiles (`withIosAutomaticSigning` plugin); team ID valid. |

### 3.2 Production builds

| Status | Item                               | Command / artifact                                                     |
| ------ | ---------------------------------- | ---------------------------------------------------------------------- |
| ☐      | **Android production build**       | `eas build --platform android --profile production` → `.aab`           |
| ☐      | **iOS production build**           | `eas build --platform ios --profile production` → `.ipa`               |
| ☐      | **Smoke test production binaries** | Install from EAS artifact; repeat §1 critical paths.                   |
| ☐      | **Version bump process**           | Document when to change `expo.version` vs build number auto-increment. |

### 3.3 TestFlight (iOS)

| Status | Item                    | Notes                                                                     |
| ------ | ----------------------- | ------------------------------------------------------------------------- |
| ☐      | **Upload build**        | `eas submit --platform ios --profile production --latest` or Transporter. |
| ☐      | **TestFlight metadata** | What to test, feedback email.                                             |
| ☐      | **Internal testers**    | Team group added.                                                         |
| ☐      | **External beta**       | Optional; Beta App Review if used.                                        |
| ☐      | **Beta sign-off**       | No P0/P1 bugs; Health module unchanged unless hotfix.                     |

### 3.4 Play Internal Testing

| Status | Item                          | Notes                                                         |
| ------ | ----------------------------- | ------------------------------------------------------------- |
| ☐      | **Upload AAB**                | `eas submit --platform android --profile production --latest` |
| ☐      | **Internal testing track**    | Release created; testers invited.                             |
| ☐      | **Closed testing (optional)** | Larger cohort before production.                              |
| ☐      | **Pre-launch report**         | Review Play automatic tests / crashes.                        |
| ☐      | **Production rollout**        | Staged % or full after sign-off.                              |

---

## 4. Known limitations (V1 only — accepted)

These are **intentional** for 1.0. Do not treat as release blockers unless store policy forces disclosure (already covered in legal/FAQ).

| Limitation                             | User-visible behavior                                                                       |
| -------------------------------------- | ------------------------------------------------------------------------------------------- |
| **No app lock / unlock rewards**       | V2 routes guarded; Home unlock section hidden; no screen-time permissions.                  |
| **No push notification delivery**      | In-app notification **inbox** and prefs only; FAQ states pushes planned later.              |
| **Active calories are estimates**      | Derived from step count; labeled “est.” in weekly report and calories copy.                 |
| **Weekly report = calendar Mon–Sun**   | Not a rolling “last 7 days”; water/hourly storage pruned to current week window.            |
| **Peak walk needs hourly history**     | Empty/insufficient state if hourly buckets unavailable; no fabricated peak times.           |
| **On-device–first data**               | Steps/water/streaks in AsyncStorage; no user account cloud backup in V1.                    |
| **Delete data is partial**             | Profile/preferences clear per flow; help notes step/water logs may persist until reinstall. |
| **Some monthly achievements hidden**   | V2-tied achievement IDs excluded in V1 roster.                                              |
| **Health Connect required on Android** | No steps without HC + permissions on supported devices.                                     |
| **Web export not a shipped product**   | Mobile store builds are primary; legal URLs may use hosted static pages.                    |

---

## 5. Final release checklist

Complete immediately before submitting for **App Store review** and **Play production**.

| Status | Gate                                                                                              | Owner sign-off |
| ------ | ------------------------------------------------------------------------------------------------- | -------------- |
| ☐      | All **§1.2 iOS** critical paths passed on physical iPhone                                         |                |
| ☐      | All **§1.3 Android** critical paths passed on physical Android                                    |                |
| ☐      | **Weekly report** verified with real multi-day water + steps (incl. week rollover spot-check)     |                |
| ☐      | **Hosted Privacy Policy & Terms** live at declared URLs                                           |                |
| ☐      | **App Store Connect** listing, privacy, age rating complete                                       |                |
| ☐      | **Play Console** listing, data safety, content rating complete                                    |                |
| ☐      | **Screenshots & descriptions** reviewed for V1 accuracy                                           |                |
| ☐      | **Production EAS builds** built, smoke-tested, version correct                                    |                |
| ☐      | **TestFlight** (or internal iOS) sign-off                                                         |                |
| ☐      | **Play Internal Testing** sign-off                                                                |                |
| ☐      | **No open P0/P1** bugs in Health module without approved hotfix                                   |                |
| ☐      | **Release notes** (1.0.0) prepared for both stores                                                |                |
| ☐      | **Support channel** (`https://website-chi-red-98.vercel.app/support`) monitored for launch window |                |
| ☐      | **Rollback plan** documented (previous build ID / staged rollout pause on Play)                   |                |

---

## Repository reference (already in place)

| Item                   | Location                                                    |
| ---------------------- | ----------------------------------------------------------- |
| Store build guide      | `docs/STORE_RELEASE.md`                                     |
| EAS profiles           | `eas.json`                                                  |
| Native config          | `app.config.js`, `app.json`                                 |
| Legal content          | `src/constants/legalDocuments.ts`, `src/constants/legal.ts` |
| V1 feature flags       | `src/constants/productScope.ts`                             |
| V2 archive notes       | `docs/features/V2_UNLOCK_REWARDS_AND_IMPACT.md`             |
| Android Health Connect | `docs/features/ANDROID_HEALTH_CONNECT_STEPS.md`             |

---

_Document created for Mizora V1.0.0 store release. Update item statuses (☐ / ◐ / ☑) as the release progresses._
