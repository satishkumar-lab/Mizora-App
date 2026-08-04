import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { WATER_PAGE } from '@/constants/waterTheme';
import {
  WATER_GOAL_MAX_ML,
  WATER_GOAL_MIN_ML,
  WATER_GOAL_STEP_ML,
  clampWaterGoalMl,
  formatLitersValueFromMl,
} from '@/lib/water-recommendation';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

type WaterDailyTargetCardProps = {
  goalMl: number;
  onChangeGoalMl: (ml: number) => void;
};

/** Daily target row + settings hint — kept as its own card per product feedback. */
export function WaterDailyTargetCard({ goalMl, onChangeGoalMl }: WaterDailyTargetCardProps) {
  const { colors } = useMizoraTheme();
  const atMin = goalMl <= WATER_GOAL_MIN_ML;
  const atMax = goalMl >= WATER_GOAL_MAX_ML;

  return (
    <Card className="gap-3 p-4">
      <View className="flex-row items-center justify-between gap-3">
        <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary }}>
          Daily target
        </Text>
        <View className="flex-row items-center gap-2">
          <Pressable
            accessibilityRole="button"
            disabled={atMin}
            onPress={() => onChangeGoalMl(clampWaterGoalMl(goalMl - WATER_GOAL_STEP_ML))}
            className="h-9 w-9 items-center justify-center rounded-full border"
            style={{
              opacity: atMin ? 0.4 : 1,
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="remove" size={18} color={WATER_PAGE.icon} />
          </Pressable>
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: 16,
              color: colors.textStrong,
              minWidth: 56,
              textAlign: 'center',
            }}
          >
            {formatLitersValueFromMl(goalMl)} L
          </Text>
          <Pressable
            accessibilityRole="button"
            disabled={atMax}
            onPress={() => onChangeGoalMl(clampWaterGoalMl(goalMl + WATER_GOAL_STEP_ML))}
            className="h-9 w-9 items-center justify-center rounded-full border"
            style={{
              opacity: atMax ? 0.4 : 1,
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="add" size={18} color={WATER_PAGE.icon} />
          </Pressable>
        </View>
      </View>
      <Text
        style={{ fontFamily: fonts.regular, fontSize: 11, color: colors.textMuted, lineHeight: 16 }}
      >
        Add weight & activity in Settings later for a suggested daily goal.
      </Text>
    </Card>
  );
}
