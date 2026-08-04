import type { WaterProfileInput } from '@/lib/water-recommendation';
import { hydrationBannerCopy } from '@/lib/water-recommendation';
import { InsightBanner, InsightEmphasis } from '@/components/ui/InsightBanner';

type WaterHydrationInsightProps = {
  goalMl: number;
  profile?: WaterProfileInput | null;
};

export function WaterHydrationInsight({ goalMl, profile }: WaterHydrationInsightProps) {
  const copy = hydrationBannerCopy(goalMl, profile);

  return (
    <InsightBanner borderVariant="water">
      {copy.before}
      <InsightEmphasis>{copy.highlight}</InsightEmphasis>
      {copy.after}
    </InsightBanner>
  );
}
