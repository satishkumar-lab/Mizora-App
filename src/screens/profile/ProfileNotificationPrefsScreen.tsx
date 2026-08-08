import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ProfilePrimaryButton } from '@/components/settings/SettingsRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { InsightBanner } from '@/components/ui/InsightBanner';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';
import { openSystemSettings } from '@/utils/legalLinks';

export function ProfileNotificationPrefsScreen() {
  const insets = useSafeAreaInsets();
  const goBack = useMizoraBack('/profile');
  const { isDark, colors } = useMizoraTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader onBack={goBack} title="Notifications" />
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
          <InsightBanner icon="notifications-outline">
            Mizora 1.0 does not send push reminders yet. Check Home and the Steps tab for live
            progress.
          </InsightBanner>

          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 13,
              color: colors.textSecondary,
              lineHeight: 20,
            }}
          >
            When push notifications ship in a future update, you&apos;ll be able to choose streak
            nudges and walk reminders here. For now, use system settings if you need to manage any
            Mizora alerts at the OS level.
          </Text>

          <ProfilePrimaryButton label="Open system settings" onPress={openSystemSettings} />
        </ScrollView>
      </ThemedScreen>
    </>
  );
}
