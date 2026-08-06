const fs = require('fs');
const path = require('path');
const { withDangerousMod } = require('@expo/config-plugins');

const MARKER = 'withIosProjectPathSpacesFix';

const BUNDLE_MARKER = `${MARKER}-bundle`;

const RN_XCODE_BACKTICK =
  "`\"$NODE_BINARY\" --print \"require('path').dirname(require.resolve('react-native/package.json')) + '/scripts/react-native-xcode.sh'\"`";

const RN_XCODE_QUOTED = `RN_XCODE_SCRIPT="$("$NODE_BINARY" --print "require('path').dirname(require.resolve('react-native/package.json')) + '/scripts/react-native-xcode.sh'")"
exec /bin/bash "$RN_XCODE_SCRIPT" # ${BUNDLE_MARKER}`;

/** Ruby injected into Podfile `post_install` — patches EXConstants script phase quoting. */
const POST_INSTALL_RUBY = `
    # ${MARKER}: project paths with spaces break EXConstants when PROJECT_ROOT is word-split.
    installer.pods_project.targets.each do |target|
      next unless target.name == 'EXConstants'
      target.shell_script_build_phases.each do |phase|
        next unless phase.name && phase.name.include?('Generate app.config')
        phase.shell_script = <<~'EXCONSTANTS_SCRIPT'
          set -eo pipefail
          export PROJECT_ROOT="$(cd "\${PODS_ROOT}/../.." && pwd)"
          EXPO_CONSTANTS_PACKAGE_DIR="$(cd "\${PODS_TARGET_SRCROOT}/.." && pwd)"
          if [ "$BUNDLE_FORMAT" == "shallow" ]; then
            RESOURCE_DEST="\${CONFIGURATION_BUILD_DIR}/\${UNLOCALIZED_RESOURCES_FOLDER_PATH}/EXConstants.bundle"
          elif [ "$BUNDLE_FORMAT" == "deep" ]; then
            RESOURCE_DEST="\${CONFIGURATION_BUILD_DIR}/\${UNLOCALIZED_RESOURCES_FOLDER_PATH}/EXConstants.bundle/Contents/Resources"
            mkdir -p "$RESOURCE_DEST"
          else
            echo "Unsupported bundle format: $BUNDLE_FORMAT"
            exit 1
          fi
          mkdir -p "$RESOURCE_DEST"
          "\${EXPO_CONSTANTS_PACKAGE_DIR}/scripts/with-node.sh" "\${EXPO_CONSTANTS_PACKAGE_DIR}/scripts/getAppConfig.js" "$PROJECT_ROOT" "$RESOURCE_DEST"
        EXCONSTANTS_SCRIPT
      end
    end
`;

function patchPodfile(contents) {
  if (contents.includes(MARKER)) {
    return contents;
  }

  if (!contents.includes("ENV.delete('PROJECT_ROOT')")) {
    contents = contents.replace(
      /(ENV\['RNS_GAMMA_ENABLED'\].*\n)/,
      `$1ENV.delete('PROJECT_ROOT') # ${MARKER}: do not bake unquoted path into EXConstants podspec\n`,
    );
  }

  const postInstallNeedle = /(\s+react_native_post_install\([\s\S]*?\)\n)(\s+end\nend\s*)$/m;
  if (!postInstallNeedle.test(contents)) {
    throw new Error(
      `[${MARKER}] Could not find post_install block in Podfile — apply the EXConstants patch manually.`,
    );
  }

  return contents.replace(postInstallNeedle, `$1${POST_INSTALL_RUBY}$2`);
}

function patchXcodeEnv(contents) {
  const exportLine = 'export PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")/.." && pwd)"';
  if (contents.includes(MARKER)) {
    return contents;
  }
  return `${contents.trimEnd()}\n\n# ${MARKER}: canonical app root when paths contain spaces\n${exportLine}\n`;
}

