import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { Card } from '@/components/ui/Card';
import { CardInsetDivider } from '@/components/ui/CardInsetDivider';
import { LiveBadge } from '@/components/ui/LiveBadge';
import { UnlockRuleMotivationHeader } from '@/components/unlock/UnlockRuleMotivationHeader';
import { UnlockRuleProgressRing } from '@/components/unlock/UnlockRuleProgressRing';
import {
  STEP_UNLOCK_MAX,
  STEP_UNLOCK_MIN,
  STEP_UNLOCK_STEP,
  UNLOCK_WATER_MAX_ML,
  UNLOCK_WATER_MIN_ML,
  UNLOCK_WATER_STEP_ML,
  challengeProgressRatio,
  formatStepShort,
  type RewardAppItem,
} from '@/constants/unlockRewards';
import { formatLitersValueFromMl } from '@/lib/water-recommendation';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

type AppUnlockRuleEditorProps = {
  app: RewardAppItem;
  onSelectSteps: () => void;
  onSelectWater: () => void;
  onAdjustSteps: (delta: number) => void;
  onAdjustWater: (deltaMl: number) => void;
  suggestedStepGoal?: number;
  suggestedWaterGoalMl?: number;
  smartGoalsEnabled?: boolean;
  onApplySuggestedSteps?: () => void;
  onApplySuggestedWater?: () => void;
};

function TypeSegment({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
}) {
  const { colors } = useMizoraTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className="flex-1 flex-row items-center justify-center gap-1 rounded-full py-1.5"
      style={{
        backgroundColor: selected ? colors.card : 'transparent',
      }}
    >
      <Ionicons name={icon} size={12} color={selected ? colors.textStrong : colors.textMuted} />
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 12,
          color: selected ? colors.textStrong : colors.textMuted,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function GoalStepper({
  label,
  value,
  hint,
  atMin,
  atMax,
  onDecrease,
  onIncrease,
}: {
  label: string;
  value: string;
  hint: string;
  atMin: boolean;
  atMax: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  const { colors } = useMizoraTheme();
  return (
    <View style={{ gap: 8 }}>
      <View className="flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1" style={{ gap: 2 }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.textSecondary }}>
            {label}
          </Text>
          <Text style={{ fontFamily: fonts.regular, fontSize: 10, color: colors.textMuted }}>
            {hint}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Decrease goal"
            disabled={atMin}
            onPress={onDecrease}
            className="h-8 w-8 items-center justify-center rounded-full border"
            style={{
              opacity: atMin ? 0.35 : 1,
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="remove" size={16} color="#5c6d05" />
          </Pressable>
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 17,
              color: colors.textStrong,
              minWidth: 52,
              textAlign: 'center',
            }}
          >
            {value}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Increase goal"
            disabled={atMax}
            onPress={onIncrease}
            className="h-8 w-8 items-center justify-center rounded-full border"
            style={{
              opacity: atMax ? 0.35 : 1,
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="add" size={16} color="#5c6d05" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

/** User chooses step count or water goal to unlock this app (PRD user control). */
export function AppUnlockRuleEditor({
  app,
  onSelectSteps,
  onSelectWater,
  onAdjustSteps,
  onAdjustWater,
  suggestedStepGoal,
  suggestedWaterGoalMl,
  smartGoalsEnabled = false,
  onApplySuggestedSteps,
  onApplySuggestedWater,
}: AppUnlockRuleEditorProps) {
  const { colors, isDark } = useMizoraTheme();
  const challenge = app.challenge;
  const isSteps = challenge.kind === 'steps';
  const progress = challengeProgressRatio(challenge);

  const goalDisplay = isSteps
    ? formatStepShort(challenge.goalSteps)
    : `${formatLitersValueFromMl(challenge.goalMl)} L`;

  const adjustHint = isSteps
    ? `±${STEP_UNLOCK_STEP.toLocaleString()} steps per tap`
    : `±${UNLOCK_WATER_STEP_ML} ml per tap`;

  return (
    <View style={{ gap: 14 }}>
      <UnlockRuleMotivationHeader appName={app.name} />

      <Card className="overflow-hidden p-0">
        <View className="flex-row items-center justify-between px-4 pb-0 pt-4">
          <View className="flex-row items-center gap-2">
            <MetricBadgeIcon kind="unlock" size={32} />
            <Text style={{ fontFamily: fonts.medium, fontSize: 15, color: colors.textStrong }}>
              Your unlock rule
            </Text>
          </View>
          <LiveBadge size="xs" />
        </View>

        <UnlockRuleProgressRing progress={progress} unlocked={app.unlocked} />

        <CardInsetDivider top={4} bottom={0} />

        <View className="px-4 pb-4 pt-3" style={{ gap: 12 }}>
          <View
            className="flex-row self-center rounded-full p-0.5"
            style={{
              backgroundColor: isDark ? colors.surfaceSecondary : '#eceee9',
              width: '100%',
              maxWidth: 220,
            }}
          >
            <TypeSegment
              label="Steps"
              icon="footsteps"
              selected={isSteps}
              onPress={onSelectSteps}
            />
            <TypeSegment label="Water" icon="water" selected={!isSteps} onPress={onSelectWater} />
          </View>

          <GoalStepper
            label={isSteps ? 'Step goal' : 'Water goal'}
            value={goalDisplay}
            hint={adjustHint}
            atMin={
              isSteps
                ? challenge.goalSteps <= STEP_UNLOCK_MIN
                : challenge.goalMl <= UNLOCK_WATER_MIN_ML
            }
            atMax={
              isSteps
                ? challenge.goalSteps >= STEP_UNLOCK_MAX
                : challenge.goalMl >= UNLOCK_WATER_MAX_ML
            }
            onDecrease={() =>
              isSteps ? onAdjustSteps(-STEP_UNLOCK_STEP) : onAdjustWater(-UNLOCK_WATER_STEP_ML)
            }
            onIncrease={() =>
              isSteps ? onAdjustSteps(STEP_UNLOCK_STEP) : onAdjustWater(UNLOCK_WATER_STEP_ML)
            }
          />

          {smartGoalsEnabled &&
          isSteps &&
          suggestedStepGoal != null &&
          suggestedStepGoal !== challenge.goalSteps &&
          onApplySuggestedSteps ? (
            <Pressable
              accessibilityRole="button"
              onPress={onApplySuggestedSteps}
              className="flex-row items-center justify-center gap-1.5 self-center rounded-full px-3 py-2"
              style={{ backgroundColor: isDark ? colors.surfaceSecondary : '#f4f6f3' }}
            >
              <Ionicons name="sparkles" size={12} color="#5c6d05" />
              <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: colors.textStrong }}>
                Use suggested {formatStepShort(suggestedStepGoal)} steps
              </Text>
            </Pressable>
          ) : null}

          {smartGoalsEnabled &&
          !isSteps &&
          suggestedWaterGoalMl != null &&
          suggestedWaterGoalMl !== challenge.goalMl &&
          onApplySuggestedWater ? (
            <Pressable
              accessibilityRole="button"
              onPress={onApplySuggestedWater}
              className="flex-row items-center justify-center gap-1.5 self-center rounded-full px-3 py-2"
              style={{ backgroundColor: isDark ? colors.surfaceSecondary : '#f4f6f3' }}
            >
              <Ionicons name="sparkles" size={12} color="#5c6d05" />
              <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: colors.textStrong }}>
                Use suggested {formatLitersValueFromMl(suggestedWaterGoalMl)} L
              </Text>
            </Pressable>
          ) : null}
        </View>
      </Card>
    </View>
  );
}
