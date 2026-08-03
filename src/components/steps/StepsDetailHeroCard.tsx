import { Text, View } from 'react-native';

import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { StepsArcRing } from '@/components/steps/StepsArcRing';
import { Card } from '@/components/ui/Card';
import { fonts } from '@/theme/tokens';

type StepsDetailHeroCardProps = {
  steps: number;
  goal: number;
  remaining: number;
  progressPct: number;
};

function LiveBadge() {
  return (
    <View
      className="flex-row items-center rounded-full px-2.5 py-1"
      style={{ backgroundColor: 'rgba(215,255,199,0.71)' }}
    >
      <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: '#34c759' }}>Live</Text>
      <View className="ml-1.5 h-2 w-2 rounded-full bg-[#34c759]" />
    </View>
  );
}

function StatCell({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <View className="flex-1 items-center">
      <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: '#626b5e' }}>{label}</Text>
      <Text className="mt-1">
        <Text style={{ fontFamily: fonts.bold, fontSize: 17, color: '#141c12' }}>{value}</Text>
        {unit ? (
          <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: '#626b5e' }}> {unit}</Text>
        ) : null}
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
  return (
    <Card className="overflow-hidden p-0">
      <View className="flex-row items-center justify-between px-4 pb-1 pt-3.5">
        <View className="flex-row items-center gap-2.5">
          <MetricBadgeIcon kind="steps" size={40} />
          <View>
            <Text
              style={{ fontFamily: fonts.medium, fontSize: 14, color: '#141c12', lineHeight: 18 }}
            >
              Daily progress
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 11,
                color: '#8e8e93',
                lineHeight: 14,
                marginTop: 2,
              }}
            >
              {goal.toLocaleString()} step goal
            </Text>
          </View>
        </View>
        <LiveBadge />
      </View>

      <View className="items-center pb-1 pt-0">
        <StepsArcRing steps={steps} goal={goal} size="hero" />
      </View>

      <View className="mx-4 mb-4 mt-1 flex-row items-center rounded-[12px] bg-[#f4f6f3] py-3">
        <StatCell
          label="Remaining"
          value={remaining > 0 ? remaining.toLocaleString() : '0'}
          unit="steps"
        />
        <View className="h-9 w-px bg-[#e5ece2]" />
        <StatCell label="Completed" value={`${progressPct}%`} />
        <View className="h-9 w-px bg-[#e5ece2]" />
        <StatCell label="Logged today" value={steps.toLocaleString()} />
      </View>
    </Card>
  );
}
