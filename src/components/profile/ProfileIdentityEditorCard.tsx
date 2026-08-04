import type { ReactNode } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { CardInsetDivider } from '@/components/ui/CardInsetDivider';
import { Card } from '@/components/ui/Card';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

type ProfileIdentityEditorCardProps = {
  name: string;
  onChangeName: (value: string) => void;
  namePlaceholder?: string;
  onAvatarUpdated?: () => void;
};

export function ProfileIdentityEditorCard({
  name,
  onChangeName,
  namePlaceholder = 'Your name',
  onAvatarUpdated,
}: ProfileIdentityEditorCardProps) {
  const { colors, isDark } = useMizoraTheme();

  return (
    <Card className="overflow-hidden p-0">
      <View className="items-center px-4 pb-5 pt-6" style={{ gap: 12 }}>
        <ProfileAvatar size={88} editable onPhotoUpdated={onAvatarUpdated} />
        <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: '#34c759' }}>
          Change avatar
        </Text>
        <Text
          style={{
            fontFamily: fonts.regular,
            fontSize: 10,
            color: colors.textMuted,
            textAlign: 'center',
            lineHeight: 14,
            maxWidth: 260,
          }}
        >
          Avatars are generated on your device. Pick one that feels like you.
        </Text>
      </View>

      <CardInsetDivider />

      <View className="px-4 py-4" style={{ gap: 10 }}>
        <View style={{ gap: 2 }}>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 14,
              color: colors.textStrong,
              letterSpacing: -0.15,
            }}
          >
            Display name
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 10, color: colors.textMuted }}>
            Shown on Home and your profile
          </Text>
        </View>
        <View
          className="rounded-[14px] px-3.5"
          style={{
            backgroundColor: isDark ? colors.surfaceMuted : colors.surfaceSecondary,
            borderWidth: 0.67,
            borderColor: colors.borderDivider,
            minHeight: 52,
            justifyContent: 'center',
          }}
        >
          <TextInput
            value={name}
            onChangeText={onChangeName}
            placeholder={namePlaceholder}
            placeholderTextColor={colors.textMuted}
            autoCapitalize="words"
            autoCorrect={false}
            editable
            selectTextOnFocus
            returnKeyType="done"
            style={{
              width: '100%',
              fontFamily: fonts.medium,
              fontSize: 16,
              color: colors.textStrong,
              paddingVertical: 12,
              letterSpacing: -0.2,
            }}
          />
        </View>
      </View>
    </Card>
  );
}

type ProfileEditScreenFooterProps = {
  children?: ReactNode;
};

export function ProfileEditScreenFooter({ children }: ProfileEditScreenFooterProps) {
  const { colors } = useMizoraTheme();

  return (
    <Text
      style={{
        fontFamily: fonts.regular,
        fontSize: 10,
        color: colors.textMuted,
        textAlign: 'center',
        lineHeight: 15,
        paddingHorizontal: 8,
      }}
    >
      {children ?? 'No account required in V1 — saved only on this device.'}
    </Text>
  );
}

/** Tappable text button for secondary actions on edit flows */
export function ProfileEditTextAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} className="items-center py-2">
      <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: '#34c759' }}>{label}</Text>
    </Pressable>
  );
}
