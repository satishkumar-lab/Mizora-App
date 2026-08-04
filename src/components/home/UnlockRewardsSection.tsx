import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { AppBrandIcon } from '@/components/icons/AppBrandIcon';
import { ForwardChevronIcon } from '@/components/icons/ForwardChevronIcon';
import { SectionViewAllLink } from '@/components/ui/SectionViewAllLink';
import {
  challengeProgressRatio,
  formatGoalLiters,
  formatStepShort,
  type RewardAppItem,
} from '@/constants/unlockRewards';
import { useUnlockRewards } from '@/providers/UnlockRewardsProvider';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';
import { mizoraCardElevationStyle } from '@/utils/platformStyles';

const ROW_H_PAD = 18;
const CARD_PAD = 18;
const ROW_DIVIDER_GAP = 12;
const BAR_H = 5;
const FILL_LOCKED = '#c7cfc4';
const FILL_UNLOCKED = '#34c759';

function RewardProgressBar({ pct, unlocked }: { pct: number; unlocked: boolean }) {
  const { colors } = useMizoraTheme();
  return (
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
          borderRadius: BAR_H / 2,
          backgroundColor: unlocked ? FILL_UNLOCKED : FILL_LOCKED,
        }}
      />
    </View>
  );
}

function StatusChip({ app, progressPct }: { app: RewardAppItem; progressPct: number }) {
  const { colors, isDark } = useMizoraTheme();
  if (app.unlocked) {
    return (
      <View
        className="flex-row items-center rounded-full px-2 py-0.5"
        style={{
          backgroundColor: isDark ? colors.iconBadgeBg : '#d7ffc7',
          borderWidth: isDark ? 1 : 0,
          borderColor: colors.iconBadgeBorder,
        }}
      >
        <Ionicons name="checkmark" size={11} color="#34c759" />
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: 10,
            color: '#34c759',
            marginLeft: 3,
            lineHeight: 12,
          }}
        >
          Unlocked
        </Text>
      </View>
    );
  }

  if (app.goalComplete && app.userLockedToday) {
    return (
      <View
        className="flex-row items-center rounded-full px-2 py-0.5"
        style={{
          backgroundColor: isDark ? colors.iconBadgeBg : colors.surfaceMuted,
          borderWidth: isDark ? 1 : 0,
          borderColor: colors.iconBadgeBorder,
        }}
      >
        <Ionicons name="lock-closed" size={10} color={colors.textSecondary} />
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: 10,
            color: colors.textSecondary,
            marginLeft: 3,
            lineHeight: 12,
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
      style={{
        backgroundColor: isDark ? colors.iconBadgeBg : colors.surfaceMuted,
        borderWidth: isDark ? 1 : 0,
        borderColor: colors.iconBadgeBorder,
      }}
    >
      <Ionicons name="lock-closed" size={10} color={colors.textSecondary} />
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 10,
          color: colors.textSecondary,
          marginLeft: 3,
          lineHeight: 12,
        }}
      >
        {progressPct}%
      </Text>
    </View>
  );
}

function RewardRow({ app, onPress }: { app: RewardAppItem; onPress?: () => void }) {
  const { colors } = useMizoraTheme();
  const progressRatio = challengeProgressRatio(app.challenge);
  const progressPct = Math.min(100, Math.round(progressRatio * 100));

  let progressLabel: string;
  let trailingLabel: string;

  if (app.challenge.kind === 'steps') {
    const walked = app.challenge.earnedSteps;
    progressLabel = `${walked.toLocaleString()} / ${formatStepShort(app.challenge.goalSteps)} steps`;
    trailingLabel = app.unlocked
      ? 'Ready to open'
      : app.goalComplete && app.userLockedToday
        ? 'Locked by you'
        : `${(app.challenge.goalSteps - walked).toLocaleString()} left`;
  } else {
    const { currentMl, goalMl } = app.challenge;
    progressLabel = `${currentMl}ml / ${formatGoalLiters(goalMl)} water`;
    trailingLabel = app.unlocked
      ? 'Ready to open'
      : app.goalComplete && app.userLockedToday
        ? 'Locked by you'
        : `${goalMl - currentMl}ml to unlock`;
  }

  const body = (
    <View className="flex-row items-start" style={{ gap: 12 }}>
      <AppBrandIcon app={app.id} size={40} />

      <View className="min-w-0 flex-1" style={{ gap: 8 }}>
        <View className="flex-row items-center justify-between" style={{ gap: 8 }}>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontFamily: fonts.medium,
              fontSize: 14,
              color: colors.textStrong,
              lineHeight: 17,
            }}
          >
            {app.name}
          </Text>
          <StatusChip app={app} progressPct={progressPct} />
        </View>

        <RewardProgressBar pct={progressPct} unlocked={app.unlocked} />

        <View className="flex-row items-center justify-between">
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: 10,
              color: colors.textSecondary,
              lineHeight: 12,
            }}
          >
            {progressLabel}
          </Text>
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: 10,
              color: app.unlocked ? '#49a621' : colors.textMuted,
              lineHeight: 12,
            }}
          >
            {trailingLabel}
          </Text>
        </View>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}
      >
        {body}
      </Pressable>
    );
  }

  return body;
}

