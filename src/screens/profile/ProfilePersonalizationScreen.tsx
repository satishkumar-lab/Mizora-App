import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { MizoraSwitch } from '@/components/unlock/MizoraSwitch';
import { SettingsRow, SettingsSection } from '@/components/settings/SettingsRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { InsightBanner } from '@/components/ui/InsightBanner';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { usePersonalization } from '@/providers/PersonalizationProvider';

function PrefToggle({
  label,
  subtitle,
  value,
  onValueChange,
  isLast,
}: {
  label: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <SettingsRow
      label={label}
      subtitle={subtitle}
      showChevron={false}
      isLast={isLast}
      trailing={<MizoraSwitch value={value} onValueChange={onValueChange} />}
    />
  );
}

export function ProfilePersonalizationScreen() {
  const insets = useSafeAreaInsets();
  const goBack = useMizoraBack('/profile');
  const { isDark } = useMizoraTheme();
  const { prefs, setPrefs, ready } = usePersonalization();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader onBack={goBack} title="Personalization" />
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
          <InsightBanner icon="sparkles-outline">
            Tips are generated on your phone from steps and water — nothing is sent to the cloud.
          </InsightBanner>

          {ready ? (
            <SettingsSection title="Home" footer="Turn off if you prefer a quieter dashboard.">
              <PrefToggle
                label="Daily insight on Home"
                subtitle="One encouraging tip from your recent activity"
                value={prefs.homeInsightsEnabled}
                onValueChange={(v) => setPrefs({ homeInsightsEnabled: v })}
                isLast
              />
            </SettingsSection>
          ) : null}
        </ScrollView>
      </ThemedScreen>
    </>
  );
}
