import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ProfilePrimaryButton } from '@/components/settings/SettingsRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { InsightBanner } from '@/components/ui/InsightBanner';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { clearAllLocalUserData } from '@/lib/profile-storage';
import { fonts } from '@/theme/tokens';

export function ProfileDeleteDataScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const goBack = useMizoraBack('/profile/privacy');
  const { colors, isDark } = useMizoraTheme();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const onConfirm = async () => {
    setBusy(true);
    try {
      await clearAllLocalUserData();
      setDone(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader onBack={goBack} title="Delete data" />
        </View>
        <ScrollView
          contentContainerClassName="px-5"
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: insets.bottom + 24,
            gap: 20,
          }}
        >
          {done ? (
            <>
              <InsightBanner icon="checkmark-circle-outline" borderVariant="lime">
                Personal data cleared on this device.
              </InsightBanner>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 12,
                  color: colors.textMuted,
                  lineHeight: 18,
                }}
              >
                When accounts launch, server-side deletion will live here too. Challenge history may
                remain until reinstall.
              </Text>
              <ProfilePrimaryButton
                label="Back to profile"
                onPress={() => router.replace('/profile')}
              />
            </>
          ) : (
            <>
              <InsightBanner icon="warning-outline" borderVariant="softRed">
                Removes display name, health profile, and notification preferences stored on this
                phone.
              </InsightBanner>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 13,
                  color: colors.textSecondary,
                  lineHeight: 20,
                }}
              >
                Mizora stays installed. Step history, water logs, and streak data may remain until
                you reinstall the app.
              </Text>
              <ProfilePrimaryButton
                label={busy ? 'Deleting…' : 'Delete my data'}
                variant="destructive"
                disabled={busy}
                onPress={() => void onConfirm()}
              />
              {busy ? <ActivityIndicator color={colors.textMuted} /> : null}
            </>
          )}
        </ScrollView>
      </ThemedScreen>
    </>
  );
}
