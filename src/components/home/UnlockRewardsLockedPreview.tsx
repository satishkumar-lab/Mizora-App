import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppBrandIcon, type AppBrandId } from '@/components/icons/AppBrandIcon';
import {
  getUnlockPreviewNotifyRequested,
  setUnlockPreviewNotifyRequested,
} from '@/lib/unlock-preview-notify-storage';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';
import { mizoraCardElevationStyle } from '@/utils/platformStyles';

const PREVIEW_ROWS: {
  id: AppBrandId;
  name: string;
  progress: number;
  hint: string;
  fill: string;
}[] = [
  { id: 'instagram', name: 'Instagram', progress: 0.18, hint: 'Steps challenge', fill: '#c7cfc4' },
  { id: 'whatsapp', name: 'WhatsApp', progress: 0.12, hint: 'Steps challenge', fill: '#c7cfc4' },
  { id: 'snapchat', name: 'Snapchat', progress: 0.22, hint: 'Water challenge', fill: '#b8d4f0' },
];

const ROW_H_PAD = 16;
const CARD_PAD = 12;
const CARD_HEIGHT = 300;

function PreviewTeaserRows() {
  const { colors } = useMizoraTheme();
  return (
    <View style={{ paddingTop: CARD_PAD, paddingBottom: CARD_PAD - 4 }}>
      {PREVIEW_ROWS.map((row, index) => (
        <View key={row.id}>
          {index > 0 ? (
            <View
              style={{
                marginVertical: 8,
                marginHorizontal: ROW_H_PAD,
                height: StyleSheet.hairlineWidth,
                backgroundColor: colors.borderDivider,
              }}
            />
          ) : null}
          <View
            className="flex-row items-start"
            style={{ gap: 10, paddingHorizontal: ROW_H_PAD, paddingVertical: 2 }}
          >
            <AppBrandIcon app={row.id} size={36} />
            <View className="min-w-0 flex-1" style={{ gap: 5 }}>
              <View className="flex-row items-center justify-between" style={{ gap: 8 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    flex: 1,
                    fontFamily: fonts.medium,
                    fontSize: 14,
                    color: colors.textStrong,
                  }}
                >
                  {row.name}
                </Text>
                <View
                  className="flex-row items-center rounded-full px-2 py-0.5"
                  style={{ backgroundColor: colors.surfaceMuted }}
                >
                  <Ionicons name="lock-closed" size={9} color={colors.textMuted} />
                </View>
              </View>
              <View
                style={{
                  height: 5,
                  borderRadius: 3,
                  overflow: 'hidden',
                  backgroundColor: colors.track,
                }}
              >
                <View
                  style={{
                    height: 5,
                    width: `${Math.round(row.progress * 100)}%`,
                    borderRadius: 3,
                    backgroundColor: row.fill,
                  }}
                />
              </View>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 10,
                  color: colors.textMuted,
                }}
              >
                {row.hint}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

function OrnamentalRule({ label, accent }: { label?: string; accent: string }) {
  const { colors, isDark } = useMizoraTheme();
  const line = isDark ? colors.borderDivider : '#ebefea';
  return (
    <View className="w-full flex-row items-center" style={{ gap: 8, marginVertical: 2 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: line }} />
      {label ? (
        <View className="flex-row items-center" style={{ gap: 6 }}>
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: accent }} />
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: 9,
              letterSpacing: 1.4,
              color: accent,
            }}
          >
            {label}
          </Text>
          <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: accent }} />
        </View>
      ) : (
        <View
          style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: accent, opacity: 0.85 }}
        />
      )}
      <View style={{ flex: 1, height: 1, backgroundColor: line }} />
    </View>
  );
}

function CornerBrackets({ color }: { color: string }) {
  const s = 14;
  const w = 2;
  const base = {
    position: 'absolute' as const,
    width: s,
    height: s,
    borderColor: color,
  };
  return (
    <>
      <View style={{ ...base, top: 8, left: 8, borderTopWidth: w, borderLeftWidth: w }} />
      <View style={{ ...base, top: 8, right: 8, borderTopWidth: w, borderRightWidth: w }} />
      <View style={{ ...base, bottom: 8, left: 8, borderBottomWidth: w, borderLeftWidth: w }} />
      <View style={{ ...base, bottom: 8, right: 8, borderBottomWidth: w, borderRightWidth: w }} />
    </>
  );
}

