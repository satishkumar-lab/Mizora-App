/** @type {import('expo/config').ExpoConfig} */
const appJson = require('./app.json');

const teamFromEnv = process.env.EXPO_APPLE_TEAM_ID?.trim();

module.exports = {
  expo: {
    ...appJson.expo,
    ios: {
      ...appJson.expo.ios,
      ...(teamFromEnv ? { appleTeamId: teamFromEnv } : {}),
    },
    plugins: [
      ...(appJson.expo.plugins ?? []),
      './plugins/withIosProjectPathSpacesFix.js',
      './plugins/withIosAutomaticSigning.js',
    ],
  },
};
