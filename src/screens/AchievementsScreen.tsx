import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { AchievementBadgeIcon } from '@/components/streak/AchievementBadge';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { monthlyAchievementsMeta, resolveMonthlyAchievements } from '@/constants/achievements';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { fonts } from '@/theme/tokens';

export function AchievementsScreen() {
  const insets = useSafeAreaInsets();
  const goBack = useMizoraBack('/streak');
  const meta = useMemo(() => monthlyAchievementsMeta(), []);
  const achievements = useMemo(() => resolveMonthlyAchievements(), []);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView className="flex-1 bg-mizora-bg" edges={['top']}>
        <View className="px-5">
          <ScreenHeader onBack={goBack} title="Achievements" />
        </View>
        <ScrollView
          contentContainerClassName="px-5 pb-8"
          contentContainerStyle={{
            paddingTop: 8,
            paddingBottom: insets.bottom + MAIN_TAB_BAR_CLEARANCE,
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 16 }}>
            <Card className="border border-[#ebefea] bg-[#fafbf4] p-4" style={{ gap: 6 }}>
              <View className="flex-row items-center justify-between">
                <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: '#141c12' }}>
                  {meta.monthLabel}
                </Text>
                <View className="rounded-full bg-[#f8ffd2] px-2.5 py-0.5">
                  <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: '#5c6d05' }}>
                    {meta.themeTag}
                  </Text>
                </View>
              </View>
              <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: '#141c12' }}>
                {unlockedCount} of {achievements.length} unlocked this month
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 12,
                  color: '#626b5e',
                  lineHeight: 17,
                }}
              >
                {meta.themeBlurb} {meta.resetsCopy}
              </Text>
            </Card>

            <View style={{ gap: 10 }}>
              {achievements.map((item) => (
                <Card key={item.id} className="flex-row items-center gap-3.5 p-4">
                  <AchievementBadgeIcon
                    icon={item.icon}
                    unlocked={item.unlocked}
                    accent={item.accent}
                    size={48}
                  />
                  <View className="min-w-0 flex-1" style={{ gap: 4 }}>
                    <View className="flex-row flex-wrap items-center gap-2">
                      <Text
                        style={{ fontFamily: fonts.medium, fontSize: 15, color: '#141c12' }}
                        numberOfLines={1}
                      >
                        {item.title}
                      </Text>
                      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: '#8e8e93' }}>
                        · {item.subtitle}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontFamily: fonts.regular,
                        fontSize: 12,
                        color: '#626b5e',
                        lineHeight: 16,
                      }}
                    >
                      {item.task}
                    </Text>
                    {!item.unlocked ? (
                      <Text
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: 11,
                          color: '#5c6d05',
                          marginTop: 2,
                        }}
                      >
                        Progress · {item.progressLabel}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontFamily: fonts.medium,
                          fontSize: 11,
                          color: '#5c6d05',
                          marginTop: 2,
                        }}
                      >
                        Unlocked this month
                      </Text>
                    )}
                  </View>
                  {item.unlocked ? (
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-[#d7ffc7]">
                      <Ionicons name="checkmark" size={18} color="#34c759" />
                    </View>
                  ) : (
                    <View className="h-8 w-8 items-center justify-center rounded-full bg-[#f4f6f3]">
                      <Ionicons name="lock-closed" size={14} color="#a8b0a4" />
                    </View>
                  )}
                </Card>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
