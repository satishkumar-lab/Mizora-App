import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { AchievementBadgeIcon, AchievementBadgeLabels } from '@/components/streak/AchievementBadge';
import { SectionViewAllLink } from '@/components/ui/SectionViewAllLink';
import { Card } from '@/components/ui/Card';
import type { ResolvedAchievement } from '@/constants/achievements';
import { monthlyAchievementsMeta } from '@/constants/achievements';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

type StreakAchievementsCardProps = {
  badges: ResolvedAchievement[];
};

export function StreakAchievementsCard({ badges }: StreakAchievementsCardProps) {
  const router = useRouter();
  const meta = monthlyAchievementsMeta();
  const { colors } = useMizoraTheme();

  return (
    <Card className="p-4">
      <View className="mb-1 flex-row items-center justify-between">
        <Text style={{ fontFamily: fonts.medium, fontSize: 16, color: colors.textStrong }}>
          Achievements
        </Text>
        <SectionViewAllLink label="View all" onPress={() => router.push('/streak/achievements')} />
      </View>
      <Text
        style={{
          fontFamily: fonts.regular,
          fontSize: 11,
          color: colors.textMuted,
          marginTop: 2,
        }}
      >
        {meta.monthLabel} · hard monthly challenges
      </Text>
      <View className="mt-3 h-px" style={{ backgroundColor: colors.borderDivider }} />
      <View className="flex-row justify-between pt-3.5" style={{ gap: 4 }}>
        {badges.slice(0, 4).map((badge) => (
          <View key={badge.id} className="flex-1 items-center" style={{ gap: 6, minWidth: 0 }}>
            <AchievementBadgeIcon
              icon={badge.icon}
              unlocked={badge.unlocked}
              accent={badge.accent}
              size={48}
            />
            <AchievementBadgeLabels badge={badge} />
          </View>
        ))}
      </View>
    </Card>
  );
}
