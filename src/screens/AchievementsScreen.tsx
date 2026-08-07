import { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { AchievementBadgeIcon } from '@/components/streak/AchievementBadge';
import { Card } from '@/components/ui/Card';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { StepsPermissionStateCard } from '@/components/steps/StepsPermissionStateCard';
import { useSteps } from '@/providers/StepsProvider';
import { useStepsMetricsLive } from '@/hooks/useStepsMetricsLive';
import { monthlyAchievementsMeta, resolveMonthlyAchievements } from '@/constants/achievements';
import { MAIN_TAB_BAR_CLEARANCE } from '@/constants/navigation';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

export function AchievementsScreen() {
  const insets = useSafeAreaInsets();
  const goBack = useMizoraBack('/streak');
  const { colors, isDark } = useMizoraTheme();
  const { goal } = useSteps();
  const { metricsLive, status, retryTracking } = useStepsMetricsLive();
  const meta = useMemo(() => monthlyAchievementsMeta(), []);
  const achievements = useMemo(
    () => (metricsLive ? resolveMonthlyAchievements(undefined, goal) : []),
    [goal, metricsLive],
  );
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemedScreen>
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
            {!metricsLive ? (
              <StepsPermissionStateCard
                status={status}
                onPrimaryPress={() => void retryTracking()}
              />
            ) : null}

            <Card
              className="border p-4"
              style={{
                gap: 6,
                borderColor: colors.border,
                backgroundColor: isDark ? colors.surfaceMuted : '#fafbf4',
              }}
            >
              <View className="flex-row items-center justify-between">
                <Text style={{ fontFamily: fonts.medium, fontSize: 14, color: colors.textStrong }}>
                  {meta.monthLabel}
                </Text>
                <View
                  className="rounded-full px-2.5 py-0.5"
                  style={{ backgroundColor: isDark ? '#2a332a' : '#f8ffd2' }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.medium,
                      fontSize: 10,
                      color: colors.textAccentGreen,
                    }}
                  >
                    {meta.themeTag}
                  </Text>
                </View>
              </View>
              <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textStrong }}>
                {metricsLive
                  ? `${unlockedCount} of ${achievements.length} unlocked this month`
                  : 'Monthly step badges resume when tracking is on'}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 12,
                  color: colors.textSecondary,
                  lineHeight: 17,
                }}
              >
                {meta.themeBlurb} {meta.resetsCopy}
              </Text>
            </Card>

            {metricsLive ? (
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
                          style={{
                            fontFamily: fonts.medium,
                            fontSize: 15,
                            color: colors.textStrong,
                          }}
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={{
                            fontFamily: fonts.regular,
                            fontSize: 12,
                            color: colors.textMuted,
                          }}
                        >
                          · {item.subtitle}
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontFamily: fonts.regular,
                          fontSize: 12,
                          color: colors.textSecondary,
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
                            color: colors.textAccentGreen,
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
                            color: colors.textAccentGreen,
                            marginTop: 2,
                          }}
                        >
                          Unlocked this month
                        </Text>
                      )}
                    </View>
                    {item.unlocked ? (
                      <View
                        className="h-8 w-8 items-center justify-center rounded-full"
                        style={{ backgroundColor: isDark ? '#2a332a' : '#d7ffc7' }}
                      >
                        <Ionicons name="checkmark" size={18} color="#34c759" />
                      </View>
                    ) : (
                      <View
                        className="h-8 w-8 items-center justify-center rounded-full"
                        style={{ backgroundColor: colors.surfaceMuted }}
                      >
                        <Ionicons name="lock-closed" size={14} color={colors.textMuted} />
                      </View>
                    )}
                  </Card>
                ))}
              </View>
            ) : null}
          </View>
        </ScrollView>
      </ThemedScreen>
    </>
  );
}
