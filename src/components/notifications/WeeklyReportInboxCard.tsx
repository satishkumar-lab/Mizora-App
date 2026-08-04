import { Pressable, Text, View } from 'react-native';

import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { ForwardChevronIcon } from '@/components/icons/ForwardChevronIcon';
import { Card } from '@/components/ui/Card';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

type WeeklyReportInboxCardProps = {
  onPress: () => void;
  read?: boolean;
};

/** Primary inbox entry — opens full weekly report (unlock impact). */
export function WeeklyReportInboxCard({ onPress, read }: WeeklyReportInboxCardProps) {
  const { colors, isDark } = useMizoraTheme();
  const badgeAppearance = read ? 'read' : 'default';

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
            <MetricBadgeIcon kind="unlock" size={44} appearance={badgeAppearance} />
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
                Your week in Mizora — steps, unlocks, and screen time saved.
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
            <View style={{ gap: 2 }}>
              <Text style={{ fontFamily: fonts.medium, fontSize: 9, color: colors.textMuted }}>
                This week · Mon – Sun
              </Text>
              <Text style={{ fontFamily: fonts.bold, fontSize: 13, color: colors.textStrong }}>
                1.6 hrs saved · 11.4K unlock steps
              </Text>
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
