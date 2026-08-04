import Constants from 'expo-constants';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { HelpFaqAccordion } from '@/components/settings/HelpFaqAccordion';
import { SettingsGroupDivider } from '@/components/settings/SettingsGroupDivider';
import { SettingsRow, SettingsSection } from '@/components/settings/SettingsRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { InsightBanner } from '@/components/ui/InsightBanner';
import { LEGAL } from '@/constants/legal';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';
import { openLegalUrl, openSupportEmail } from '@/utils/legalLinks';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';
const BUILD =
  Constants.expoConfig?.android?.versionCode?.toString() ??
  Constants.expoConfig?.ios?.buildNumber ??
  '—';

const FAQ = [
  {
    q: 'Why is an app still locked?',
    a: 'You need to finish today’s challenge for that app, or meet the Lock Challenge target you set. Open Lock Challenge from Home to see what’s left.',
  },
  {
    q: 'Steps not updating?',
    a: 'Allow Health or motion access for Mizora in your phone settings, then pull to refresh on Home. On Android, confirm the fitness permission under Profile → Manage permissions.',
  },
  {
    q: 'Too many notifications?',
    a: 'Profile → Notifications lets you turn off reminder types or enable quiet hours. Your streak and unlock alerts stay optional.',
  },
  {
    q: 'How do I change daily goals?',
    a: 'From Home, open your steps goal (or Daily goals). Steps are required; water and other metrics are optional toggles you can turn on only when you want to track them.',
  },
  {
    q: 'What happens when I unlock an app?',
    a: 'Unlock time is earned from habits like steps and water. When the timer runs out, the app locks again until you earn more or complete the next challenge.',
  },
  {
    q: 'Where is my data stored?',
    a: 'Most progress, lock lists, and goals stay on your device. Optional profile and health info personalize targets — see Profile → Privacy & data for details.',
  },
] as const;

export function ProfileAboutScreen() {
  const insets = useSafeAreaInsets();
  const goBack = useMizoraBack('/profile');
  const { colors, isDark } = useMizoraTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader onBack={goBack} title="Help & about" />
        </View>
        <ScrollView
          contentContainerClassName="px-5 pb-8"
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: insets.bottom + MAIN_TAB_BAR_CLEARANCE,
            gap: 22,
          }}
          showsVerticalScrollIndicator={false}
        >
          <InsightBanner icon="heart-outline">
            Earn screen time with steps, water, and streaks — habits over punishment.
          </InsightBanner>

          <SettingsSection title="FAQ" footer="Tap a question to read the answer.">
            <HelpFaqAccordion items={FAQ} />
          </SettingsSection>

          <SettingsSection title="More">
            <SettingsRow label="Contact support" onPress={() => openSupportEmail()} />
            <SettingsGroupDivider />
            <SettingsRow
              label="Privacy Policy"
              onPress={() => openLegalUrl(LEGAL.privacyPolicyUrl)}
            />
            <SettingsGroupDivider />
            <SettingsRow
              label="Open-source licenses"
              subtitle="Expo, React Native, and community libraries"
              showChevron={false}
              isLast
            />
          </SettingsSection>

          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 10,
              color: colors.textMuted,
              textAlign: 'center',
            }}
          >
            Version {APP_VERSION} · Build {BUILD}
          </Text>
        </ScrollView>
      </ThemedScreen>
    </>
  );
}
