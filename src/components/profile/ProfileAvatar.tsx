import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, View } from 'react-native';

import { ProfileAvatarPickerSheet } from '@/components/profile/ProfileAvatarPickerSheet';
import { DiceBearAvatar } from '@/components/profile/DiceBearAvatar';
import {
  presetById,
  isPresetProfileAvatar,
  profileAvatarPresetId,
} from '@/constants/profileAvatars';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { getProfileAvatarUri } from '@/lib/profile-storage';

type ProfileAvatarProps = {
  size?: number;
  editable?: boolean;
  onPhotoUpdated?: () => void;
};

/** Default — onboarding lime ring + happy face (no avatar chosen yet). */
function ProfileAvatarPlaceholder({ size }: { size: number }) {
  const { colors, isDark } = useMizoraTheme();
  const ring = Math.max(2, Math.round(size * 0.045));
  const inner = size - ring * 2;
  const iconSize = Math.round(size * 0.38);

  return (
    <LinearGradient
      colors={isDark ? ['#5c6d05', '#c8f526'] : ['#D6FF92', '#DDFB43', '#34c759']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        padding: ring,
      }}
    >
      <View
        style={{
          width: inner,
          height: inner,
          borderRadius: inner / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDark ? colors.card : '#ffffff',
        }}
      >
        <Ionicons name="happy" size={iconSize} color={isDark ? '#d6ff92' : '#141c12'} />
      </View>
    </LinearGradient>
  );
}

export function ProfileAvatar({ size = 56, editable, onPhotoUpdated }: ProfileAvatarProps) {
  const [stored, setStored] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const reload = useCallback(async () => {
    setStored(await getProfileAvatarUri());
  }, []);

  useFocusEffect(
    useCallback(() => {
      void reload();
    }, [reload]),
  );

  const presetId = stored && isPresetProfileAvatar(stored) ? profileAvatarPresetId(stored) : null;
  const preset = presetId ? presetById(presetId) : null;

  const inner = preset?.seed ? (
    <View
      className="overflow-hidden rounded-full border-[1.5px] border-mizora-primary"
      style={{ width: size, height: size }}
    >
      <DiceBearAvatar seed={preset.seed} size={size} variant="lorelei" />
    </View>
  ) : (
    <View className="overflow-hidden rounded-full border-[1.5px] border-mizora-primary">
      <ProfileAvatarPlaceholder size={size} />
    </View>
  );

  const onUpdated = () => {
    void reload();
    onPhotoUpdated?.();
  };

  if (!editable) {
    return inner;
  }

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Choose avatar"
        onPress={() => setPickerOpen(true)}
        hitSlop={4}
        style={({ pressed }) => (pressed ? { opacity: 0.88 } : undefined)}
      >
        {inner}
      </Pressable>
      <ProfileAvatarPickerSheet
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onUpdated={onUpdated}
      />
    </>
  );
}
