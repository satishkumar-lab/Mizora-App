import { Text, View } from 'react-native';

import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { UnlockScreenTimeArcRing } from '@/components/unlock/impact/UnlockScreenTimeArcRing';
import { Card } from '@/components/ui/Card';
import { LiveBadge } from '@/components/ui/LiveBadge';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import type { UnlockImpactSummary } from '@/lib/unlockImpactStats';
import { formatCompactSteps, formatDurationShort } from '@/lib/unlockImpactStats';
import { themedHairlineColor } from '@/utils/chartGridStyle';
import { fonts } from '@/theme/tokens';

function StatCell({
  label,
  value,
  labelColor,
  valueColor,
}: {
  label: string;
  value: string;
  labelColor: string;
  valueColor: string;
}) {
  return (
    <View className="flex-1 items-center">
      <Text style={{ fontFamily: fonts.medium, fontSize: 9, color: labelColor, lineHeight: 11 }}>
        {label}
      </Text>
      <Text
        style={{
          fontFamily: fonts.bold,
          fontSize: 15,
          color: valueColor,
          marginTop: 3,
          lineHeight: 18,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

type UnlockImpactHeroCardProps = {
  impact: UnlockImpactSummary;
};

export function UnlockImpactHeroCard({ impact }: UnlockImpactHeroCardProps) {
  const { colors, isDark } = useMizoraTheme();
  const hairline = themedHairlineColor(isDark, colors);
  const walkShort = formatDurationShort(impact.walkingMinutesThisWeek);

  return (
    <Card className="overflow-hidden p-0">
      <View className="flex-row items-center justify-between px-4 pb-1 pt-4">
        <View className="flex-row items-center gap-2">
          <MetricBadgeIcon kind="unlock" size={34} />
          <View>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 14,
                color: colors.textStrong,
                lineHeight: 17,
              }}
            >
              Weekly unlock impact
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 10,
                color: colors.textMuted,
                marginTop: 1,
              }}
            >
              {impact.blockedAppsCount} apps · ↑ {impact.vsLastWeekPct}% vs last week
            </Text>
          </View>
        </View>
        <LiveBadge size="md" />
      </View>

      <View className="items-center px-4 py-3">
        <UnlockScreenTimeArcRing
          savedMinutes={impact.screenTimeSavedMinutesThisWeek}
          goalMinutes={impact.screenTimeWeekGoalMinutes}
        />
      </View>

      <View
        className="mx-4 mb-5 flex-row items-center pt-4"
        style={{ borderTopWidth: 1, borderTopColor: hairline }}
      >
        <StatCell
          label="Unlock steps"
          value={formatCompactSteps(impact.unlockStepsThisWeek)}
          labelColor={colors.textMuted}
          valueColor={colors.textStrong}
        />
        <View className="h-7 w-px" style={{ backgroundColor: hairline }} />
        <StatCell
          label="Walk time"
          value={walkShort}
          labelColor={colors.textMuted}
          valueColor={colors.textStrong}
        />
        <View className="h-7 w-px" style={{ backgroundColor: hairline }} />
        <StatCell
          label="Save goal"
          value={`${impact.screenTimeWeekProgressPct}%`}
          labelColor={colors.textMuted}
          valueColor={colors.textStrong}
        />
      </View>
    </Card>
  );
}
