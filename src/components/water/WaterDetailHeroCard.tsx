import { Text, View } from 'react-native';

import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { WaterArcRing } from '@/components/water/WaterArcRing';
import { Card } from '@/components/ui/Card';
import { LiveBadge } from '@/components/ui/LiveBadge';
import { formatLitersValueFromMl } from '@/lib/water-recommendation';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { themedHairlineColor } from '@/utils/chartGridStyle';
import { fonts } from '@/theme/tokens';

type WaterDetailHeroCardProps = {
  currentMl: number;
  goalMl: number;
  remainingMl: number;
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

export function WaterDetailHeroCard({ currentMl, goalMl, remainingMl }: WaterDetailHeroCardProps) {
  const { colors, isDark } = useMizoraTheme();
  const hairline = themedHairlineColor(isDark, colors);
  const remainingLiters = formatLitersValueFromMl(Math.max(0, remainingMl));
  const goalLiters = formatLitersValueFromMl(goalMl);
  const progressPct = Math.min(100, Math.round((currentMl / Math.max(goalMl, 1)) * 100));

  return (
    <Card className="overflow-hidden p-0">
      <View className="flex-row items-center justify-between px-4 pb-1 pt-4">
        <View className="flex-row items-center gap-2">
          <MetricBadgeIcon kind="water" size={34} />
          <View>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 14,
                color: colors.textStrong,
                lineHeight: 17,
              }}
            >
              Today&apos;s hydration
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 10,
                color: colors.textMuted,
                marginTop: 1,
              }}
            >
              {remainingMl > 0
                ? `${remainingLiters} L left · ${progressPct}% of ${goalLiters} L`
                : `Daily target reached · ${goalLiters} L`}
            </Text>
          </View>
        </View>
        <LiveBadge size="md" />
      </View>

      <View className="items-center px-4 py-3">
        <WaterArcRing currentMl={currentMl} goalMl={goalMl} />
      </View>

      <View
        className="mx-4 mb-5 flex-row items-center pt-4"
        style={{ borderTopWidth: 1, borderTopColor: hairline }}
      >
        <StatCell label="Logged" value={`${currentMl.toLocaleString()} ml`} />
        <View className="h-7 w-px" style={{ backgroundColor: colors.track }} />
        <StatCell label="Remaining" value={`${Math.max(0, remainingMl).toLocaleString()} ml`} />
        <View className="h-7 w-px" style={{ backgroundColor: colors.track }} />
        <StatCell label="Target" value={`${goalLiters} L`} />
      </View>
    </Card>
  );
}
