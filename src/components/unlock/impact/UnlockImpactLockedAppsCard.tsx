import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { AppBrandIcon } from '@/components/icons/AppBrandIcon';
import { ForwardChevronIcon } from '@/components/icons/ForwardChevronIcon';
import { Card } from '@/components/ui/Card';
import { formatCompactSteps, type UnlockImpactAppWeekRow } from '@/lib/unlockImpactStats';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { themedHairlineColor } from '@/utils/chartGridStyle';
import { fonts } from '@/theme/tokens';

const BAR_H = 5;

function TodayStatus({ row }: { row: UnlockImpactAppWeekRow }) {
  const { colors } = useMizoraTheme();
  if (row.unlockedToday) {
    return (
      <View
        className="flex-row items-center rounded-full px-2 py-0.5"
        style={{ backgroundColor: '#d7ffc7' }}
      >
        <Ionicons name="checkmark" size={10} color="#34c759" />
        <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: '#34c759', marginLeft: 3 }}>
          Open today
        </Text>
      </View>
    );
  }
  if (row.goalCompleteToday && row.userLockedToday) {
    return (
      <View
        className="flex-row items-center rounded-full px-2 py-0.5"
        style={{ backgroundColor: colors.surfaceMuted }}
      >
        <Ionicons name="lock-closed" size={9} color={colors.textSecondary} />
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: 10,
            color: colors.textSecondary,
            marginLeft: 3,
          }}
        >
          You locked
        </Text>
      </View>
    );
  }
  return (
    <View
      className="flex-row items-center rounded-full px-2 py-0.5"
      style={{ backgroundColor: colors.surfaceMuted }}
    >
      <Ionicons name="lock-closed" size={9} color={colors.textSecondary} />
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 10,
          color: colors.textSecondary,
          marginLeft: 3,
        }}
      >
        Locked
      </Text>
    </View>
  );
}

type UnlockImpactLockedAppsCardProps = {
  rows: UnlockImpactAppWeekRow[];
  maxStepsWeek: number;
  onAppPress?: (appId: UnlockImpactAppWeekRow['id']) => void;
};

export function UnlockImpactLockedAppsCard({
  rows,
  maxStepsWeek,
  onAppPress,
}: UnlockImpactLockedAppsCardProps) {
  const { colors, isDark } = useMizoraTheme();
  const hairline = themedHairlineColor(isDark, colors);
  return (
    <Card className="overflow-hidden p-0">
      <View className="border-b px-4 py-3.5" style={{ borderBottomColor: colors.borderDivider }}>
        <Text style={{ fontFamily: fonts.medium, fontSize: 16, color: colors.textStrong }}>
          Apps you are locking
        </Text>
        <Text
          style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted, marginTop: 2 }}
        >
          Weekly steps earned toward each unlock
        </Text>
      </View>

      <View className="px-4 py-2" style={{ backgroundColor: colors.card }}>
        {rows.map((row, index) => {
          const pct = Math.min(
            100,
            Math.round((row.stepsThisWeek / Math.max(maxStepsWeek, 1)) * 100),
          );
          const body = (
            <View className="flex-row items-center gap-3 py-3">
              <AppBrandIcon app={row.id} size={44} />
              <View className="min-w-0 flex-1" style={{ gap: 8 }}>
                <View className="flex-row items-center justify-between gap-2">
                  <Text
                    numberOfLines={1}
                    style={{
                      flex: 1,
                      fontFamily: fonts.medium,
                      fontSize: 14,
                      color: colors.textStrong,
                    }}
                  >
                    {row.name}
                  </Text>
                  <TodayStatus row={row} />
                </View>
                <View
                  style={{
                    height: BAR_H,
                    borderRadius: BAR_H / 2,
                    overflow: 'hidden',
                    backgroundColor: colors.track,
                  }}
                >
                  <View
                    style={{
                      height: BAR_H,
                      width: `${pct}%`,
                      backgroundColor: '#34c759',
                    }}
                  />
                </View>
                <View className="flex-row justify-between">
                  <Text
                    style={{ fontFamily: fonts.medium, fontSize: 10, color: colors.textSecondary }}
                  >
                    {formatCompactSteps(row.stepsThisWeek)} steps this week
                  </Text>
                  <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: colors.textMuted }}>
                    {pct}% of top app
                  </Text>
                </View>
              </View>
              {onAppPress ? <ForwardChevronIcon size={18} color={colors.textMuted} /> : null}
            </View>
          );

          return (
            <View key={row.id}>
              {index > 0 ? <View className="h-px" style={{ backgroundColor: hairline }} /> : null}
              {onAppPress ? (
                <Pressable accessibilityRole="button" onPress={() => onAppPress(row.id)}>
                  {body}
                </Pressable>
              ) : (
                body
              )}
            </View>
          );
        })}
      </View>
    </Card>
  );
}
