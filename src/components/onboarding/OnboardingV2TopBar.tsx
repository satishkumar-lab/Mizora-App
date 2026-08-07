import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fonts } from '@/theme/tokens';

type OnboardingV2TopBarProps = {
  variant?: 'lime' | 'light';
  showBack?: boolean;
  showSkip?: boolean;
  onBack?: () => void;
  onSkip?: () => void;
};

export function OnboardingV2TopBar({
  variant = 'light',
  showBack = false,
  showSkip = false,
  onBack,
  onSkip,
}: OnboardingV2TopBarProps) {
  const insets = useSafeAreaInsets();
  const isLime = variant === 'lime';

  const pillBorder = isLime ? 'rgba(255,255,255,0.85)' : '#ebefea';
  const pillBg = isLime ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.8)';
  const actionColor = '#141c12';

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { paddingTop: insets.top + 6, paddingHorizontal: 20 }]}
    >
      <View style={styles.row}>
        {showBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={onBack}
            hitSlop={10}
            style={[styles.iconPill, { borderColor: pillBorder, backgroundColor: pillBg }]}
          >
            <Ionicons name="chevron-back" size={20} color={actionColor} />
          </Pressable>
        ) : (
          <View style={styles.sideSlot} />
        )}

        <View style={styles.stepSpacer} />

        {showSkip ? (
          <Pressable
            accessibilityRole="button"
            onPress={onSkip}
            hitSlop={10}
            style={[styles.pill, { borderColor: pillBorder, backgroundColor: pillBg }]}
          >
            <Text style={[styles.pillText, { color: actionColor }]}>Skip</Text>
          </Pressable>
        ) : (
          <View style={styles.sideSlot} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 36,
  },
  sideSlot: {
    width: 40,
  },
  stepSpacer: {
    flex: 1,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 72,
    justifyContent: 'center',
  },
  iconPill: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 100,
    width: 40,
    height: 40,
  },
  pillText: {
    fontFamily: fonts.medium,
    fontSize: 12,
  },
});
