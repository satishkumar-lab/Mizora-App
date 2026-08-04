import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import {
  WATER_GOAL_MAX_ML,
  WATER_GOAL_MIN_ML,
  WATER_GOAL_STEP_ML,
  clampWaterGoalMl,
  formatLitersFromMl,
} from '@/lib/water-recommendation';
import { WATER_VISUAL } from '@/constants/waterTheme';
import { Card } from '@/components/ui/Card';
import { TitleSubtitleBlock } from '@/components/ui/TitleSubtitleBlock';
import { fonts } from '@/theme/tokens';

type WaterDailyGoalControlProps = {
  goalMl: number;
  onChangeGoalMl: (ml: number) => void;
};

function StepChip({
  disabled,
  onPress,
  icon,
}: {
  disabled: boolean;
  onPress: () => void;
  icon: 'remove' | 'add';
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className="h-12 w-12 items-center justify-center rounded-full border"
      style={{
        borderColor: WATER_VISUAL.border,
        backgroundColor: disabled ? '#f4f6f3' : '#ffffff',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Ionicons name={icon} size={22} color={disabled ? '#8e8e93' : WATER_VISUAL.fill} />
    </Pressable>
  );
}

export function WaterDailyGoalControl({ goalMl, onChangeGoalMl }: WaterDailyGoalControlProps) {
  const atMin = goalMl <= WATER_GOAL_MIN_ML;
  const atMax = goalMl >= WATER_GOAL_MAX_ML;

  const step = (delta: number) => {
    onChangeGoalMl(clampWaterGoalMl(goalMl + delta));
  };

  return (
    <Card className="gap-4 p-4">
      <TitleSubtitleBlock
        title="Daily amount"
        subtitle={`Adjust in ${WATER_GOAL_STEP_ML / 1000} L steps · ${formatLitersFromMl(WATER_GOAL_MIN_ML, 1)}–${formatLitersFromMl(WATER_GOAL_MAX_ML, 1)}`}
      />
      <View className="flex-row items-center justify-between gap-3">
        <StepChip disabled={atMin} onPress={() => step(-WATER_GOAL_STEP_ML)} icon="remove" />
        <View
          className="flex-1 items-center rounded-2xl px-4 py-3"
          style={{ backgroundColor: WATER_VISUAL.mutedSurface }}
        >
          <Text style={{ fontFamily: fonts.bold, fontSize: 28, color: '#141c12' }}>
            {formatLitersFromMl(goalMl, 1)}
          </Text>
          <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: '#626b5e', marginTop: 2 }}>
            per day
          </Text>
        </View>
        <StepChip disabled={atMax} onPress={() => step(WATER_GOAL_STEP_ML)} icon="add" />
      </View>
    </Card>
  );
}
