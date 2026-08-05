import { Pressable, Text, View } from 'react-native';

import { AppBrandIcon } from '@/components/icons/AppBrandIcon';
import type { AppBrandId } from '@/components/icons/AppBrandIcon';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { Card } from '@/components/ui/Card';
import { MOCK_DAILY_SCREEN_MINUTES, type UnlockAppConfig } from '@/constants/unlockRewards';
import { usePersonalization } from '@/providers/PersonalizationProvider';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { fonts } from '@/theme/tokens';

function formatScreenTimeShort(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

type ScreenTimeSuggest = {
  appId: AppBrandId;
  name: string;
  subtitle: string;
};

function buildUsageSuggestions(configs: UnlockAppConfig[]): ScreenTimeSuggest[] {
  return configs
    .filter((c) => c.lockEnabled === false)
    .map((c) => ({
      appId: c.id,
      name: c.name,
      minutes: MOCK_DAILY_SCREEN_MINUTES[c.id] ?? 0,
    }))
    .filter((s) => s.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 2)
    .map((s) => ({
      appId: s.appId,
      name: s.name,
      subtitle: `~${formatScreenTimeShort(s.minutes)}/day on phone`,
    }));
}

type ScreenTimeRecommendationsProps = {
  configs: UnlockAppConfig[];
  onSuggestLock: (appId: AppBrandId) => void;
};

export function ScreenTimeRecommendations({
  configs,
  onSuggestLock,
}: ScreenTimeRecommendationsProps) {
  const { colors, isDark } = useMizoraTheme();
  const { lockSuggestions } = usePersonalization();

  const usage = buildUsageSuggestions(configs);
  const suggestions: ScreenTimeSuggest[] =
    usage.length > 0
      ? usage
      : lockSuggestions.map((s) => ({
          appId: s.appId,
          name: s.name,
          subtitle: s.reason,
        }));

  return (
    <View style={{ gap: 10 }}>
      <Card
        className="flex-row items-center gap-2.5 px-3.5 py-3"
        style={{ borderWidth: 1, borderColor: colors.borderDivider }}
      >
        <MetricBadgeIcon kind="activeTime" size={36} />
        <Text
          className="min-w-0 flex-1"
          style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textStrong }}
        >
          Connect Screen Time
        </Text>
        <View
          className="rounded-full px-2.5 py-1"
          style={{ backgroundColor: isDark ? colors.surfaceSecondary : '#f4f6f3' }}
        >
          <Text style={{ fontFamily: fonts.medium, fontSize: 10, color: colors.textSecondary }}>
            Coming soon
          </Text>
        </View>
      </Card>

      {suggestions.length > 0 ? (
        <View style={{ gap: 8 }}>
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.textSecondary }}>
            {usage.length > 0 ? 'Suggested from usage' : 'Suggested for you'}
          </Text>
          {suggestions.map((s) => (
            <Card
              key={s.appId}
              className="flex-row items-center gap-3 px-3 py-3"
              style={{ borderWidth: 1, borderColor: colors.borderDivider }}
            >
              <AppBrandIcon app={s.appId} size={36} />
              <View className="min-w-0 flex-1" style={{ gap: 2 }}>
                <Text style={{ fontFamily: fonts.medium, fontSize: 13, color: colors.textStrong }}>
                  {s.name}
                </Text>
                <Text style={{ fontFamily: fonts.regular, fontSize: 10, color: colors.textMuted }}>
                  {s.subtitle}
                </Text>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() => onSuggestLock(s.appId)}
                className="rounded-full px-3.5 py-2"
                style={{ backgroundColor: '#ddfb43' }}
              >
                <Text style={{ fontFamily: fonts.medium, fontSize: 11, color: '#141c12' }}>
                  Add
                </Text>
              </Pressable>
            </Card>
          ))}
        </View>
      ) : null}
    </View>
  );
}
