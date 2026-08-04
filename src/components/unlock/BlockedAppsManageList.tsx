import { Pressable, Text, View } from 'react-native';

import { AppBrandIcon } from '@/components/icons/AppBrandIcon';
import type { AppBrandId } from '@/components/icons/AppBrandIcon';
import { ForwardChevronIcon } from '@/components/icons/ForwardChevronIcon';
import { MizoraSwitch } from '@/components/unlock/MizoraSwitch';
import { Card } from '@/components/ui/Card';
import {
  clampStepUnlockGoal,
  clampUnlockWaterGoalMl,
  formatGoalLiters,
  formatStepShort,
  type UnlockAppConfig,
  type UnlockChallengeConfig,
} from '@/constants/unlockRewards';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { themedHairlineColor } from '@/utils/chartGridStyle';
import { fonts } from '@/theme/tokens';

const STEP_PRESETS = [500, 1000, 1500, 2000] as const;
const WATER_PRESETS_ML = [500, 1000, 1500, 2000] as const;

function PresetChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors, isDark } = useMizoraTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      className="rounded-full px-3 py-1.5"
      style={{
        backgroundColor: active ? '#ddfb43' : isDark ? colors.surfaceSecondary : '#f4f6f3',
      }}
    >
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 11,
          color: active ? '#141c12' : colors.textSecondary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function KindChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors, isDark } = useMizoraTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      className="flex-1 items-center rounded-[10px] py-2"
      style={{
        backgroundColor: active ? '#ddfb43' : isDark ? colors.surfaceSecondary : '#f4f6f3',
      }}
    >
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 12,
          color: active ? '#141c12' : colors.textSecondary,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type BlockedAppManageRowProps = {
  config: UnlockAppConfig;
  lockOn: boolean;
  switchDisabled?: boolean;
  onToggleLock: (enabled: boolean) => void;
  onSelectChallengeKind: (kind: UnlockChallengeConfig['kind']) => void;
  onSetStepGoal: (steps: number) => void;
  onSetWaterGoal: (ml: number) => void;
  onOpenDetail?: () => void;
};

export function BlockedAppManageRow({
  config,
  lockOn,
  switchDisabled,
  onToggleLock,
  onSelectChallengeKind,
  onSetStepGoal,
  onSetWaterGoal,
  onOpenDetail,
}: BlockedAppManageRowProps) {
  const { colors } = useMizoraTheme();
  const challenge = config.challenge;

  let targetSummary: string;
  if (!lockOn) {
    targetSummary = "Tap to add to today's challenge";
  } else if (challenge.kind === 'steps') {
    targetSummary = `Unlock after ${formatStepShort(challenge.goalSteps)} steps`;
  } else {
    targetSummary = `Unlock after ${formatGoalLiters(challenge.goalMl)} water`;
  }

  return (
    <View className="px-4 py-3.5" style={{ gap: lockOn ? 12 : 0 }}>
      <View className="flex-row items-center gap-3">
        <AppBrandIcon app={config.id} size={44} />
        <View className="min-w-0 flex-1" style={{ gap: 2 }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.textStrong }}>
            {config.name}
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontSize: 11,
              color: colors.textMuted,
              lineHeight: 14,
            }}
          >
            {targetSummary}
          </Text>
        </View>
        <MizoraSwitch value={lockOn} onValueChange={onToggleLock} disabled={switchDisabled} />
      </View>

      {lockOn ? (
        <View style={{ gap: 10 }}>
          <View className="flex-row gap-2">
            <KindChip
              label="Steps"
              active={challenge.kind === 'steps'}
              onPress={() => onSelectChallengeKind('steps')}
            />
            <KindChip
              label="Water"
              active={challenge.kind === 'water'}
              onPress={() => onSelectChallengeKind('water')}
            />
          </View>

          <View className="flex-row flex-wrap gap-2">
            {challenge.kind === 'steps'
              ? STEP_PRESETS.map((steps) => (
                  <PresetChip
                    key={steps}
                    label={steps >= 1000 ? `${steps / 1000}K` : `${steps}`}
                    active={challenge.goalSteps === clampStepUnlockGoal(steps)}
                    onPress={() => onSetStepGoal(steps)}
                  />
                ))
              : WATER_PRESETS_ML.map((ml) => (
                  <PresetChip
                    key={ml}
                    label={ml >= 1000 ? `${ml / 1000}L` : `${ml}ml`}
                    active={challenge.goalMl === clampUnlockWaterGoalMl(ml)}
                    onPress={() => onSetWaterGoal(ml)}
                  />
                ))}
          </View>

          {onOpenDetail ? (
            <Pressable
              accessibilityRole="button"
              onPress={onOpenDetail}
              className="flex-row items-center justify-end gap-1 py-0.5"
            >
              <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: '#34c759' }}>
                Fine-tune target
              </Text>
              <ForwardChevronIcon size={16} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

type BlockedAppsManageListProps = {
  configs: UnlockAppConfig[];
  lockedCount: number;
  maxLocked: number;
  onToggleLock: (appId: AppBrandId, enabled: boolean) => void;
  onSelectChallengeKind: (appId: AppBrandId, kind: UnlockChallengeConfig['kind']) => void;
  onSetStepGoal: (appId: AppBrandId, steps: number) => void;
  onSetWaterGoal: (appId: AppBrandId, ml: number) => void;
  onOpenDetail: (appId: AppBrandId) => void;
};

export function BlockedAppsManageList({
  configs,
  lockedCount,
  maxLocked,
  onToggleLock,
  onSelectChallengeKind,
  onSetStepGoal,
  onSetWaterGoal,
  onOpenDetail,
}: BlockedAppsManageListProps) {
  const { colors, isDark } = useMizoraTheme();
  const hairline = themedHairlineColor(isDark, colors);
  const atMax = lockedCount >= maxLocked;

  return (
    <Card className="overflow-hidden p-0">
      {configs.map((config, index) => {
        const lockOn = config.lockEnabled !== false;
        const switchDisabled = !lockOn && atMax;

        return (
          <View key={config.id}>
            {index > 0 ? (
              <View className="mx-4 h-px" style={{ backgroundColor: hairline }} />
            ) : null}
            <BlockedAppManageRow
              config={config}
              lockOn={lockOn}
              switchDisabled={switchDisabled}
              onToggleLock={(enabled) => onToggleLock(config.id, enabled)}
              onSelectChallengeKind={(kind) => onSelectChallengeKind(config.id, kind)}
              onSetStepGoal={(steps) => onSetStepGoal(config.id, steps)}
              onSetWaterGoal={(ml) => onSetWaterGoal(config.id, ml)}
              onOpenDetail={() => onOpenDetail(config.id)}
            />
          </View>
        );
      })}
    </Card>
  );
}
