import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import type { AchievementIconKind, ResolvedAchievement } from '@/constants/achievements';
import { fonts } from '@/theme/tokens';

export function AchievementBadgeIcon({
  icon,
  unlocked,
  accent,
  size = 52,
}: {
  icon: AchievementIconKind;
  unlocked: boolean;
  accent: string;
  size?: number;
}) {
  const color = unlocked ? '#5c6d05' : '#a8b0a4';
  const name =
    icon === 'steps' || icon === 'walk'
      ? 'footsteps'
      : icon === 'streak'
        ? 'flame'
        : icon === 'water'
          ? 'water'
          : icon === 'unlock'
            ? 'key'
            : icon === 'lock'
              ? 'lock-closed'
              : icon === 'goal'
                ? 'flag'
                : 'footsteps';

  return (
    <View style={{ width: size, height: size }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: unlocked ? accent : '#f4f6f3',
          borderWidth: unlocked ? 2 : 1,
          borderColor: unlocked ? '#c8f526' : '#ebefea',
        }}
      >
        <Ionicons name={name} size={Math.round(size * 0.42)} color={color} />
      </View>
      {unlocked ? (
        <View
          style={{
            position: 'absolute',
            right: -1,
            top: -1,
            width: Math.round(size * 0.38),
            height: Math.round(size * 0.38),
            borderRadius: 999,
            backgroundColor: '#ddfb43',
            borderWidth: 2,
            borderColor: '#ffffff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="checkmark" size={Math.round(size * 0.22)} color="#5c6d05" />
        </View>
      ) : null}
    </View>
  );
}

export function AchievementBadgeLabels({ badge }: { badge: ResolvedAchievement }) {
  return (
    <View className="items-center" style={{ gap: 2 }}>
      <Text
        numberOfLines={2}
        style={{
          fontFamily: fonts.medium,
          fontSize: 11,
          color: badge.unlocked ? '#141c12' : '#8e8e93',
          textAlign: 'center',
          lineHeight: 14,
        }}
      >
        {badge.title}
      </Text>
      {badge.unlocked ? (
        <Text
          numberOfLines={1}
          style={{
            fontFamily: fonts.medium,
            fontSize: 10,
            color: '#5c6d05',
            textAlign: 'center',
          }}
        >
          Unlocked
        </Text>
      ) : (
        <>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: fonts.regular,
              fontSize: 10,
              color: '#8e8e93',
              textAlign: 'center',
              lineHeight: 13,
            }}
          >
            {badge.subtitle}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: fonts.medium,
              fontSize: 9,
              color: '#a8aea8',
              textAlign: 'center',
            }}
          >
            {badge.progressLabel}
          </Text>
        </>
      )}
    </View>
  );
}
