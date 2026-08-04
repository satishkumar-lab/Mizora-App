import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import {
  ProfileEditScreenFooter,
  ProfileIdentityEditorCard,
} from '@/components/profile/ProfileIdentityEditorCard';
import { ProfilePrimaryButton } from '@/components/settings/SettingsRow';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { getDisplayName, setDisplayName } from '@/lib/profile-storage';
import { fonts } from '@/theme/tokens';

/** Edit profile — no bottom tab bar clearance; nav hidden on this route. */
const EDIT_SCREEN_BOTTOM_PAD = 24;

export function ProfileEditNameScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const goBack = useMizoraBack('/profile');
  const { colors, isDark } = useMizoraTheme();
  const [name, setName] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    void getDisplayName().then((n) => {
      setName(n?.trim() ?? '');
      setLoaded(true);
    });
  }, []);

  const onSave = async () => {
    await setDisplayName(name.trim());
    router.back();
  };

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader onBack={goBack} title="Edit profile" />
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-5"
            contentContainerStyle={{
              paddingTop: 8,
              paddingBottom: 16,
              gap: 20,
            }}
            keyboardShouldPersistTaps="always"
            showsVerticalScrollIndicator={false}
          >
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 12,
                color: colors.textSecondary,
                lineHeight: 18,
                paddingHorizontal: 2,
              }}
            >
              Update how you show up in Mizora — avatar and name stay on this phone until you add an
              account.
            </Text>

            <ProfileIdentityEditorCard
              name={name}
              onChangeName={setName}
              namePlaceholder="Your name"
            />

            <ProfileEditScreenFooter />
          </ScrollView>

          <View
            className="border-t px-5 pt-3"
            style={{
              paddingBottom: insets.bottom + EDIT_SCREEN_BOTTOM_PAD,
              borderTopColor: colors.borderDivider,
              backgroundColor: colors.bg,
            }}
          >
            <ProfilePrimaryButton
              label="Save changes"
              onPress={() => void onSave()}
              disabled={!loaded}
            />
          </View>
        </KeyboardAvoidingView>
      </ThemedScreen>
    </>
  );
}
