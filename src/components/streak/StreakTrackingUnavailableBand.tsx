import { type ReactNode } from 'react';
import { Text, View } from 'react-native';

import type { StepsTrackingStatus } from '@/lib/health/readTodaySteps';
import { stepsPermissionUiCopy } from '@/lib/health/stepsTrackingUi';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import { mizoraType } from '@/theme/typography';
import { fonts } from '@/theme/tokens';

type StreakTrackingUnavailableBandProps = {
  status: StepsTrackingStatus;
  trailing?: ReactNode;
};

export function StreakTrackingUnavailableBand({
  status,
  trailing,
}: StreakTrackingUnavailableBandProps) {
  const { colors } = useMizoraTheme();
  const { title, body } = stepsPermissionUiCopy(status);

  return (
    <View className="flex-row items-center" style={{ gap: 14 }}>
      <Text
        style={{
          fontFamily: fonts.medium,
          fontSize: 32,
          color: colors.textMuted,
          lineHeight: 34,
          letterSpacing: -0.5,
          minWidth: 40,
        }}
      >
        —
      </Text>

      <View className="min-w-0 flex-1" style={{ gap: 4 }}>
        <Text
          style={{
            fontFamily: fonts.medium,
            fontSize: 11,
            color: colors.textMuted,
            letterSpacing: 0.3,
            textTransform: 'uppercase',
          }}
        >
          Streak
        </Text>
        <Text style={{ ...mizoraType.sectionTitle, color: colors.textStrong, lineHeight: 19 }}>
          {title}
        </Text>
        <Text
          numberOfLines={3}
          style={{
            fontFamily: fonts.regular,
            fontSize: 12,
            color: colors.textSecondary,
            lineHeight: 16,
          }}
        >
          {body}
        </Text>
      </View>

      {trailing}
    </View>
  );
}

export function StreakThisWeekUnavailable() {
  const { colors } = useMizoraTheme();

  return (
    <View style={{ gap: 6 }}>
      <Text style={{ ...mizoraType.bodyMedium, color: colors.textSecondary }}>This week</Text>
      <Text
        style={{
          fontFamily: fonts.regular,
          fontSize: 12,
          color: colors.textMuted,
          lineHeight: 16,
        }}
      >
        Daily goal markers appear here once step tracking is available.
      </Text>
    </View>
  );
}
