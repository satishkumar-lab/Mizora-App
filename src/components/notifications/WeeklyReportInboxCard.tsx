import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { ForwardChevronIcon } from '@/components/icons/ForwardChevronIcon';
import { Card } from '@/components/ui/Card';
import { UNLOCK_REWARDS_V2_ENABLED } from '@/constants/productScope';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { formatWeeklyInboxStatLine, summarizeWeeklyHealth } from '@/lib/health/weeklyHealthSummary';
import { useStepsMetricsLive } from '@/hooks/useStepsMetricsLive';
import { useSteps } from '@/providers/StepsProvider';
import { useWaterIntake } from '@/providers/WaterIntakeProvider';
import { fonts } from '@/theme/tokens';

type WeeklyReportInboxCardProps = {
  onPress: () => void;
  read?: boolean;
};

/** Primary inbox entry — opens V1 health weekly report or V2 unlock impact. */
export function WeeklyReportInboxCard({ onPress, read }: WeeklyReportInboxCardProps) {
  const { colors, isDark } = useMizoraTheme();
  const badgeAppearance = read ? 'read' : 'default';
  const { snapshot, hourlySlots } = useSteps();
  const { metricsLive } = useStepsMetricsLive();
  const { loggedMl } = useWaterIntake();

  const summary = useMemo(
    () => (metricsLive ? summarizeWeeklyHealth(snapshot.week, loggedMl, hourlySlots) : null),
    [metricsLive, snapshot.week, loggedMl, hourlySlots],
  );

  const subtitle = UNLOCK_REWARDS_V2_ENABLED
    ? 'Your week in Mizora — steps, unlocks, and screen time saved.'
    : 'Steps, water, active calories, and when you walked most this week.';

  const statLine = UNLOCK_REWARDS_V2_ENABLED
    ? '1.6 hrs saved · 11.4K unlock steps'
    : metricsLive && summary
      ? formatWeeklyInboxStatLine(summary)
      : 'Connect step tracking for weekly steps & calories';

  const badgeKind = UNLOCK_REWARDS_V2_ENABLED ? 'unlock' : 'steps';

  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <Card
        className="overflow-hidden p-0"
        style={{
          borderWidth: 0.67,
          borderColor: colors.borderDivider,
        }}
      >
        <View className="px-4 py-4" style={{ gap: 12 }}>
          <View className="flex-row gap-3">
            <MetricBadgeIcon kind={badgeKind} size={44} appearance={badgeAppearance} />
            <View className="min-w-0 flex-1" style={{ gap: 4 }}>
              <View className="flex-row flex-wrap items-center gap-2">
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: 14,
                    color: read ? colors.textSecondary : colors.textStrong,
                  }}
                >
                  Weekly report
                </Text>
                {!read ? (
                  <View
                    className="rounded-full px-2 py-0.5"
                    style={{ backgroundColor: isDark ? 'rgba(52, 199, 89, 0.2)' : '#d7ffc7' }}
                  >
                    <Text style={{ fontFamily: fonts.medium, fontSize: 8, color: '#34c759' }}>
                      NEW
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 10,
                  color: colors.textSecondary,
                  lineHeight: 15,
                }}
              >
                {subtitle}
              </Text>
            </View>
          </View>

          <View
            className="flex-row items-center justify-between rounded-[14px] px-3.5 py-3"
            style={{
              backgroundColor: isDark ? colors.surfaceSecondary : colors.surfaceMuted,
              borderWidth: 0.67,
              borderColor: colors.borderDivider,
            }}
          >
            <View className="min-w-0 flex-1" style={{ gap: 2 }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 9, color: colors.textMuted }}>
                This week · Mon – Sun
              </Text>
              <Text
                numberOfLines={2}
                style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.textStrong }}
              >
                {statLine}
              </Text>
              {!UNLOCK_REWARDS_V2_ENABLED &&
              metricsLive &&
              summary &&
              summary.peakWalkWindow !== 'No Activity' ? (
                <Text
                  numberOfLines={2}
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 10,
                    color: colors.textSecondary,
                    lineHeight: 14,
                  }}
                >
                  Peak walks · {summary.peakWalkWindow}
                </Text>
              ) : null}
            </View>
            <MetricBadgeIcon kind="steps" size={36} appearance={badgeAppearance} />
          </View>

          <View className="flex-row items-center justify-center gap-1">
            <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: '#34c759' }}>
              View weekly report
            </Text>
            <ForwardChevronIcon size={16} color="#34c759" />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
