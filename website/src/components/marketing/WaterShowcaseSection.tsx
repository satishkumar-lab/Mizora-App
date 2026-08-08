import { SplitShowcaseSection } from '@/components/marketing/SplitShowcaseSection';
import { waterSection } from '@/content/home';

export function WaterShowcaseSection() {
  return (
    <SplitShowcaseSection
      id={waterSection.id}
      eyebrow={waterSection.eyebrow}
      title={waterSection.title}
      subtitle={waterSection.subtitle}
      bullets={waterSection.bullets}
      footnote={waterSection.footnote}
      screen="water"
      tone="soft"
    />
  );
}
