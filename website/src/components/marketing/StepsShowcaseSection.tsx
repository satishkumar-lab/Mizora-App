import { SplitShowcaseSection } from '@/components/marketing/SplitShowcaseSection';
import { stepsSection } from '@/content/home';

export function StepsShowcaseSection() {
  return (
    <SplitShowcaseSection
      id={stepsSection.id}
      eyebrow={stepsSection.eyebrow}
      title={stepsSection.title}
      subtitle={stepsSection.subtitle}
      bullets={stepsSection.bullets}
      footnote={stepsSection.footnote}
      screen="steps"
      reverse
      tone="white"
    />
  );
}
