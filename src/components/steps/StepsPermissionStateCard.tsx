import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { Card } from '@/components/ui/Card';
import type { StepsTrackingStatus } from '@/lib/health/readTodaySteps';
import { isStepsTrackingLoading, stepsPermissionUiCopy } from '@/lib/health/stepsTrackingUi';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { openSystemSettings } from '@/utils/legalLinks';
import { fonts } from '@/theme/tokens';

type StepsPermissionStateCardProps = {
  status: StepsTrackingStatus;
  onPrimaryPress: () => void;
  compact?: boolean;
};

export function StepsPermissionStateCard({
  status,
  onPrimaryPress,
  compact = false,
}: StepsPermissionStateCardProps) {
  const { colors, isDark } = useMizoraTheme();
  const copy = stepsPermissionUiCopy(status);
  const loading = isStepsTrackingLoading(status);

  return (
    <Card className={compact ? 'gap-3 p-3.5' : 'gap-4 p-4'}>
      <View className="flex-row items-start gap-3">
        <MetricBadgeIcon kind="steps" size={compact ? 36 : 40} appearance="read" />
        <View className="min-w-0 flex-1" style={{ gap: 6 }}>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: compact ? 14 : 15,
              color: colors.textStrong,
            }}
          >
            {copy.title}
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: compact ? 11 : 12,
              lineHeight: compact ? 16 : 18,
              color: colors.textSecondary,
            }}
          >
            {copy.body}
          </Text>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={copy.primaryLabel}
          disabled={loading}
          onPress={onPrimaryPress}
          className="items-center rounded-full py-3"
          style={({ pressed }) => ({
            backgroundColor: isDark ? '#c8f526' : '#ddfb43',
            opacity: loading ? 0.6 : pressed ? 0.88 : 1,
          })}
        >
          {loading ? (
            <ActivityIndicator color="#141c12" />
          ) : (
            <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: '#141c12' }}>
              {copy.primaryLabel}
            </Text>
          )}
        </Pressable>

        {copy.secondaryLabel && !loading ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={copy.secondaryLabel}
            onPress={openSystemSettings}
            className="items-center py-2"
          >
            <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.textSecondary }}>
              {copy.secondaryLabel}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </Card>
  );
}