function OverlayContent({
  notifyRequested,
  onNotifyMe,
}: {
  notifyRequested: boolean;
  onNotifyMe: () => void;
}) {
  const { colors, isDark } = useMizoraTheme();
  const lime = isDark ? '#c8f526' : '#ddfb43';
  const limeText = isDark ? '#e4ffb8' : '#5c6d05';
  const glassBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)';
  const glassBorder = isDark ? 'rgba(200,245,38,0.35)' : 'rgba(221,251,67,0.65)';

  return (
    <View
      style={{
        width: '100%',
        maxWidth: 300,
        paddingHorizontal: 4,
      }}
    >
      <OrnamentalRule label="COMING SOON" accent={limeText} />

      <View
        style={{
          marginTop: 8,
          marginBottom: 8,
          borderRadius: 16,
          paddingVertical: 12,
          paddingHorizontal: 12,
          backgroundColor: glassBg,
          borderWidth: 1,
          borderColor: glassBorder,
          overflow: 'hidden',
        }}
      >
        <CornerBrackets color={lime} />
        <View className="flex-row items-center" style={{ gap: 12 }}>
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isDark ? 'rgba(200, 245, 38, 0.14)' : '#f5ffbb',
              borderWidth: 1,
              borderColor: isDark ? '#5c6d05' : '#ddfb43',
            }}
          >
            <Ionicons name="lock-closed" size={22} color={isDark ? '#e4ffb8' : '#141c12'} />
          </View>
          <View
            style={{
              width: 1,
              height: 38,
              backgroundColor: isDark ? colors.borderDivider : '#ebefea',
            }}
          />
          <View className="min-w-0 flex-1" style={{ gap: 4 }}>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 10,
                letterSpacing: 0.6,
                color: limeText,
                textTransform: 'uppercase',
              }}
            >
              Unlock rewards
            </Text>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 17,
                lineHeight: 20,
                letterSpacing: -0.4,
                color: colors.textStrong,
              }}
            >
              Earn Your{'\n'}Screen Time
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-stretch" style={{ gap: 8, marginBottom: 8 }}>
        <View style={{ width: 3, borderRadius: 2, backgroundColor: lime }} />
        <Text
          numberOfLines={2}
          style={{
            flex: 1,
            fontFamily: fonts.regular,
            fontSize: 11,
            lineHeight: 16,
            color: colors.textSecondary,
          }}
        >
          Unlock your favorite apps by completing healthy habits like walking and drinking water.
        </Text>
      </View>

      <OrnamentalRule accent={lime} />

      <View style={{ marginTop: 10, gap: 8 }}>
        <View
          accessibilityRole="text"
          className="w-full overflow-hidden rounded-full"
          style={{
            borderWidth: 1,
            borderColor: isDark ? colors.borderDivider : '#ebefea',
          }}
        >
          <LinearGradient
            colors={isDark ? ['#3a4534', '#2a332a'] : ['#e4ffb8', '#ddfb43']}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 16,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 13,
                color: isDark ? '#f5ffbb' : '#141c12',
              }}
            >
              Coming in the Next Update
            </Text>
          </LinearGradient>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Notify me when unlock rewards launch"
          onPress={onNotifyMe}
          className="flex-row items-center justify-center rounded-full py-2"
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            borderWidth: 1,
            borderColor: isDark ? colors.borderDivider : '#ebefea',
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.5)',
          })}
        >
          <Ionicons
            name={notifyRequested ? 'checkmark-circle' : 'notifications-outline'}
            size={15}
            color={notifyRequested ? '#34c759' : limeText}
            style={{ marginRight: 6 }}
          />
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: 13,
              color: notifyRequested ? colors.textMuted : limeText,
            }}
          >
            {notifyRequested ? 'Notification saved' : 'Notify Me'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export function UnlockRewardsLockedPreview() {
  const { colors, isDark } = useMizoraTheme();
  const [notifyRequested, setNotifyRequested] = useState(false);

  useEffect(() => {
    void getUnlockPreviewNotifyRequested().then(setNotifyRequested);
  }, []);

  const onNotifyMe = useCallback(async () => {
    if (notifyRequested) {
      Alert.alert(
        "You're on the list",
        "We'll let you know when Earn Your Screen Time arrives in Mizora.",
      );
      return;
    }
    await setUnlockPreviewNotifyRequested();
    setNotifyRequested(true);
    Alert.alert(
      'Thanks!',
      "We'll notify you when this feature is ready. You can manage alerts in Profile → Notifications.",
    );
  }, [notifyRequested]);

  const frostTint = isDark ? 'dark' : 'light';
  const gradientColors = isDark
    ? (['rgba(26, 33, 24, 0.08)', 'rgba(26, 33, 24, 0.55)', 'rgba(26, 33, 24, 0.88)'] as const)
    : ([
        'rgba(255, 255, 255, 0.05)',
        'rgba(250, 251, 244, 0.62)',
        'rgba(255, 255, 255, 0.92)',
      ] as const);

  return (
    <View
      style={[
        {
          borderRadius: 20,
          overflow: 'hidden',
          height: CARD_HEIGHT,
          backgroundColor: isDark ? colors.card : '#ffffff',
          borderWidth: 0.67,
          borderColor: isDark ? colors.borderDivider : '#e0f0ff',
        },
        mizoraCardElevationStyle(),
      ]}
    >
      <PreviewTeaserRows />

      <View pointerEvents="auto" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
        <BlurView
          intensity={Platform.OS === 'ios' ? 28 : 22}
          tint={frostTint}
          style={StyleSheet.absoluteFill}
          experimentalBlurMethod={Platform.OS === 'android' ? 'dimezisBlurView' : undefined}
        />
        <LinearGradient colors={[...gradientColors]} style={StyleSheet.absoluteFill} />

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingBottom: 16,
            paddingTop: 36,
          }}
        >
          <OverlayContent notifyRequested={notifyRequested} onNotifyMe={() => void onNotifyMe()} />
        </View>
      </View>
    </View>
  );
}
