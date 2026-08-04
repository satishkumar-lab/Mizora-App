import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { ProfileHealthEditorCard } from '@/components/profile/ProfileHealthEditorCard';
import { ProfilePrimaryButton } from '@/components/settings/SettingsRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { InsightBanner } from '@/components/ui/InsightBanner';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import {
  ACTIVITY_LEVEL_LABEL,
  getHealthProfile,
  saveHealthProfile,
  type StoredHealthProfile,
} from '@/lib/profile-storage';
import type { WaterActivityLevel } from '@/lib/water-recommendation';
import { recommendedDailyWaterMl } from '@/lib/water-recommendation';
import { fonts } from '@/theme/tokens';

const ACTIVITY_OPTIONS: WaterActivityLevel[] = ['low', 'moderate', 'high'];
const FORM_BOTTOM_PAD = 24;

export function ProfileHealthScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const goBack = useMizoraBack('/profile');
  const { colors, isDark } = useMizoraTheme();

  const [weightText, setWeightText] = useState('');
  const [activityLevel, setActivityLevel] = useState<WaterActivityLevel>('moderate');

  useEffect(() => {
    void getHealthProfile().then((p) => {
      if (p?.weightKg) setWeightText(String(p.weightKg));
      if (p?.activityLevel) setActivityLevel(p.activityLevel);
    });
  }, []);

  const weightKg = parseFloat(weightText.replace(',', '.'));
  const previewProfile: StoredHealthProfile = {
    weightKg: Number.isFinite(weightKg) && weightKg > 0 ? weightKg : undefined,
    activityLevel,
  };
  const suggestedMl = recommendedDailyWaterMl(previewProfile);

  const onSave = async () => {
    const profile: StoredHealthProfile = {};
    if (Number.isFinite(weightKg) && weightKg > 0) profile.weightKg = Math.round(weightKg);
    profile.activityLevel = activityLevel;
    await saveHealthProfile(profile);
    router.back();
  };

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader onBack={goBack} title="Health profile" />
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-5"
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 16, gap: 16 }}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            <InsightBanner icon="water-outline" borderVariant="water">
              Used to suggest a daily water target — not medical advice.
            </InsightBanner>

            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 12,
                color: colors.textSecondary,
                lineHeight: 18,
                paddingHorizontal: 2,
              }}
            >
              We use weight and activity to personalize water goals on your tracker.
            </Text>

            <ProfileHealthEditorCard
              weightText={weightText}
              onChangeWeight={setWeightText}
              activityLevel={activityLevel}
              onChangeActivity={setActivityLevel}
              activityOptions={ACTIVITY_OPTIONS.map((id) => ({
                id,
                label: ACTIVITY_LEVEL_LABEL[id],
              }))}
              suggestedWaterMl={suggestedMl}
            />
          </ScrollView>

          <View
            className="border-t px-5 pt-3"
            style={{
              paddingBottom: insets.bottom + FORM_BOTTOM_PAD,
              borderTopColor: colors.borderDivider,
              backgroundColor: colors.bg,
            }}
          >
            <ProfilePrimaryButton label="Save changes" onPress={() => void onSave()} />
          </View>
        </KeyboardAvoidingView>
      </ThemedScreen>
    </>
  );
}
