# Mizora — Play Store & App Store (EAS)

Mizora is an **Expo** app. Store builds go through **[EAS Build](https://docs.expo.dev/build/introduction/)** and **[EAS Submit](https://docs.expo.dev/submit/introduction/)**, not Vercel.

## One-time setup (on your Mac)

1. **Expo account** — [expo.dev/signup](https://expo.dev/signup)

2. **Install EAS CLI** (project root):

   ```bash
   npm install -g eas-cli
   eas login
   ```

3. **Link this repo to an EAS project**:

   ```bash
   cd "/Users/satishkumar/Documents/Mizora App"
   eas init
   ```

   This adds `extra.eas.projectId` to `app.json`. Commit that change.

4. **Apple (App Store)**

   - Enroll in [Apple Developer Program](https://developer.apple.com/programs/) ($99/year).
   - First iOS production build: EAS can create certificates/profiles, or you upload your own when prompted.

5. **Google (Play Store)**

   - [Google Play Console](https://play.google.com/console) account (one-time fee).
   - Create app listing (name, category, content rating, privacy policy URL).

## Bundle IDs (change if needed)

| Platform | Value in `app.json`                          |
| -------- | -------------------------------------------- |
| iOS      | `app.mizora.mobile` (`ios.bundleIdentifier`) |
| Android  | `app.mizora.mobile` (`android.package`)      |

If you already use another ID in Play Console / App Store Connect, update `app.json` **before** the first store upload.

## Build commands

**Production (store-ready)**

```bash
# Android App Bundle (.aab) for Play Store
eas build --platform android --profile production

# iOS for App Store Connect
eas build --platform ios --profile production
```

**Internal testing (team / QA)**

```bash
# Android APK — easy sideload
eas build --platform android --profile preview

# iOS — TestFlight after build + submit
eas build --platform ios --profile production
```

Builds run on Expo servers; download artifacts from the link EAS prints or from [expo.dev](https://expo.dev) → your project → Builds.

## Submit to stores

After a **production** build succeeds:

```bash
eas submit --platform android --profile production --latest
eas submit --platform ios --profile production --latest
```

- **Android:** Play Console service account JSON (EAS docs: [Android submit](https://docs.expo.dev/submit/android/)).
- **iOS:** App Store Connect API key or Apple ID (EAS docs: [iOS submit](https://docs.expo.dev/submit/ios/)).

## Store checklist (both)

- [ ] App icon & splash (already in `assets/images/`)
- [ ] Short + full description, screenshots (phone + tablet if needed)
- [ ] **Privacy policy URL** (required; health/step data → be accurate)
- [ ] Data safety / App Privacy forms (steps, optional health goals, AsyncStorage on device)
- [ ] Content rating questionnaire
- [ ] Test on real devices (Android + iPhone) before production submit

## Version bumps

`eas.json` uses `"appVersionSource": "remote"` and production `"autoIncrement": true` for build numbers. Bump **user-facing version** in `app.json` → `expo.version` (e.g. `1.0.0` → `1.0.1`) when you release.

## POC / app lock

`/poc/android-app-lock` is **not** in this app bundle (ignored in git). Wire native app-lock into the main app only when product is ready; it will affect Play Store declarations and permissions.

## Useful links (Expo SDK 57)

- [Build setup](https://docs.expo.dev/build/setup/)
- [Submit to Google Play](https://docs.expo.dev/submit/android/)
- [Submit to App Store](https://docs.expo.dev/submit/ios/)
- [Versioning](https://docs.expo.dev/build-reference/app-versions/)
