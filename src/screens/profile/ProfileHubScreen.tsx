import Constants from 'expo-constants';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';

import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { ProfileHeroCard } from '@/components/settings/ProfileHeroCard';
import { SettingsGroupDivider } from '@/components/settings/SettingsGroupDivider';
import { SettingsRow, SettingsSection } from '@/components/settings/SettingsRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { UNLOCK_REWARDS_V2_ENABLED } from '@/constants/productScope';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import {
  ACTIVITY_LEVEL_LABEL,
  ensureMemberSince,
  formatMemberSince,
  getDisplayName,
  getHealthProfile,
} from '@/lib/profile-storage';
import { saveMizoraTheme, type MizoraThemeScheme } from '@/lib/theme-storage';
import { fonts } from '@/theme/tokens';
import { legalDocumentHref } from '@/utils/legalLinks';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';

export function ProfileHubScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const goBack = useMizoraBack('/home');
  const { colors, isDark } = useMizoraTheme();
  const { setColorScheme } = useColorScheme();

  const [displayName, setDisplayNameState] = useState('');
  const [memberLabel, setMemberLabel] = useState('');
  const [healthDetail, setHealthDetail] = useState<string | undefined>();

  const reload = useCallback(async () => {
    const [name, since, health] = await Promise.all([
      getDisplayName(),
      ensureMemberSince(),
      getHealthProfile(),
    ]);
    setDisplayNameState(name?.trim() || 'Mizora user');
    setMemberLabel(formatMemberSince(since));
    if (health?.weightKg) {
      const activity = health.activityLevel
        ? ACTIVITY_LEVEL_LABEL[health.activityLevel]
        : 'Activity not set';
      setHealthDetail(`${health.weightKg} kg · ${activity}`);
    } else {
      setHealthDetail(undefined);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  const toggleTheme = () => {
    const next: MizoraThemeScheme = isDark ? 'light' : 'dark';
    setColorScheme(next);
    void saveMizoraTheme(next);
  };

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader onBack={goBack} title="Profile" />
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
          <ProfileHeroCard
            displayName={displayName}
            memberLabel={memberLabel || undefined}
            onPress={() => router.push('/profile/edit')}
          />

          <SettingsSection title="Your Mizora">
            <SettingsRow
              label="Health profile"
              subtitle="Weight & activity for water goals"
              detail={healthDetail ?? 'Not set yet'}
              leading={<MetricBadgeIcon kind="water" size={40} />}
              onPress={() => router.push('/profile/health')}
            />
            <SettingsGroupDivider />
            <SettingsRow
              label="Daily step goal"
              leading={<MetricBadgeIcon kind="steps" size={40} />}
              onPress={() => router.push('/steps/goal')}
              isLast={!UNLOCK_REWARDS_V2_ENABLED}
            />
            {UNLOCK_REWARDS_V2_ENABLED ? (
              <>
                <SettingsGroupDivider />
                <SettingsRow
                  label="Lock Challenge"
                  subtitle="Apps, targets, and unlock rules"
                  leading={<MetricBadgeIcon kind="unlock" size={40} />}
                  onPress={() => router.push('/rewards')}
                  isLast
                />
              </>
            ) : null}
          </SettingsSection>

          <SettingsSection title="Preferences">
            <SettingsRow
              label="Notifications"
              leading={<MetricBadgeIcon kind="activeTime" size={40} appearance="read" />}
              onPress={() => router.push('/profile/notifications')}
            />
            <SettingsGroupDivider />
            <SettingsRow
              label="Personalization"
              subtitle="Insights and smart unlock suggestions"
              leading={<MetricBadgeIcon kind="steps" size={40} />}
              onPress={() => router.push('/profile/personalization')}
            />
            <SettingsGroupDivider />
            <SettingsRow
              label="Appearance"
              value={isDark ? 'Dark' : 'Light'}
              leading={<MetricBadgeIcon kind="goal" size={40} appearance="read" />}
              onPress={toggleTheme}
              isLast={!__DEV__}
            />
            {__DEV__ ? (
              <>
                <SettingsGroupDivider />
                <SettingsRow
                  label="Notification demo"
                  subtitle="Preview banners & inbox (dev only)"
                  leading={<MetricBadgeIcon kind="activeTime" size={40} />}
                  onPress={() => router.push('/notification-demo')}
                  isLast
                />
              </>
            ) : null}
          </SettingsSection>

          <SettingsSection
            title="Permissions"
            footer="Mizora only uses permissions you approve for steps, reminders, and app lock."
          >
            <SettingsRow
              label="Manage permissions"
              subtitle="Health, notifications, app usage"
              onPress={() => router.push('/profile/permissions')}
              isLast
            />
          </SettingsSection>

          <SettingsSection title="Account & data">
            <SettingsRow
              label="Privacy & data"
              subtitle="What we collect and why"
              onPress={() => router.push('/profile/privacy')}
            />
            <SettingsGroupDivider />
            <SettingsRow
              label="Delete data on this device"
              destructive
              onPress={() => router.push('/profile/delete')}
              isLast
            />
          </SettingsSection>

          <SettingsSection title="Legal & support">
            <SettingsRow
              label="Privacy Policy"
              onPress={() => router.push(legalDocumentHref('privacy'))}
            />
            <SettingsGroupDivider />
            <SettingsRow
              label="Terms of Service"
              onPress={() => router.push(legalDocumentHref('terms'))}
            />
            <SettingsGroupDivider />
            <SettingsRow
              label="Help & support"
              subtitle="FAQ and contact"
              onPress={() => router.push('/profile/help')}
            />
            <SettingsGroupDivider />
            <SettingsRow
              label="About"
              subtitle="Mission, team, and version"
              onPress={() => router.push('/profile/about')}
              isLast
            />
          </SettingsSection>

          <Text
            className="text-center"
            style={{ fontFamily: fonts.regular, fontSize: 10, color: colors.textMuted }}
          >
            Mizora v{APP_VERSION}
          </Text>
        </ScrollView>
      </ThemedScreen>
    </>
  );
}
