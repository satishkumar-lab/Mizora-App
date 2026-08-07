import { Text, View } from 'react-native';

import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { StepsArcRing } from '@/components/steps/StepsArcRing';
import { Card } from '@/components/ui/Card';
import { StepsLiveBadge } from '@/components/steps/StepsLiveBadge';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { themedHairlineColor } from '@/utils/chartGridStyle';
import { fonts } from '@/theme/tokens';

type StepsDetailHeroCardProps = {
  steps: number;
  goal: number;
  remaining: number;
  progressPct: number;
};

function StatCell({ label, value }: { label: string; value: string }) {
  const { colors } = useMizoraTheme();
  return (
    <View className="flex-1 items-center">
      <Text
        style={{ fontFamily: fonts.medium, fontSize: 9, color: colors.textMuted, lineHeight: 11 }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: fonts.bold,
          fontSize: 15,
          color: colors.textStrong,
          marginTop: 3,
          lineHeight: 18,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

export function StepsDetailHeroCard({
  steps,
  goal,
  remaining,
  progressPct,
}: StepsDetailHeroCardProps) {
  const { colors, isDark } = useMizoraTheme();
  const hairline = themedHairlineColor(isDark, colors);
  return (
    <Card className="overflow-hidden p-0">
      <View className="flex-row items-center justify-between px-4 pb-1 pt-4">
        <View className="flex-row items-center gap-2">
          <MetricBadgeIcon kind="steps" size={34} />
          <View>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 14,
                color: colors.textStrong,
                lineHeight: 18,
              }}
            >
              Daily progress
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 10,
                color: colors.textMuted,
                marginTop: 1,
              }}
            >
              {goal.toLocaleString()} step goal
            </Text>
          </View>
        </View>
        <StepsLiveBadge size="md" />
      </View>

      <View className="items-center px-4 py-3">
        <StepsArcRing steps={steps} goal={goal} size="hero" />
      </View>

      <View
        className="mx-4 mb-5 flex-row items-center pt-4"
        style={{ borderTopWidth: 1, borderTopColor: hairline }}
      >
        <StatCell
          label="Remaining"
          value={`${remaining > 0 ? remaining.toLocaleString() : '0'} steps`}
        />
        <View className="h-7 w-px" style={{ backgroundColor: colors.track }} />
        <StatCell label="Completed" value={`${progressPct}%`} />
        <View className="h-7 w-px" style={{ backgroundColor: colors.track }} />
        <StatCell label="Logged today" value={steps.toLocaleString()} />
      </View>
    </Card>
  );
}
