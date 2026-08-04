import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { MizoraSwitch } from '@/components/unlock/MizoraSwitch';

import { SettingsGroupDivider } from '@/components/settings/SettingsGroupDivider';
import { SettingsRow, SettingsSection } from '@/components/settings/SettingsRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { InsightBanner } from '@/components/ui/InsightBanner';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { NOTIFICATION_DAILY_CAP, NOTIFICATION_QUIET_HOURS_LABEL } from '@/constants/notifications';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import {
  getNotificationPrefs,
  saveNotificationPrefs,
  type NotificationPrefs,
} from '@/lib/profile-storage';

function PrefToggle({
  label,
  subtitle,
  value,
  onValueChange,
  disabled,
  isLast,
}: {
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
  isLast?: boolean;
}) {
  return (
    <SettingsRow
      label={label}
      subtitle={subtitle}
      showChevron={false}
      isLast={isLast}
      disabled={disabled}
      trailing={<MizoraSwitch value={value} onValueChange={onValueChange} disabled={disabled} />}
    />
  );
}

export function ProfileNotificationPrefsScreen() {
  const insets = useSafeAreaInsets();
  const goBack = useMizoraBack('/profile');
  const { isDark } = useMizoraTheme();
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);

  useEffect(() => {
    void getNotificationPrefs().then(setPrefs);
  }, []);

  const patch = (partial: Partial<NotificationPrefs>) => {
    if (!prefs) return;
    const next = { ...prefs, ...partial };
    setPrefs(next);
    void saveNotificationPrefs(next);
  };

  const typesDisabled = !prefs?.masterEnabled;

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
            About {NOTIFICATION_DAILY_CAP} helpful reminders per day — no promos or guilt copy.
          </InsightBanner>

          {prefs ? (
            <>
              <SettingsSection title="General">
                <PrefToggle
                  label="Allow notifications"
                  value={prefs.masterEnabled}
                  onValueChange={(v) => patch({ masterEnabled: v })}
                />
                <SettingsGroupDivider />
                <PrefToggle
                  label="Quiet hours"
                  subtitle={NOTIFICATION_QUIET_HOURS_LABEL}
                  value={prefs.quietHoursEnabled}
                  onValueChange={(v) => patch({ quietHoursEnabled: v })}
                  disabled={typesDisabled}
                  isLast
                />
              </SettingsSection>

              <SettingsSection title="Types">
                <PrefToggle
                  label="Challenge reminders"
                  value={prefs.challengeReminders}
                  onValueChange={(v) => patch({ challengeReminders: v })}
                  disabled={typesDisabled}
                />
                <SettingsGroupDivider />
                <PrefToggle
                  label="Unlock ready"
                  value={prefs.unlockReady}
                  onValueChange={(v) => patch({ unlockReady: v })}
                  disabled={typesDisabled}
                />
                <SettingsGroupDivider />
                <PrefToggle
                  label="Streak reminders"
                  value={prefs.streakReminders}
                  onValueChange={(v) => patch({ streakReminders: v })}
                  disabled={typesDisabled}
                />
                <SettingsGroupDivider />
                <PrefToggle
                  label="Walk nudges"
                  value={prefs.walkNudges}
                  onValueChange={(v) => patch({ walkNudges: v })}
                  disabled={typesDisabled}
                  isLast
                />
              </SettingsSection>
            </>
          ) : null}
        </ScrollView>
      </ThemedScreen>
    </>
  );
}
