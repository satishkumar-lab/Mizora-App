import { useRouter } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { HelpFaqAccordion } from '@/components/settings/HelpFaqAccordion';
import { SettingsGroupDivider } from '@/components/settings/SettingsGroupDivider';
import { SettingsRow, SettingsSection } from '@/components/settings/SettingsRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { InsightBanner } from '@/components/ui/InsightBanner';
import { HELP_FAQ } from '@/constants/helpFaq';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { openSupportEmail, legalDocumentHref } from '@/utils/legalLinks';

export function ProfileHelpSupportScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const goBack = useMizoraBack('/profile');
  const { isDark } = useMizoraTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader onBack={goBack} title="Help & support" />
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
          <InsightBanner icon="help-circle-outline">
            Quick answers below. Still stuck? Email us — we read every message.
          </InsightBanner>

          <SettingsSection title="FAQ" footer="Tap a question to read the answer.">
            <HelpFaqAccordion items={HELP_FAQ} />
          </SettingsSection>

          <SettingsSection title="Get in touch">
            <SettingsRow
              label="Contact support"
              subtitle="Bug reports, account help, feedback"
              onPress={() => openSupportEmail()}
            />
            <SettingsGroupDivider />
            <SettingsRow
              label="Privacy Policy"
              onPress={() => router.push(legalDocumentHref('privacy'))}
              isLast
            />
          </SettingsSection>
        </ScrollView>
      </ThemedScreen>
    </>
  );
}
