import { Text, View } from 'react-native';

import { InsightBanner, InsightEmphasis } from '@/components/ui/InsightBanner';
import { useMizoraTheme } from '@/hooks/useMizoraTheme';
import type { UnlockImpactSummary } from '@/lib/unlockImpactStats';
import { formatDurationShort } from '@/lib/unlockImpactStats';
import { fonts } from '@/theme/tokens';

type UnlockImpactMethodologyCardProps = {
  impact: UnlockImpactSummary;
};

export function UnlockImpactMethodologyCard({ impact }: UnlockImpactMethodologyCardProps) {
  const { colors } = useMizoraTheme();
  const per1kWalk = formatDurationShort(impact.minutesPer1kSteps);
  const per1kSaved = formatDurationShort(impact.screenMinutesSavedPer1kSteps);

  return (
    <View style={{ gap: 12 }}>
      <InsightBanner>
        <InsightEmphasis>{impact.blockedAppsCount} locked apps</InsightEmphasis>
        {' · '}
        {formatDurationShort(impact.screenTimeSavedMinutesThisWeek)} back from scrolling this week.
      </InsightBanner>

      <View
        className="rounded-[15px] px-4 py-3.5"
        style={{
          gap: 6,
          backgroundColor: colors.surfaceMuted,
          borderWidth: 1,
          borderColor: colors.borderDivider,
        }}
      >
        <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.textAccentGreen }}>
          How we estimate
        </Text>
        <Text
          style={{
            fontFamily: fonts.regular,
            fontSize: 12,
            color: colors.textSecondary,
            lineHeight: 18,
          }}
        >
          1,000 unlock steps ≈ {per1kWalk} walking at {impact.stepsPerMinute} steps/min → ~
          {per1kSaved} less on locked apps. Pace updates when Health syncs.
        </Text>
      </View>
    </View>
  );
}
