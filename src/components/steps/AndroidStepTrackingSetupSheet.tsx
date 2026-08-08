import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ANDROID_HEALTH_CONNECT_SETUP_EXPLAINER } from '@/constants/androidHealthConnectGuidance';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import {
  isAndroidStepProviderSetupStatus,
  isStepsTrackingLoading,
  stepsPermissionUiCopy,
} from '@/lib/health/stepsTrackingUi';
import type { StepsTrackingStatus } from '@/lib/health/readTodaySteps';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { useSteps } from '@/providers/StepsProvider';
import { fonts } from '@/theme/tokens';
import { mizoraBottomSheetStyle } from '@/utils/platformStyles';

/**
 * One-time Android setup when the Health Connect provider must be installed or updated.
 * Not shown on Home as a permanent card — matches production apps that use a focused setup moment.
 */
export function AndroidStepTrackingSetupSheet() {
  const { status, runStepsSetupAction } = useSteps();
  const { colors, isDark } = useMizoraTheme();
  const insets = useSafeAreaInsets();
  const [dismissedForStatus, setDismissedForStatus] = useState<StepsTrackingStatus | null>(null);

  const needsSetup = isAndroidStepProviderSetupStatus(status);
  const visible = Platform.OS === 'android' && needsSetup && dismissedForStatus !== status;

  if (Platform.OS !== 'android') {
    return null;
  }

  const copy = stepsPermissionUiCopy(status);
  const loading = isStepsTrackingLoading(status);
  const sheetTint = isDark ? colors.bg : '#f4f6f3';
  const sheetBorder = isDark ? colors.borderDivider : '#e8ebe4';
  const veil = isDark ? 'rgba(26, 33, 24, 0.55)' : 'rgba(20, 28, 18, 0.45)';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => setDismissedForStatus(status)}
    >
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss setup"
          onPress={() => setDismissedForStatus(status)}
          style={StyleSheet.absoluteFill}
        >
          <View style={[StyleSheet.absoluteFill, { backgroundColor: veil }]} />
        </Pressable>

        <View
          style={[
            mizoraBottomSheetStyle(sheetTint, sheetBorder),
            {
              paddingBottom: Math.max(insets.bottom, 20),
              paddingHorizontal: 20,
              paddingTop: 12,
            },
          ]}
        >
          <View style={styles.handle} />
          <View style={styles.headerRow}>
            <MetricBadgeIcon kind="steps" size={40} appearance="read" />
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={{ fontFamily: fonts.bold, fontSize: 17, color: colors.textStrong }}>
                {copy.title}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 13,
                  lineHeight: 19,
                  color: colors.textSecondary,
                }}
              >
                {copy.body}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 12,
                  lineHeight: 17,
                  color: colors.textMuted,
                  marginTop: 4,
                }}
              >
                {ANDROID_HEALTH_CONNECT_SETUP_EXPLAINER}
              </Text>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.primaryLabel}
            disabled={loading}
            onPress={() => void runStepsSetupAction()}
            style={({ pressed }) => ({
              marginTop: 20,
              alignItems: 'center',
              borderRadius: 999,
              paddingVertical: 14,
              backgroundColor: isDark ? '#c8f526' : '#ddfb43',
              opacity: loading ? 0.6 : pressed ? 0.88 : 1,
            })}
          >
            {loading ? (
              <ActivityIndicator color="#141c12" />
            ) : (
              <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: '#141c12' }}>
                {copy.primaryLabel}
              </Text>
            )}
          </Pressable>

          {copy.secondaryLabel ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setDismissedForStatus(status)}
              style={{ marginTop: 8, alignItems: 'center', paddingVertical: 8 }}
            >
              <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary }}>
                {copy.secondaryLabel}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(120, 130, 115, 0.35)',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
});
