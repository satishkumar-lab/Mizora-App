import { Text, View } from 'react-native';

import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { Card } from '@/components/ui/Card';
import type { StreakPersonalRecord } from '@/lib/streakStats';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

type StreakPersonalRecordsCardProps = {
  records: StreakPersonalRecord[];
};

function RecordRow({ row, isFirst }: { row: StreakPersonalRecord; isFirst: boolean }) {
  const { colors } = useMizoraTheme();
  return (
    <View
      className="flex-row items-center justify-between py-3.5"
      style={{
        borderTopWidth: isFirst ? 0 : 1,
        borderTopColor: colors.borderDivider,
      }}
    >
      <View className="min-w-0 flex-1 flex-row items-center gap-3">
        <MetricBadgeIcon kind={row.metric} size={40} />
        <Text
          numberOfLines={2}
          style={{
            fontFamily: fonts.regular,
            fontSize: 14,
            color: colors.textSecondary,
            lineHeight: 19,
            flex: 1,
            paddingRight: 12,
          }}
        >
          {row.label}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 15,
          color: colors.textStrong,
          fontVariant: ['tabular-nums'],
          textAlign: 'right',
          maxWidth: 120,
        }}
      >
        {row.value}
      </Text>
    </View>
  );
}

export function StreakPersonalRecordsCard({ records }: StreakPersonalRecordsCardProps) {
  const { colors } = useMizoraTheme();
  return (
    <Card className="overflow-hidden p-0">
      <View className="border-b px-4 pb-3 pt-4" style={{ borderBottomColor: colors.borderDivider }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 16, color: colors.textStrong }}>
          Personal Records
        </Text>
        <Text
          style={{
            fontFamily: fonts.regular,
            fontSize: 12,
            color: colors.textMuted,
            marginTop: 4,
            lineHeight: 16,
          }}
        >
          Your all-time bests from Mizora
        </Text>
      </View>
      <View className="px-4 pb-2 pt-1">
        {records.map((row, index) => (
          <RecordRow key={row.id} row={row} isFirst={index === 0} />
        ))}
      </View>
    </Card>
  );
}
