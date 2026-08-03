import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { GoalStepper } from '@/components/goals/GoalStepper';
import { MetricBadgeIcon, type MetricBadgeKind } from '@/components/icons/MetricBadgeIcon';
import { Card } from '@/components/ui/Card';
import { MetricSectionHeader } from '@/components/ui/MetricSectionHeader';
import { GradientButton } from '@/components/ui/GradientButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useHealthGoals } from '@/hooks/useDailyStepGoal';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { mainTabBarFooterInset } from '@/constants/navigation';
import {
  STEP_GOAL_STEP,
  loadHealthGoals,
  type HealthGoalsState,
  type OptionalGoal,
} from '@/lib/steps-preferences';
import { fonts } from '@/theme/tokens';

function RequiredChip() {
  return (
    <View
      className="rounded-full px-2.5 py-1"
      style={{ backgroundColor: 'rgba(215,255,199,0.71)' }}
    >
      <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: '#34c759' }}>Required</Text>
    </View>
  );
}

function GoalSwitch({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: '#e5ece2', true: '#c8f526' }}
      thumbColor="#ffffff"
      ios_backgroundColor="#e5ece2"
    />
  );
}

function OptionalGoalRow({
  title,
  subtitle,
  badgeKind,
  optional,
  valueLabel,
  unitLabel,
  stepHint,
  onToggle,
  onDecrease,
  onIncrease,
  decreaseDisabled,
  increaseDisabled,
  showDivider,
  isFirst,
  isLast,
}: {
  title: string;
  subtitle: string;
  badgeKind: MetricBadgeKind;
  optional: OptionalGoal;
  valueLabel: string;
  unitLabel: string;
  stepHint?: string;
  onToggle: (enabled: boolean) => void;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseDisabled?: boolean;
  increaseDisabled?: boolean;
  showDivider?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const padY = optional.enabled ? 18 : 20;

  return (
    <View>
      {showDivider ? <View className="mx-[18px] h-px bg-[#f2f3f0]" /> : null}
      <View
        className="gap-4 px-[18px]"
        style={{
          paddingTop: isFirst ? 20 : padY,
          paddingBottom: isLast ? padY + 6 : padY,
        }}
      >
        <View className="flex-row items-center justify-between gap-4">
          <View className="flex-1 flex-row items-center gap-2.5">
            <MetricBadgeIcon kind={badgeKind} size={40} />
            <View className="flex-1 shrink">
              <Text
                style={{ fontFamily: fonts.medium, fontSize: 14, color: '#141c12', lineHeight: 18 }}
              >
                {title}
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
                {subtitle}
              </Text>
            </View>
          </View>
          <GoalSwitch value={optional.enabled} onValueChange={onToggle} />
        </View>

        {optional.enabled ? (
          <View className="rounded-[12px] bg-[#f4f6f3] p-3.5">
            <GoalStepper
              valueLabel={valueLabel}
              unitLabel={unitLabel}
              hint={stepHint}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
              decreaseDisabled={decreaseDisabled}
              increaseDisabled={increaseDisabled}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

export function StepsGoalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const goBack = useMizoraBack('/steps');
  const { goals: saved, persist } = useHealthGoals();
  const [draft, setDraft] = useState<HealthGoalsState>(saved);
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void loadHealthGoals().then((loaded) => {
        if (active) setDraft(loaded);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const patch = useCallback((partial: Partial<HealthGoalsState>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  }, []);

  const patchOptional = useCallback(
    (key: keyof Pick<HealthGoalsState, 'calories' | 'distanceKm' | 'activeMinutes' | 'floors'>) =>
      (next: OptionalGoal) => {
        setDraft((prev) => ({ ...prev, [key]: next }));
      },
    [],
  );

  const onSave = useCallback(async () => {
    setSaving(true);
    try {
      await persist(draft);
      router.back();
    } finally {
      setSaving(false);
    }
  }, [draft, persist, router]);

  const formatDistance = (km: number) =>
    km % 1 === 0 ? km.toFixed(0) : km.toFixed(1).replace(/\.0$/, '');

  const optionalRows = [
    {
      key: 'calories' as const,
      title: 'Calories goal',
      subtitle: 'Daily burn target',
      badgeKind: 'calories' as const,
      optional: draft.calories,
      valueLabel: draft.calories.value.toLocaleString(),
      unitLabel: 'kcal',
      stepHint: '±50 kcal per tap',
      onToggle: (enabled: boolean) => patchOptional('calories')({ ...draft.calories, enabled }),
      onDecrease: () =>
        patchOptional('calories')({
          ...draft.calories,
          value: Math.max(0, draft.calories.value - 50),
        }),
      onIncrease: () =>
        patchOptional('calories')({
          ...draft.calories,
          value: Math.min(5000, draft.calories.value + 50),
        }),
      decreaseDisabled: draft.calories.value <= 0,
      increaseDisabled: draft.calories.value >= 5000,
    },
    {
      key: 'distanceKm' as const,
      title: 'Distance goal',
      subtitle: 'How far you want to move',
      badgeKind: 'distance' as const,
      optional: draft.distanceKm,
      valueLabel: formatDistance(draft.distanceKm.value),
      unitLabel: 'km',
      stepHint: '±0.5 km per tap',
      onToggle: (enabled: boolean) => patchOptional('distanceKm')({ ...draft.distanceKm, enabled }),
      onDecrease: () =>
        patchOptional('distanceKm')({
          ...draft.distanceKm,
          value: Math.max(0, Math.round((draft.distanceKm.value - 0.5) * 10) / 10),
        }),
      onIncrease: () =>
        patchOptional('distanceKm')({
          ...draft.distanceKm,
          value: Math.min(50, Math.round((draft.distanceKm.value + 0.5) * 10) / 10),
        }),
      decreaseDisabled: draft.distanceKm.value <= 0,
      increaseDisabled: draft.distanceKm.value >= 50,
    },
    {
      key: 'activeMinutes' as const,
      title: 'Active time goal',
      subtitle: 'Minutes of movement',
      badgeKind: 'activeTime' as const,
      optional: draft.activeMinutes,
      valueLabel: String(draft.activeMinutes.value),
      unitLabel: 'min',
      stepHint: '±5 min per tap',
      onToggle: (enabled: boolean) =>
        patchOptional('activeMinutes')({ ...draft.activeMinutes, enabled }),
      onDecrease: () =>
        patchOptional('activeMinutes')({
          ...draft.activeMinutes,
          value: Math.max(0, draft.activeMinutes.value - 5),
        }),
      onIncrease: () =>
        patchOptional('activeMinutes')({
          ...draft.activeMinutes,
          value: Math.min(300, draft.activeMinutes.value + 5),
        }),
      decreaseDisabled: draft.activeMinutes.value <= 0,
      increaseDisabled: draft.activeMinutes.value >= 300,
    },
    {
      key: 'floors' as const,
      title: 'Floors goal',
      subtitle: 'Flights climbed',
      badgeKind: 'floors' as const,
      optional: draft.floors,
      valueLabel: String(draft.floors.value),
      unitLabel: 'floors',
      stepHint: '±1 floor per tap',
      onToggle: (enabled: boolean) => patchOptional('floors')({ ...draft.floors, enabled }),
      onDecrease: () =>
        patchOptional('floors')({
          ...draft.floors,
          value: Math.max(0, draft.floors.value - 1),
        }),
      onIncrease: () =>
        patchOptional('floors')({
          ...draft.floors,
          value: Math.min(100, draft.floors.value + 1),
        }),
      decreaseDisabled: draft.floors.value <= 0,
      increaseDisabled: draft.floors.value >= 100,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-mizora-bg" edges={['top']}>
      <View className="px-5">
        <ScreenHeader onBack={goBack} title="Daily goals" />
      </View>

      <View className="flex-1">
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{
            paddingTop: 8,
            paddingBottom: mainTabBarFooterInset(insets.bottom) + 72,
            gap: 20,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Card className="overflow-hidden p-0">
            <View className="gap-4 p-4">
              <MetricSectionHeader
                title="Daily steps"
                subtitle="Powers your ring and weekly chart"
                icon={<MetricBadgeIcon kind="steps" size={40} />}
                trailing={<RequiredChip />}
              />
              <View className="h-px bg-[#f2f3f0]" />
              <GoalStepper
                variant="hero"
                valueLabel={draft.steps.toLocaleString()}
                unitLabel="steps"
                hint="±1,000 steps per tap"
                onDecrease={() =>
                  patch({ steps: Math.max(STEP_GOAL_STEP, draft.steps - STEP_GOAL_STEP) })
                }
                onIncrease={() => patch({ steps: Math.min(100_000, draft.steps + STEP_GOAL_STEP) })}
                decreaseDisabled={draft.steps <= STEP_GOAL_STEP}
                increaseDisabled={draft.steps >= 100_000}
              />
            </View>
          </Card>

          <View className="gap-4">
            <View>
              <Text style={{ fontFamily: fonts.medium, fontSize: 16, color: '#000' }}>
                Additional goals
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 11,
                  color: '#626b5e',
                  marginTop: 2,
                  lineHeight: 14,
                }}
              >
                Optional — turn on only what you want to track
              </Text>
            </View>

            <Card className="overflow-hidden p-0">
              {optionalRows.map((row, index) => (
                <OptionalGoalRow
                  key={row.key}
                  title={row.title}
                  subtitle={row.subtitle}
                  badgeKind={row.badgeKind}
                  optional={row.optional}
                  valueLabel={row.valueLabel}
                  unitLabel={row.unitLabel}
                  stepHint={row.stepHint}
                  onToggle={row.onToggle}
                  onDecrease={row.onDecrease}
                  onIncrease={row.onIncrease}
                  decreaseDisabled={row.decreaseDisabled}
                  increaseDisabled={row.increaseDisabled}
                  showDivider={index > 0}
                  isFirst={index === 0}
                  isLast={index === optionalRows.length - 1}
                />
              ))}
            </Card>
          </View>
        </ScrollView>

        <View
          className="border-t border-[#f2f3f0] bg-mizora-bg px-5 pt-3"
          style={{ paddingBottom: mainTabBarFooterInset(insets.bottom) }}
        >
          <GradientButton label="Save goals" onPress={() => void onSave()} disabled={saving} />
        </View>
      </View>
    </SafeAreaView>
  );
}