type UnlockRewardsListCardProps = {
  apps: RewardAppItem[];
  onAppPress?: (appId: RewardAppItem['id']) => void;
  showManageFooter?: boolean;
  onManagePress?: () => void;
};

type ManageBlockedAppsButtonProps = {
  onPress?: () => void;
};

/** Same label tone as Home header Mizora+ chip text. */
const MIZORA_PLUS_LABEL = '#5c6d05';

function ManageBlockedAppsButton({ onPress }: ManageBlockedAppsButtonProps) {
  const { colors } = useMizoraTheme();
  return (
    <View style={{ paddingTop: 14, paddingBottom: CARD_PAD + 2 }}>
      <View
        className="h-px dark:bg-[#2a332a]"
        style={{
          marginHorizontal: CARD_PAD,
          marginBottom: 14,
          backgroundColor: colors.borderDivider,
        }}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Manage blocked apps"
        onPress={onPress}
        className="items-center justify-center"
        style={({ pressed }) => ({
          paddingVertical: 16,
          paddingHorizontal: CARD_PAD,
          opacity: pressed ? 0.75 : 1,
        })}
      >
        <View className="flex-row items-center" style={{ gap: 2 }}>
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: 13,
              color: MIZORA_PLUS_LABEL,
              lineHeight: 16,
            }}
          >
            Manage blocked apps
          </Text>
          <ForwardChevronIcon size={14} color={MIZORA_PLUS_LABEL} />
        </View>
      </Pressable>
    </View>
  );
}

export function UnlockRewardsListCard({
  apps,
  onAppPress,
  showManageFooter = true,
  onManagePress,
}: UnlockRewardsListCardProps) {
  return (
    <View
      className="rounded-[20px] bg-mizora-card dark:bg-mizora-card-dark"
      style={mizoraCardElevationStyle()}
    >
      <View
        style={{
          paddingHorizontal: ROW_H_PAD,
          paddingTop: CARD_PAD + 2,
          paddingBottom: showManageFooter ? 6 : CARD_PAD + 2,
        }}
      >
        {apps.map((app, index) => (
          <View key={app.id}>
            {index > 0 ? (
              <View
                style={{ marginVertical: ROW_DIVIDER_GAP }}
                className="h-px bg-[#f2f3f0] dark:bg-[#2a332a]"
              />
            ) : null}
            <RewardRow app={app} onPress={onAppPress ? () => onAppPress(app.id) : undefined} />
          </View>
        ))}
      </View>

      {showManageFooter ? <ManageBlockedAppsButton onPress={onManagePress} /> : null}
    </View>
  );
}

export function UnlockRewardsSection() {
  const router = useRouter();
  const { apps } = useUnlockRewards();
  const { colors } = useMizoraTheme();

  return (
    <View style={{ gap: 12 }}>
      <View className="flex-row items-center justify-between">
        <Text style={{ fontFamily: fonts.medium, fontSize: 16, color: colors.textStrong }}>
          Steps Unlock Rewards
        </Text>
        <SectionViewAllLink onPress={() => router.push('/rewards/impact')} />
      </View>

      <UnlockRewardsListCard
        apps={apps}
        onAppPress={(id) => router.push(`/rewards/${id}`)}
        onManagePress={() => router.push('/rewards')}
      />
    </View>
  );
}
