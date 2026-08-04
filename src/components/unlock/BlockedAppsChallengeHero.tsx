import { Fragment, useMemo } from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/components/ui/Card';
import { LiveBadge } from '@/components/ui/LiveBadge';
import { MAX_LOCKED_APPS_PER_DAY } from '@/constants/unlockRewards';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { themedHairlineColor } from '@/utils/chartGridStyle';
import { fonts } from '@/theme/tokens';

type BlockedAppsChallengeHeroProps = {
  lockedCount: number;
};

function heroCopy(lockedCount: number): { title: string; subtitle: string } {
  if (lockedCount >= MAX_LOCKED_APPS_PER_DAY) {
    return {
      title: 'Roster complete',
      subtitle: 'Hit your targets — unlock for the rest of today',
    };
  }
  if (lockedCount === 0) {
    return {
      title: 'Lock 3 apps today',
      subtitle: 'Choose what you want to earn back with movement',
    };
  }
  const left = MAX_LOCKED_APPS_PER_DAY - lockedCount;
  return {
    title: left === 1 ? '1 slot left' : `${left} slots left`,
    subtitle: 'Fill your roster — max 3 per day',
  };
}

function ChallengeRosterProgress({ lockedCount }: { lockedCount: number }) {
  const total = MAX_LOCKED_APPS_PER_DAY;

  return (
    <View className="px-1 pt-0.5">
      <View className="flex-row items-center">
        {Array.from({ length: total }, (_, i) => {
          const filled = i < lockedCount;

          return (
            <Fragment key={`step-${i}`}>
              {i > 0 ? (
                <View
                  className="mx-0.5 h-[3px] flex-1 overflow-hidden rounded-full"
                  style={{ backgroundColor: 'rgba(255,255,255,0.38)' }}
                >
                  {lockedCount > i ? (
                    <View className="h-full w-full rounded-full bg-white/90" />
                  ) : null}
                </View>
              ) : null}
              <View
                className="items-center justify-center"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: filled ? '#ffffff' : 'rgba(255,255,255,0.22)',
                  borderWidth: 2,
                  borderColor: filled ? '#ffffff' : 'rgba(255,255,255,0.65)',
                  shadowColor: filled ? '#141c12' : 'transparent',
                  shadowOpacity: filled ? 0.08 : 0,
                  shadowRadius: 4,
                  shadowOffset: { width: 0, height: 2 },
                }}
              >
                {filled ? (
                  <Ionicons name="lock-closed" size={15} color="#34c759" />
                ) : (
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(20,28,18,0.12)',
                    }}
                  />
                )}
              </View>
            </Fragment>
          );
        })}
      </View>
    </View>
  );
}

export function BlockedAppsChallengeHero({ lockedCount }: BlockedAppsChallengeHeroProps) {
  const { colors, isDark } = useMizoraTheme();
  const hairline = themedHairlineColor(isDark, colors);
  const { title, subtitle } = useMemo(() => heroCopy(lockedCount), [lockedCount]);

  return (
    <Card className="overflow-hidden p-0">
      <LinearGradient colors={['#E8FFB8', '#DDFB43', '#d4f829']} locations={[0, 0.55, 1]}>
        <View className="px-4 pb-4 pt-4" style={{ gap: 14 }}>
          <View className="flex-row items-center justify-between">
            <View
              className="rounded-full px-2.5 py-1"
              style={{ backgroundColor: 'rgba(20,28,18,0.08)' }}
            >
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 10,
                  color: '#141c12',
                  letterSpacing: 1.2,
                }}
              >
                TODAY&apos;S CHALLENGE
              </Text>
            </View>
            <LiveBadge size="xs" />
          </View>

          <View className="flex-row items-end justify-between">
            <View className="min-w-0 flex-1 pr-3" style={{ gap: 4 }}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontSize: 26,
                  color: '#141c12',
                  lineHeight: 30,
                  letterSpacing: -0.5,
                }}
              >
                {title}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 12,
                  color: '#3d4a12',
                  lineHeight: 16,
                }}
              >
                {subtitle}
              </Text>
            </View>
            <View className="items-end">
              <View className="flex-row items-baseline">
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: 44,
                    color: '#141c12',
                    lineHeight: 46,
                    letterSpacing: -1,
                  }}
                >
                  {lockedCount}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    fontSize: 18,
                    color: '#5c6d05',
                    marginBottom: 6,
                    marginLeft: 1,
                  }}
                >
                  /{MAX_LOCKED_APPS_PER_DAY}
                </Text>
              </View>
              <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: '#5c6d05' }}>
                locked
              </Text>
            </View>
          </View>

          <ChallengeRosterProgress lockedCount={lockedCount} />
        </View>
      </LinearGradient>

      {lockedCount >= MAX_LOCKED_APPS_PER_DAY ? (
        <View
          className="flex-row items-center justify-center gap-2 px-4 py-3"
          style={{
            backgroundColor: colors.card,
            borderTopWidth: 1,
            borderTopColor: hairline,
          }}
        >
          <Ionicons name="flash" size={14} color="#34c759" />
          <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: colors.textSecondary }}>
            Walk or hydrate to open each app for the day
          </Text>
        </View>
      ) : null}
    </Card>
  );
}
