import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Card } from '@/components/ui/Card';
import { GradientButton } from '@/components/ui/GradientButton';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { ThemedScreen } from '@/components/ui/ThemedScreen';
import { NOTIFICATION_DEMO_EVENTS } from '@/demo/notifications/notificationDemoCatalog';
import { useNotificationDemo } from '@/demo/notifications/NotificationDemoProvider';
import { useMizoraBack } from '@/hooks/useMizoraBack';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

import type { PropsWithChildren } from 'react';

function DevOnlyGuard({ children }: PropsWithChildren) {
  if (!__DEV__) return null;
  return children;
}

export function NotificationDemoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const goBack = useMizoraBack('/profile');
  const { isDark, colors } = useMizoraTheme();
  const demo = useNotificationDemo();

  if (!__DEV__ || !demo) return null;

  const { simulate, clearAll, feed } = demo;

  return (
    <DevOnlyGuard>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ThemedScreen>
        <View className="px-5">
          <ScreenHeader onBack={goBack} title="Notification demo" />
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: insets.bottom + 24,
            gap: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Card className="gap-2 p-4">
            <Text style={{ fontFamily: fonts.bold, fontSize: 15, color: colors.textStrong }}>
              Development only
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontSize: 12,
                lineHeight: 18,
                color: colors.textSecondary,
              }}
            >
              Simulates in-app banners and inbox rows. No push, no expo-notifications. Not included
              in production builds.
            </Text>
            <Text
              style={{
                fontFamily: fonts.medium,
                fontSize: 11,
                color: colors.textMuted,
                marginTop: 4,
              }}
            >
              Inbox items: {feed.length}
            </Text>
          </Card>

          <View className="gap-2">
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textSecondary }}>
              Simulate event
            </Text>
            {NOTIFICATION_DEMO_EVENTS.map((event) => (
              <Pressable
                key={event.id}
                accessibilityRole="button"
                onPress={() => simulate(event.id)}
                className="rounded-card border px-4 py-3.5"
                style={({ pressed }) => ({
                  borderColor: colors.borderDivider,
                  backgroundColor: pressed ? colors.surfaceMuted : colors.card,
                  opacity: pressed ? 0.92 : 1,
                })}
              >
                <Text style={{ fontFamily: fonts.bold, fontSize: 14, color: colors.textStrong }}>
                  {event.buttonLabel}
                </Text>
                <Text
                  style={{
                    fontFamily: fonts.regular,
                    fontSize: 11,
                    color: colors.textMuted,
                    marginTop: 4,
                    lineHeight: 15,
                  }}
                >
                  {event.description}
                </Text>
              </Pressable>
            ))}
          </View>

          <GradientButton
            label="Open notification inbox"
            onPress={() => router.push('/notifications')}
          />

          <Pressable accessibilityRole="button" onPress={clearAll} className="items-center py-3">
            <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textMuted }}>
              Clear demo inbox
            </Text>
          </Pressable>
        </ScrollView>
      </ThemedScreen>
    </DevOnlyGuard>
  );
}
