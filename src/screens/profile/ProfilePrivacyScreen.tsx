import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { SettingsGroupDivider } from '@/components/settings/SettingsGroupDivider';
import { SettingsRow, SettingsSection } from '@/components/settings/SettingsRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { Card } from '@/components/ui/Card';
import { InsightBanner } from '@/components/ui/InsightBanner';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';
import { legalDocumentHref } from '@/utils/legalLinks';

const BULLETS = [
  'Steps, water, streaks, and lock settings stay mainly on your device.',
  'Optional name and health profile personalize goals — never sold.',
  'Health and app-usage permissions are opt-in with clear explainers.',
  'We do not share personal data with advertisers.',
];

export function ProfilePrivacyScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const goBack = useMizoraBack('/profile');
  const { colors, isDark } = useMizoraTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader onBack={goBack} title="Privacy & data" />
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
          <InsightBanner icon="shield-checkmark-outline">
            Mizora collects the minimum needed to run challenges, unlocks, and your dashboard.
          </InsightBanner>

          <Card className="px-4 py-4" style={{ gap: 12 }}>
            {BULLETS.map((line) => (
              <View key={line} className="flex-row gap-2.5">
                <View
                  className="mt-1.5 h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: isDark ? '#c8f526' : '#34c759' }}
                />
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 12,
                    color: colors.textSecondary,
                    flex: 1,
                    lineHeight: 18,
                  }}
                >
                  {line}
                </Text>
              </View>
            ))}
          </Card>

          <SettingsSection title="Actions">
            <SettingsRow
              label="Full privacy policy"
              onPress={() => router.push(legalDocumentHref('privacy'))}
            />
            <SettingsGroupDivider />
            <SettingsRow
              label="Delete data on this device"
              subtitle="Name, health profile, notification prefs"
              destructive
              onPress={() => router.push('/profile/delete')}
              isLast
            />
          </SettingsSection>
        </ScrollView>
      </ThemedScreen>
    </>
  );
}
