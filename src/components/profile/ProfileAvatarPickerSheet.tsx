import { Modal, Pressable, Text, View, useWindowDimensions } from 'react-native';

import { DiceBearAvatar, diceBearVariantForPresetIndex } from '@/components/profile/DiceBearAvatar';
import {
  PROFILE_AVATAR_PRESETS,
  presetProfileAvatarStorageId,
  type ProfileAvatarPresetId,
} from '@/constants/profileAvatars';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { setProfileAvatarUri } from '@/lib/profile-storage';
import { fonts } from '@/theme/tokens';
import { themedHairlineColor } from '@/utils/chartGridStyle';

type ProfileAvatarPickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  onUpdated: () => void;
};

export function ProfileAvatarPickerSheet({
  visible,
  onClose,
  onUpdated,
}: ProfileAvatarPickerSheetProps) {
  const { colors, isDark } = useMizoraTheme();
  const { width } = useWindowDimensions();
  const tile = Math.floor((width - 40 - 24) / 3);

  const choosePreset = async (id: ProfileAvatarPresetId) => {
    await setProfileAvatarUri(presetProfileAvatarStorageId(id));
    onUpdated();
    onClose();
  };

  const hairline = themedHairlineColor(isDark, colors);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0,0,0,0.35)' }}
        onPress={onClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View className="rounded-t-[24px] px-5 pb-8 pt-3" style={{ backgroundColor: colors.bg }}>
            <View
              className="mb-4 h-1 w-10 self-center rounded-full"
              style={{ backgroundColor: hairline }}
            />
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 16,
                color: colors.textStrong,
                letterSpacing: -0.2,
                marginBottom: 4,
              }}
            >
              Choose avatar
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 11,
                color: colors.textMuted,
                marginBottom: 16,
              }}
            >
              Pick one that feels like you — gallery photos come in a later update.
            </Text>

            <View className="flex-row flex-wrap justify-between" style={{ rowGap: 14 }}>
              {PROFILE_AVATAR_PRESETS.map((preset, index) => (
                <Pressable
                  key={preset.id}
                  accessibilityRole="button"
                  accessibilityLabel="Choose avatar"
                  onPress={() => void choosePreset(preset.id)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1, width: tile }]}
                >
                  <View
                    className="self-center overflow-hidden rounded-full"
                    style={{
                      width: tile,
                      height: tile,
                      borderWidth: 1,
                      borderColor: colors.borderDivider,
                    }}
                  >
                    <DiceBearAvatar
                      seed={preset.seed}
                      size={tile}
                      variant={diceBearVariantForPresetIndex(index)}
                    />
                  </View>
                </Pressable>
              ))}
            </View>

            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 8,
                color: colors.textMuted,
                textAlign: 'center',
                marginTop: 14,
                lineHeight: 12,
              }}
            >
              Avatars by DiceBear · MIT license
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              className="mt-4 items-center py-3"
            >
              <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.textMuted }}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
