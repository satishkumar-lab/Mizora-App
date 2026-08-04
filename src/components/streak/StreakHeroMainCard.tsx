import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/components/ui/Card';
import { LiveBadge } from '@/components/ui/LiveBadge';
import { STREAK_DAILY_STEP_GOAL, streakHeroSubtitle } from '@/lib/streakCalendar';
import { fonts } from '@/theme/tokens';

type StreakHeroMainCardProps = {
  streakDays: number;
  todaySteps: number;
  todayComplete: boolean;
};

function heroHeadline(streakDays: number, todayComplete: boolean): string {
  if (streakDays === 0) return 'Start your streak';
  if (!todayComplete) return 'Protect your streak';
  return streakDays === 1 ? 'Day one complete' : 'Streak rolling';
}

export function StreakHeroMainCard({
  streakDays,
  todaySteps,
  todayComplete,
}: StreakHeroMainCardProps) {
  const subtitle = useMemo(
    () => streakHeroSubtitle(streakDays, todayComplete),
    [streakDays, todayComplete],
  );
  const progress = Math.min(todaySteps / STREAK_DAILY_STEP_GOAL, 1);
  const remaining = Math.max(STREAK_DAILY_STEP_GOAL - todaySteps, 0);
  const headline = heroHeadline(streakDays, todayComplete);

  return (
    <Card className="overflow-hidden p-0">
      <LinearGradient colors={['#f5ffbb', '#ddfb43', '#d8f836']} locations={[0, 0.5, 1]}>
        <View className="px-4 pb-4 pt-4" style={{ gap: 16 }}>
          <View className="flex-row items-center justify-between">
            <View
              className="flex-row items-center gap-1.5 rounded-full px-2.5 py-1"
              style={{ backgroundColor: 'rgba(20,28,18,0.08)' }}
            >
              <Ionicons name="flame" size={12} color="#5c6d05" />
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 10,
                  color: '#141c12',
                  letterSpacing: 1,
                }}
              >
                STEP STREAK
              </Text>
            </View>
            {streakDays > 0 ? <LiveBadge size="xs" /> : null}
          </View>

          <View className="flex-row items-end justify-between">
            <View className="min-w-0 flex-1 pr-4" style={{ gap: 6 }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 24,
                  color: '#141c12',
                  lineHeight: 28,
                  letterSpacing: -0.4,
                }}
              >
                {headline}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 13,
                  color: '#3d4a12',
                  lineHeight: 18,
                  maxWidth: 220,
                }}
              >
                {subtitle}
              </Text>
            </View>
            <View className="items-end">
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 52,
                  color: '#141c12',
                  lineHeight: 52,
                  letterSpacing: -2,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {String(streakDays).padStart(2, '0')}
              </Text>
              <Text
                style={{ fontFamily: fonts.medium, fontSize: 12, color: '#5c6d05', marginTop: 2 }}
              >
                {streakDays === 1 ? 'day' : 'days'}
              </Text>
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <View className="flex-row items-center justify-between">
              <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: '#5c6d05' }}>
                Today&apos;s streak goal
              </Text>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 11,
                  color: '#141c12',
                  fontVariant: ['tabular-nums'],
                }}
              >
                {todaySteps.toLocaleString()} / {STREAK_DAILY_STEP_GOAL.toLocaleString()}
              </Text>
            </View>
            <View
              className="h-2 overflow-hidden rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.45)' }}
            >
              <View
                className="h-full rounded-full bg-white"
                style={{ width: `${Math.max(progress * 100, todaySteps > 0 ? 4 : 0)}%` }}
              />
            </View>
          </View>
        </View>
      </LinearGradient>

      <View
        className="flex-row items-center gap-2.5 border-t border-[#ebefea] px-4 py-3"
        style={{ backgroundColor: '#ffffff' }}
      >
        <View className="h-8 w-8 items-center justify-center rounded-full bg-[#f8ffd2]">
          <Ionicons name="footsteps" size={16} color="#5c6d05" />
        </View>
        <Text
          className="min-w-0 flex-1"
          style={{ fontFamily: fonts.regular, fontSize: 12, color: '#626b5e', lineHeight: 16 }}
        >
          {todayComplete
            ? 'Goal hit — this day counts toward your streak.'
            : `${remaining.toLocaleString()} steps left to keep today on the board.`}
        </Text>
      </View>
    </Card>
  );
}
