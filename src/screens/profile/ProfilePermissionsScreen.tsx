import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import {
  ProfilePrimaryButton,
  SettingsRow,
  SettingsSection,
} from '@/components/settings/SettingsRow';
import { SettingsGroupDivider } from '@/components/settings/SettingsGroupDivider';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { InsightBanner } from '@/components/ui/InsightBanner';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { openSystemSettings } from '@/utils/legalLinks';

const PERMISSION_ROWS = [
  {
    label: 'Health & motion',
    subtitle: 'Steps for challenges and dashboard',
    kind: 'steps' as const,
  },
  {
    label: 'Notifications',
    subtitle: 'Streaks, unlocks, and walk nudges',
    kind: 'activeTime' as const,
  },
  { label: 'App usage', subtitle: 'Screen time and lock recommendations', kind: 'unlock' as const },
];

export function ProfilePermissionsScreen() {
  const insets = useSafeAreaInsets();
  const goBack = useMizoraBack('/profile');
  const { isDark } = useMizoraTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader onBack={goBack} title="Permissions" />
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
          <InsightBanner icon="settings-outline">
            Your phone controls access. Open system settings to allow or revoke permissions for
            Mizora.
          </InsightBanner>

          <SettingsSection title="What Mizora may use">
            {PERMISSION_ROWS.map((row, index) => (
              <View key={row.label}>
                {index > 0 ? <SettingsGroupDivider /> : null}
                <SettingsRow
                  label={row.label}
                  subtitle={row.subtitle}
                  showChevron={false}
                  leading={<MetricBadgeIcon kind={row.kind} size={40} appearance="read" />}
                  isLast={index === PERMISSION_ROWS.length - 1}
                />
              </View>
            ))}
          </SettingsSection>

          <ProfilePrimaryButton label="Open system settings" onPress={openSystemSettings} />
        </ScrollView>
      </ThemedScreen>
    </>
  );
}
