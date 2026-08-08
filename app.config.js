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
          },
        },
      ],
      './plugins/withIosProjectPathSpacesFix.js',
      './plugins/withIosAutomaticSigning.js',
    ],
  },
};