function decodePbxShellScript(raw) {
  return raw.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

function encodePbxShellScript(script) {
  return script.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
}

function findPbxprojPath(iosRoot) {
  const xcodeproj = fs.readdirSync(iosRoot).find((name) => name.endsWith('.xcodeproj'));
  return xcodeproj ? path.join(iosRoot, xcodeproj, 'project.pbxproj') : null;
}

/** Quote paths in Expo/RN "Bundle React Native code and images" (backticks word-split on spaces). */
function patchPbxprojBundlePhase(contents) {
  if (contents.includes(BUNDLE_MARKER)) {
    return contents;
  }

  const phaseLabel = 'name = "Bundle React Native code and images";';
  const phaseIdx = contents.indexOf(phaseLabel);
  if (phaseIdx === -1) {
    return contents;
  }

  const scriptKey = 'shellScript = "';
  const scriptIdx = contents.indexOf(scriptKey, phaseIdx);
  if (scriptIdx === -1) {
    return contents;
  }

  const start = scriptIdx + scriptKey.length;
  let end = start;
  for (let i = start; i < contents.length; i++) {
    if (contents[i] === '\\') {
      i++;
      continue;
    }
    if (contents[i] === '"') {
      end = i;
      break;
    }
  }

  let script = decodePbxShellScript(contents.slice(start, end));
  const projectRootNeedle = 'export PROJECT_ROOT="$PROJECT_DIR"/..';
  const projectRootReplacement = `export PROJECT_ROOT="$(cd "$PROJECT_DIR/.." && pwd)" # ${BUNDLE_MARKER}`;

  if (script.includes(projectRootNeedle)) {
    script = script.replace(projectRootNeedle, projectRootReplacement);
  }

  if (script.includes(RN_XCODE_BACKTICK)) {
    script = script.replace(RN_XCODE_BACKTICK, RN_XCODE_QUOTED);
  }

  if (!script.includes(BUNDLE_MARKER)) {
    return contents;
  }

  return contents.slice(0, start) + encodePbxShellScript(script) + contents.slice(end);
}

const SWIFT_DEBUG_MARKER = `${MARKER}-swift-debug`;

/** Mizora target Debug must compile AppDelegate with EXPO_CONFIGURATION_DEBUG (Expo prebuild default flags). */
function patchPbxprojSwiftDebugConditions(contents) {
  if (contents.includes(SWIFT_DEBUG_MARKER)) {
    return contents;
  }

  let next = contents.replace(
    /(13B07F941A680F5B00A75B9A \/\* Debug \*\/ = \{[\s\S]*?OTHER_SWIFT_FLAGS = "\$\(inherited\) -D EXPO_CONFIGURATION_DEBUG";)\n(\s+PRODUCT_BUNDLE_IDENTIFIER)/m,
    `$1\n\t\t\t\tSWIFT_ACTIVE_COMPILATION_CONDITIONS = "$(inherited) DEBUG EXPO_CONFIGURATION_DEBUG";\n$2`,
  );

  next = next.replace(
    /(13B07F951A680F5B00A75B9A \/\* Release \*\/ = \{[\s\S]*?OTHER_SWIFT_FLAGS = "\$\(inherited\) -D EXPO_CONFIGURATION_RELEASE";)\n(\s+PRODUCT_BUNDLE_IDENTIFIER)/m,
    `$1\n\t\t\t\tSWIFT_ACTIVE_COMPILATION_CONDITIONS = "$(inherited) EXPO_CONFIGURATION_RELEASE";\n$2`,
  );

  return next;
}

function patchAppDelegate(contents) {
  if (!contents.includes('bundleURL()') || contents.includes('#if EXPO_CONFIGURATION_DEBUG')) {
    return contents;
  }
  return contents.replace(
    /#if DEBUG\n(\s*return RCTBundleURLProvider[\s\S]*?\n)#else\n(\s*return Bundle\.main[\s\S]*?\n)#endif/g,
    '#if EXPO_CONFIGURATION_DEBUG\n$1#else\n$2#endif',
  );
}

/** @type {import('@expo/config-plugins').ConfigPlugin} */
module.exports = function withIosProjectPathSpacesFix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const iosRoot = config.modRequest.platformProjectRoot;
      const podfilePath = path.join(iosRoot, 'Podfile');
      const xcodeEnvPath = path.join(iosRoot, '.xcode.env');

      if (fs.existsSync(podfilePath)) {
        fs.writeFileSync(podfilePath, patchPodfile(fs.readFileSync(podfilePath, 'utf8')));
      }

      if (fs.existsSync(xcodeEnvPath)) {
        fs.writeFileSync(xcodeEnvPath, patchXcodeEnv(fs.readFileSync(xcodeEnvPath, 'utf8')));
      }

      const pbxprojPath = findPbxprojPath(iosRoot);
      if (pbxprojPath && fs.existsSync(pbxprojPath)) {
        fs.writeFileSync(
          pbxprojPath,
          patchPbxprojSwiftDebugConditions(
            patchPbxprojBundlePhase(fs.readFileSync(pbxprojPath, 'utf8')),
          ),
        );
      }

      const appDelegateCandidates = [
        path.join(iosRoot, 'Mizora', 'AppDelegate.swift'),
        path.join(iosRoot, config.modRequest.projectName ?? '', 'AppDelegate.swift'),
      ];
      for (const appDelegatePath of appDelegateCandidates) {
        if (fs.existsSync(appDelegatePath)) {
          const next = patchAppDelegate(fs.readFileSync(appDelegatePath, 'utf8'));
          fs.writeFileSync(appDelegatePath, next);
          break;
        }
      }

      return config;
    },
  ]);
};

module.exports.patchPodfile = patchPodfile;
module.exports.patchXcodeEnv = patchXcodeEnv;
module.exports.patchPbxprojBundlePhase = patchPbxprojBundlePhase;
module.exports.MARKER = MARKER;
