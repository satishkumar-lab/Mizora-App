/** @type {import('expo/config').ExpoConfig} */
const appJson = require('./app.json');

const teamFromEnv = process.env.EXPO_APPLE_TEAM_ID?.trim();
const easProjectId =
  process.env.EAS_PROJECT_ID?.trim() || appJson.expo.extra?.eas?.projectId?.trim();

module.exports = {
  expo: {
    ...appJson.expo,
    extra: {
      ...(appJson.expo.extra ?? {}),
      ...(easProjectId
        ? {
            eas: {
              ...(appJson.expo.extra?.eas ?? {}),
              projectId: easProjectId,
            },
          }
        : {}),
    },
    ios: {
      ...appJson.expo.ios,
      ...(teamFromEnv ? { appleTeamId: teamFromEnv } : {}),
    },
    plugins: [
      ...(appJson.expo.plugins ?? []),
      'react-native-health-connect',
      [
        'expo-build-properties',
        {
          android: {
            compileSdkVersion: 36,
            targetSdkVersion: 36,
            minSdkVersion: 26,
            enableMinifyInReleaseBuilds: true,
            enableShrinkResourcesInReleaseBuilds: true,
            // Phone ABIs only — drops x86/x86_64 emulator libs from installable APKs (~30–40% native savings).
            buildArchs: ['arm64-v8a', 'armeabi-v7a'],
          },
        },
      ],
      './plugins/withIosProjectPathSpacesFix.js',
      './plugins/withIosAutomaticSigning.js',
    ],
  },
};
