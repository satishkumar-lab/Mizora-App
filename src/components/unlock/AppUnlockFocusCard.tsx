import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { AppBrandIcon } from '@/components/icons/AppBrandIcon';
import { CardInsetDivider } from '@/components/ui/CardInsetDivider';
import {
  challengeProgressRatio,
  formatGoalLiters,
  formatStepShort,
  type RewardAppItem,
} from '@/constants/unlockRewards';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';
import { mizoraCardElevationStyle } from '@/utils/platformStyles';

const BAR_H = 5;
const FILL_OK = '#34c759';
const FILL_PENDING = '#c7cfc4';

const SURFACE = 'bg-mizora-card dark:bg-mizora-card-dark';

const actionTextBase = {
  fontFamily: fonts.medium,
  fontSize: 13,
  lineHeight: 16,
} as const;

function challengeLabel(challenge: RewardAppItem['challenge']): string {
  if (challenge.kind === 'steps') {
    return `Walk ${formatStepShort(challenge.goalSteps)} steps`;
  }
  return `Log ${formatGoalLiters(challenge.goalMl)} water`;
}

function StatusChip({ app, pct }: { app: RewardAppItem; pct: number }) {
  const { colors } = useMizoraTheme();
  if (app.unlocked) {
    return (
      <View
        className="flex-row items-center rounded-full px-2 py-0.5"
        style={{ backgroundColor: '#d7ffc7' }}
      >
        <Ionicons name="checkmark" size={11} color="#34c759" />
        <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: '#34c759', marginLeft: 3 }}>
          Unlocked
        </Text>
      </View>
    );
  }
  if (app.goalComplete && app.userLockedToday) {
    return (
      <View
        className="flex-row items-center rounded-full px-2 py-0.5"
        style={{ backgroundColor: colors.surfaceMuted }}
      >
        <Ionicons name="lock-closed" size={10} color={colors.textSecondary} />
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
      <Ionicons name="lock-closed" size={10} color={colors.textSecondary} />
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 10,
          color: colors.textSecondary,
          marginLeft: 3,
        }}
      >
        {pct}%
      </Text>
    </View>
  );
}

type AppUnlockFocusCardProps = {
  app: RewardAppItem;
  onOpenApp?: () => void;
  onLockAgain?: () => void;
  onUnlockForToday?: () => void;
  onContinueChallenge?: () => void;
};

/** PRD S-014 / S-015 — one app, one challenge, same shell as home unlock list. */
export function AppUnlockFocusCard({
  app,
  onOpenApp,
  onLockAgain,
  onUnlockForToday,
  onContinueChallenge,
}: AppUnlockFocusCardProps) {
  const { colors } = useMizoraTheme();
  const pct = Math.round(challengeProgressRatio(app.challenge) * 100);
  const challenge = app.challenge;

  let progressLeft: string;
  let progressRight: string;

  if (challenge.kind === 'steps') {
    const walked = challenge.earnedSteps;
    progressLeft = `${walked.toLocaleString()} / ${formatStepShort(challenge.goalSteps)} steps`;
    if (app.unlocked) progressRight = 'Unlocked today';
    else if (app.goalComplete) progressRight = 'Locked by you';
    else progressRight = `${(challenge.goalSteps - walked).toLocaleString()} left`;
  } else {
    progressLeft = `${challenge.currentMl}ml / ${formatGoalLiters(challenge.goalMl)}`;
    if (app.unlocked) progressRight = 'Unlocked today';
    else if (app.goalComplete) progressRight = 'Locked by you';
    else progressRight = `${challenge.goalMl - challenge.currentMl}ml left`;
  }

  return (
    <View
      className="overflow-hidden rounded-[20px] bg-mizora-shell dark:bg-mizora-shell-dark"
      style={mizoraCardElevationStyle()}
    >
      <View className={`${SURFACE} px-3.5 py-4`} style={{ gap: 14 }}>
        <View className="flex-row items-start" style={{ gap: 10 }}>
          <AppBrandIcon app={app.id} size={40} />
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
                {app.name}
              </Text>
              <StatusChip app={app} pct={pct} />
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
                  backgroundColor: app.goalComplete ? FILL_OK : FILL_PENDING,
                }}
              />
            </View>
            <View className="flex-row justify-between">
              <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: colors.textSecondary }}>
                {progressLeft}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 10,
                  color: app.unlocked ? '#49a621' : colors.textMuted,
                }}
              >
                {progressRight}
              </Text>
            </View>
          </View>
        </View>

        <CardInsetDivider />

        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: colors.textMuted }}>
              Challenge
            </Text>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 13,
                color: colors.textStrong,
                marginTop: 2,
              }}
            >
              {challengeLabel(challenge)}
            </Text>
          </View>
          <View className="items-end">
            <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: colors.textMuted }}>
              Status
            </Text>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 13,
                color: app.goalComplete ? '#34c759' : colors.textSecondary,
                marginTop: 2,
              }}
            >
              {app.goalComplete ? 'Complete' : 'In progress'}
            </Text>
          </View>
        </View>
      </View>

      {app.unlocked && onOpenApp ? (
        <View className={SURFACE}>
          <CardInsetDivider />
          <Pressable
            accessibilityRole="button"
            onPress={onOpenApp}
            className={`flex-row items-center justify-center py-3.5 ${SURFACE}`}
          >
            <Text style={{ ...actionTextBase, color: '#34c759' }}>Open {app.name}</Text>
          </Pressable>
        </View>
      ) : null}

      {app.unlocked && onLockAgain ? (
        <View className={`${SURFACE} pb-2`}>
          <CardInsetDivider />
          <Pressable
            accessibilityRole="button"
            onPress={onLockAgain}
            className={`flex-row items-center justify-center py-3.5 ${SURFACE}`}
          >
            <Text style={{ ...actionTextBase, color: colors.textSecondary }}>
              Lock again for today
            </Text>
          </Pressable>
        </View>
      ) : null}

      {app.goalComplete && app.userLockedToday && onUnlockForToday ? (
        <View className={`${SURFACE} pb-2`}>
          <CardInsetDivider />
          <Pressable
            accessibilityRole="button"
            onPress={onUnlockForToday}
            className={`flex-row items-center justify-center py-3.5 ${SURFACE}`}
          >
            <Text style={{ ...actionTextBase, color: '#34c759' }}>Unlock for today</Text>
          </Pressable>
        </View>
      ) : null}

      {!app.goalComplete && onContinueChallenge ? (
        <View className={`${SURFACE} pb-2`}>
          <CardInsetDivider />
          <Pressable
            accessibilityRole="button"
            onPress={onContinueChallenge}
            className={`flex-row items-center justify-between px-3.5 py-3.5 ${SURFACE}`}
          >
            <Text style={{ ...actionTextBase, color: colors.textStrong }}>
              {challenge.kind === 'steps' ? "Continue on Today's Steps" : 'Log water'}
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#34c759" />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
