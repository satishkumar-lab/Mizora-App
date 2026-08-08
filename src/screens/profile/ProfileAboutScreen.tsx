import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { SettingsGroupDivider } from '@/components/settings/SettingsGroupDivider';
import { SettingsRow, SettingsSection, SettingsTextBlock } from '@/components/settings/SettingsRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { InsightBanner } from '@/components/ui/InsightBanner';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';
import { legalDocumentHref } from '@/utils/legalLinks';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';
const BUILD =
  Constants.expoConfig?.android?.versionCode?.toString() ??
  Constants.expoConfig?.ios?.buildNumber ??
  '—';

export function ProfileAboutScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const goBack = useMizoraBack('/profile');
  const { colors, isDark } = useMizoraTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader onBack={goBack} title="About" />
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
            Build momentum with steps, water, and streaks — small wins that add up.
          </InsightBanner>

          <SettingsSection title="About Mizora">
            <SettingsTextBlock
              title="Why we built Mizora"
              body="Mizora helps you stay on top of daily movement and hydration without guilt or shame. Set simple goals, see your progress on a clear dashboard, and keep streaks going when you show up for yourself."
            />
            <SettingsGroupDivider />
            <SettingsTextBlock
              title="How it works"
              body="Set your step and water targets, log progress through the day, and watch streaks and summaries reflect what you actually did. Health Overview ties it together so you always know where you stand."
            />
            <SettingsGroupDivider />
            <SettingsTextBlock
              title="Version 1"
              body="This release is free and focused on the essentials: steps, water, streaks, and your weekly health report. We are starting in English for India and will expand based on what helps you most."
            />
            <SettingsGroupDivider />
            <SettingsTextBlock
              title="Built with care"
              body="Mizora is made by a small team that cares about digital wellbeing without shame. Your progress lives primarily on your device; we collect only what we need to run the app well."
            />
          </SettingsSection>

          <SettingsSection title="Credits">
            <SettingsRow
              label="Open-source licenses"
              subtitle="Expo, React Native, and community libraries"
              showChevron={false}
            />
            <SettingsGroupDivider />
            <SettingsRow
              label="Avatars"
              subtitle="DiceBear · MIT (Adventurer · CC BY 4.0 where used)"
              showChevron={false}
              isLast
            />
          </SettingsSection>

          <SettingsSection title="Legal">
            <SettingsRow
              label="Privacy Policy"
              onPress={() => router.push(legalDocumentHref('privacy'))}
            />
            <SettingsGroupDivider />
            <SettingsRow
              label="Terms of Service"
              onPress={() => router.push(legalDocumentHref('terms'))}
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
            Mizora v{APP_VERSION} · Build {BUILD}
          </Text>
        </ScrollView>
      </ThemedScreen>
    </>
  );
}
