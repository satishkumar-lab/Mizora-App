const { withXcodeProject } = require('@expo/config-plugins');
const {
  withDevelopmentTeam,
  getDevelopmentTeam,
} = require('@expo/config-plugins/build/ios/DevelopmentTeam');
const { getNativeTargets } = require('@expo/config-plugins/build/ios/Target');
const {
  getBuildConfigurationsForListId,
} = require('@expo/config-plugins/build/ios/utils/Xcodeproj');

/**
 * Enables Xcode automatic signing and applies ios.appleTeamId (or EXPO_APPLE_TEAM_ID).
 * Survives `npx expo prebuild` when listed in app.config.js plugins.
 */
function withAutomaticCodeSigning(config) {
  return withXcodeProject(config, (config) => {
    const project = config.modResults;
    const nativeTargets = getNativeTargets(project);

    nativeTargets.forEach(([, nativeTarget]) => {
      getBuildConfigurationsForListId(project, nativeTarget.buildConfigurationList).forEach(
        ([, buildConfig]) => {
          buildConfig.buildSettings.CODE_SIGN_STYLE = 'Automatic';
        },
      );
    });

    return config;
  });
}

/** @type {import('@expo/config-plugins').ConfigPlugin} */
module.exports = function withIosAutomaticSigning(config) {
  const teamFromEnv = process.env.EXPO_APPLE_TEAM_ID?.trim();
  if (teamFromEnv && !config.ios?.appleTeamId) {
    config.ios = { ...config.ios, appleTeamId: teamFromEnv };
  }

  if (!getDevelopmentTeam(config)) {
    console.warn(
      '[withIosAutomaticSigning] Set ios.appleTeamId in app.config.js or EXPO_APPLE_TEAM_ID before device builds.',
    );
  }

  config = withDevelopmentTeam(config);
  config = withAutomaticCodeSigning(config);
  return config;
};
