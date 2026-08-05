import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DiceBearAvatar, diceBearVariantForPresetIndex } from '@/components/profile/DiceBearAvatar';
import {
  PROFILE_AVATAR_PRESETS,
  presetProfileAvatarStorageId,
  profileAvatarPresetId,
} from '@/constants/profileAvatars';
import { CardInsetDivider } from '@/components/ui/CardInsetDivider';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { getProfileAvatarUri, setProfileAvatarUri } from '@/lib/profile-storage';
import { fonts } from '@/theme/tokens';
import { mizoraBottomSheetStyle } from '@/utils/platformStyles';

const PREVIEW_SIZE = 56;
const THUMB_SIZE = 48;
const THUMB_GAP = 10;
const LIME_GRADIENT = ['#e4ffb8', '#ddfb43', '#97ec0d'] as const;

type ProfileAvatarPickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  onUpdated: () => void;
};

function SheetBackdrop({ isDark, onClose }: { isDark: boolean; onClose: () => void }) {
  const tint = isDark ? 'dark' : 'light';
  /** Light veil so BlurView reads through — frosted app behind sheet */
  const veil = isDark ? 'rgba(26, 33, 24, 0.22)' : 'rgba(255, 255, 255, 0.32)';
  const intensity = Platform.OS === 'ios' ? (isDark ? 42 : 52) : 40;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Close avatar picker"
      onPress={onClose}
      style={StyleSheet.absoluteFill}
    >
      <BlurView
        intensity={intensity}
        tint={tint}
        style={StyleSheet.absoluteFill}
        experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: veil }]} pointerEvents="none" />
    </Pressable>
  );
}

function presetDisplayName(seed: string): string {
  const slug = seed.split('-').pop() ?? seed;
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

export function ProfileAvatarPickerSheet({
  visible,
  onClose,
  onUpdated,
}: ProfileAvatarPickerSheetProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { colors, isDark } = useMizoraTheme();

  const sheetBorder = isDark ? colors.borderDivider : '#ebefea';
  const sheetBg = colors.card;

  const selected = PROFILE_AVATAR_PRESETS[selectedIndex] ?? PROFILE_AVATAR_PRESETS[0];

  useEffect(() => {
    if (!visible) return;
    void getProfileAvatarUri().then((uri) => {
      const id = uri ? profileAvatarPresetId(uri) : null;
      const idx = id ? PROFILE_AVATAR_PRESETS.findIndex((p) => p.id === id) : 0;
      const next = idx >= 0 ? idx : 0;
      setSelectedIndex(next);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          x: Math.max(0, next * (THUMB_SIZE + THUMB_GAP) - width / 2 + THUMB_SIZE),
          animated: false,
        });
      });
    });
  }, [visible, width]);

  const confirm = async () => {
    await setProfileAvatarUri(presetProfileAvatarStorageId(selected.id));
    onUpdated();
    onClose();
  };

  const dotRow = useMemo(
    () =>
      PROFILE_AVATAR_PRESETS.map((_, i) => (
        <View
          key={i}
          style={{
            width: i === selectedIndex ? 16 : 5,
            height: 5,
            borderRadius: 3,
            marginHorizontal: 2,
            backgroundColor:
              i === selectedIndex
                ? isDark
                  ? '#c8f526'
                  : '#5c6d05'
                : isDark
                  ? '#3a4534'
                  : '#dce8d6',
          }}
        />
      )),
    [isDark, selectedIndex],
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <SheetBackdrop isDark={isDark} onClose={onClose} />

        <View
          style={[
            mizoraBottomSheetStyle(sheetBg, sheetBorder),
            { paddingBottom: Math.max(insets.bottom, 8) },
          ]}
        >
          <View className="items-center pt-2.5">
            <View
              className="h-1 rounded-full"
              style={{ width: 36, backgroundColor: isDark ? colors.borderDivider : '#d8ddd4' }}
            />
          </View>

          <View className="flex-row items-center gap-4 px-5 pb-1 pt-4">
            <View className="min-w-0 flex-1" style={{ gap: 4 }}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 16,
                  color: colors.textStrong,
                  letterSpacing: -0.2,
                }}
              >
                Avatar
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 12,
                  lineHeight: 17,
                  color: colors.textSecondary,
                }}
              >
                Shown on Home and your tab bar.
              </Text>
            </View>
            <View
              className="overflow-hidden rounded-full"
              style={{
                width: PREVIEW_SIZE,
                height: PREVIEW_SIZE,
                borderWidth: 1.5,
                borderColor: isDark ? '#5c6d05' : '#ddfb43',
                backgroundColor: isDark ? colors.surfaceMuted : '#fafbf4',
              }}
            >
              <DiceBearAvatar
                seed={selected.seed}
                size={PREVIEW_SIZE}
                variant={diceBearVariantForPresetIndex(selectedIndex)}
              />
            </View>
          </View>

          <CardInsetDivider top={12} bottom={4} />

          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={THUMB_SIZE + THUMB_GAP}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 8,
              paddingBottom: 8,
              gap: THUMB_GAP,
              alignItems: 'center',
            }}
            style={{ flexGrow: 0 }}
          >
            {PROFILE_AVATAR_PRESETS.map((preset, index) => {
              const active = index === selectedIndex;
              return (
                <Pressable
                  key={preset.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  accessibilityLabel={`Preview avatar ${presetDisplayName(preset.seed)}`}
                  onPress={() => setSelectedIndex(index)}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.85 : 1,
                    transform: [{ scale: active ? 1.06 : pressed ? 0.94 : 1 }],
                  })}
                >
                  <View
                    style={{
                      width: active ? THUMB_SIZE + 6 : THUMB_SIZE,
                      height: active ? THUMB_SIZE + 6 : THUMB_SIZE,
                      borderRadius: 999,
                      padding: active ? 3 : 2,
                      backgroundColor: active ? (isDark ? '#c8f526' : '#ddfb43') : 'transparent',
                      borderWidth: active ? 0 : 1,
                      borderColor: isDark ? colors.borderDivider : '#ebefea',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DiceBearAvatar
                      seed={preset.seed}
                      size={active ? THUMB_SIZE : THUMB_SIZE - 4}
                      variant={diceBearVariantForPresetIndex(index)}
                    />
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          <View className="mb-3 flex-row items-center justify-center">{dotRow}</View>

          <View className="px-5 pb-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Set avatar"
              onPress={() => void confirm()}
              className="overflow-hidden rounded-full"
              style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}
            >
              <LinearGradient
                colors={[...LIME_GRADIENT]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ paddingVertical: 14, alignItems: 'center' }}
              >
                <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: '#141c12' }}>
                  Set avatar
                </Text>
              </LinearGradient>
            </Pressable>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 9,
                color: colors.textMuted,
                textAlign: 'center',
                marginTop: 10,
              }}
            >
              Avatars by DiceBear · MIT license
            </Text>
          </View>

          <View
            style={{
              borderTopWidth: StyleSheet.hairlineWidth,
              borderTopColor: isDark ? colors.borderDivider : '#ebefea',
            }}
          >
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              className="items-center py-3.5"
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.textMuted }}>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
