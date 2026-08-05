import { InsightBanner, InsightEmphasis } from '@/components/ui/InsightBanner';
import { usePersonalization } from '@/providers/PersonalizationProvider';

export function HomeInsightBanner() {
  const { homeInsight } = usePersonalization();

  if (!homeInsight) return null;

  return (
    <InsightBanner icon="sparkles-outline">
      {homeInsight.before}
      <InsightEmphasis>{homeInsight.emphasis}</InsightEmphasis>
      {homeInsight.after}
    </InsightBanner>
  );
}
