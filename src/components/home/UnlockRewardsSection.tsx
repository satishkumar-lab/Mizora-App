import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { AppBrandIcon, type AppBrandId } from '@/components/icons/AppBrandIcon';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { fonts } from '@/theme/tokens';
import { mizoraCardElevationStyle } from '@/utils/platformStyles';

const ROW_H_PAD = 14;
const BAR_H = 5;
const TRACK_GRAY = '#e5ece2';
const FILL_LOCKED = '#c7cfc4';
const FILL_UNLOCKED = '#34c759';

type StepsChallenge = {
  kind: 'steps';
  goalSteps: number;
  progress: number;
};

type WaterChallenge = {
  kind: 'water';
  currentMl: number;
  goalMl: number;
};

type RewardAppItem = {
  id: AppBrandId;
  name: string;
  unlocked: boolean;
  challenge: StepsChallenge | WaterChallenge;
};

const APPS: RewardAppItem[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    unlocked: true,
    challenge: { kind: 'steps', goalSteps: 1500, progress: 1 },
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    unlocked: false,
    challenge: { kind: 'steps', goalSteps: 2000, progress: 0.65 },
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    unlocked: false,
    challenge: { kind: 'water', currentMl: 700, goalMl: 2000 },
  },
];

function formatStepShort(steps: number): string {
  if (steps >= 1000) {
    const k = steps / 1000;
    return k % 1 === 0 ? `${k}K` : `${k.toFixed(1).replace(/\.0$/, '')}K`;
  }
  return steps.toLocaleString();
}

function formatGoalLiters(ml: number): string {
  if (ml >= 1000 && ml % 1000 === 0) {
    return `${ml / 1000}L`;
  }
  return `${ml}ml`;
}

function challengeProgress(challenge: StepsChallenge | WaterChallenge): number {
  if (challenge.kind === 'steps') {
    return challenge.progress;
  }
  return challenge.currentMl / challenge.goalMl;
}

function RewardProgressBar({ pct, unlocked }: { pct: number; unlocked: boolean }) {
  return (
    <View
      style={{
        height: BAR_H,
        borderRadius: BAR_H / 2,
        overflow: 'hidden',
        backgroundColor: TRACK_GRAY,
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

function StatusChip({ unlocked, progressPct }: { unlocked: boolean; progressPct: number }) {
  if (unlocked) {
    return (
      <View
        className="flex-row items-center rounded-full px-2 py-0.5"
        style={{ backgroundColor: '#d7ffc7' }}
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

  return (
    <View className="flex-row items-center rounded-full bg-[#f4f6f3] px-2 py-0.5">
      <Ionicons name="lock-closed" size={10} color="#626b5e" />
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 10,
          color: '#626b5e',
          marginLeft: 3,
          lineHeight: 12,
        }}
      >
        {progressPct}%
      </Text>
    </View>
  );
}

function RewardRow({ app }: { app: RewardAppItem }) {
  const progressRatio = challengeProgress(app.challenge);
  const progressPct = Math.min(100, Math.round(progressRatio * 100));

  let progressLabel: string;
  let trailingLabel: string;

  if (app.challenge.kind === 'steps') {
    const walked = Math.round(app.challenge.goalSteps * app.challenge.progress);
    progressLabel = `${walked.toLocaleString()} / ${formatStepShort(app.challenge.goalSteps)} steps`;
    trailingLabel = app.unlocked
      ? 'Ready to open'
      : `${(app.challenge.goalSteps - walked).toLocaleString()} left`;
  } else {
    const { currentMl, goalMl } = app.challenge;
    progressLabel = `${currentMl}ml / ${formatGoalLiters(goalMl)} water`;
    trailingLabel = `${goalMl - currentMl}ml to unlock`;
  }

  return (
    <View className="flex-row items-start" style={{ gap: 10 }}>
      <AppBrandIcon app={app.id} size={38} />

      <View className="min-w-0 flex-1" style={{ gap: 8 }}>
        <View className="flex-row items-center justify-between" style={{ gap: 8 }}>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              fontFamily: fonts.bold,
              fontSize: 14,
              color: '#141c12',
              lineHeight: 17,
            }}
          >
            {app.name}
          </Text>
          <StatusChip unlocked={app.unlocked} progressPct={progressPct} />
        </View>

        <RewardProgressBar pct={progressPct} unlocked={app.unlocked} />

        <View className="flex-row items-center justify-between">
          <Text
            style={{ fontFamily: fonts.medium, fontSize: 10, color: '#626b5e', lineHeight: 12 }}
          >
            {progressLabel}
          </Text>
          <Text
            style={{
              fontFamily: fonts.medium,
              fontSize: 10,
              color: app.unlocked ? '#49a621' : '#8e8e93',
              lineHeight: 12,
            }}
          >
            {trailingLabel}
          </Text>
        </View>
      </View>
    </View>
  );
}

export function UnlockRewardsSection() {
  return (
    <View style={{ gap: 12 }}>
      <View className="flex-row items-center justify-between">
        <Text style={{ fontFamily: fonts.medium, fontSize: 16, color: '#000' }}>
          Steps Unlock Rewards
        </Text>
        <Pressable accessibilityRole="button" className="flex-row items-center" style={{ gap: 2 }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: '#34c759' }}>View All</Text>
          <Ionicons name="chevron-forward" size={14} color="#34c759" />
        </Pressable>
      </View>

      <View
        className="overflow-hidden rounded-[20px] bg-mizora-shell"
        style={mizoraCardElevationStyle()}
      >
        <View
          className="border-b border-[#f2f3f0] bg-white"
          style={{ paddingHorizontal: ROW_H_PAD, paddingTop: 14, paddingBottom: 12 }}
        >
          {APPS.map((app, index) => (
            <View key={app.id}>
              {index > 0 ? (
                <View style={{ marginVertical: 14 }} className="h-px bg-[#f2f3f0]" />
              ) : null}
              <RewardRow app={app} />
            </View>
          ))}
        </View>

        <Pressable
          accessibilityRole="button"
          className="flex-row items-center justify-between"
          style={{ paddingHorizontal: ROW_H_PAD, paddingVertical: 11 }}
        >
          <View className="flex-row items-center" style={{ gap: 10 }}>
            <MetricBadgeIcon kind="unlock" size={32} />
            <Text
              style={{ fontFamily: fonts.medium, fontSize: 12, color: '#141c12', lineHeight: 15 }}
            >
              Manage Your Blocked Apps
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#999999" />
        </Pressable>
      </View>
    </View>
  );
}
