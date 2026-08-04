import { Text, View } from 'react-native';

import { CaloriesArcRing } from '@/components/calories/CaloriesArcRing';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { Card } from '@/components/ui/Card';
import { LiveBadge } from '@/components/ui/LiveBadge';
import { kcalPerThousandSteps } from '@/lib/calories-estimate';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { themedHairlineColor } from '@/utils/chartGridStyle';
import { fonts } from '@/theme/tokens';

type CaloriesDetailHeroCardProps = {
  activeKcal: number;
  goalKcal: number;
  stepsToday: number;
  vsYesterdayKcal: number;
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

export function CaloriesDetailHeroCard({
  activeKcal,
  goalKcal,
  stepsToday,
  vsYesterdayKcal,
}: CaloriesDetailHeroCardProps) {
  const { colors, isDark } = useMizoraTheme();
  const hairline = themedHairlineColor(isDark, colors);
  const per1k = kcalPerThousandSteps();
  const vsLabel = vsYesterdayKcal >= 0 ? `+${vsYesterdayKcal} kcal` : `${vsYesterdayKcal} kcal`;
  const progressPct = Math.min(100, Math.round((activeKcal / Math.max(goalKcal, 1)) * 100));

  return (
    <Card className="overflow-hidden p-0">
      <View className="flex-row items-center justify-between px-4 pb-1 pt-4">
        <View className="flex-row items-center gap-2">
          <MetricBadgeIcon kind="calories" size={34} />
          <View>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 14,
                color: colors.textStrong,
                lineHeight: 17,
              }}
            >
              From your steps
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 10,
                color: colors.textMuted,
                marginTop: 1,
              }}
            >
              {stepsToday.toLocaleString()} steps · {progressPct}% of {goalKcal.toLocaleString()}{' '}
              kcal
            </Text>
          </View>
        </View>
        <LiveBadge size="md" />
      </View>

      <View className="items-center px-4 py-3">
        <CaloriesArcRing totalKcal={activeKcal} goalKcal={goalKcal} />
      </View>

      <View
        className="mx-4 mb-5 flex-row items-center pt-4"
        style={{ borderTopWidth: 1, borderTopColor: hairline }}
      >
        <StatCell label="Per 1k steps" value={`${per1k} kcal`} />
        <View className="h-7 w-px" style={{ backgroundColor: colors.track }} />
        <StatCell label="vs yesterday" value={vsLabel} />
        <View className="h-7 w-px" style={{ backgroundColor: colors.track }} />
        <StatCell label="Steps" value={stepsToday.toLocaleString()} />
      </View>
    </Card>
  );
}

export function CaloriesMomentumBanner({
  vsYesterdayKcal,
  kcalPer1k,
}: {
  vsYesterdayKcal: number;
  kcalPer1k: number;
}) {
  const positive = vsYesterdayKcal >= 0;
  const { colors, isDark } = useMizoraTheme();
  return (
    <View
      className="overflow-hidden rounded-[18px] border border-[#f2f3f0] px-4 py-4 dark:border-[#2a332a]"
      style={{ backgroundColor: isDark ? colors.surfaceMuted : '#fafbf4' }}
    >
      <View className="flex-row items-start gap-3">
        <View
          className="h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: isDark ? '#2a332a' : '#f8ffd2' }}
        >
          <Text style={{ fontSize: 18 }}>{positive ? '↑' : '↓'}</Text>
        </View>
        <View className="flex-1">
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: 15,
              color: colors.textStrong,
              lineHeight: 20,
            }}
          >
            {positive
              ? `${vsYesterdayKcal} kcal more than yesterday (from steps)`
              : `${Math.abs(vsYesterdayKcal)} kcal less than yesterday (from steps)`}
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 12,
              color: colors.textSecondary,
              marginTop: 4,
              lineHeight: 17,
            }}
          >
            Mizora counts calories from walking only — ~{kcalPer1k} kcal per 1,000 steps at your
            current estimate.
          </Text>
        </View>
      </View>
    </View>
  );
}
