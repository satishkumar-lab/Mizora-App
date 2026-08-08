import { SplitShowcaseSection } from '@/components/marketing/SplitShowcaseSection';
import { streakSection } from '@/content/home';

export function StreakShowcaseSection() {
  return (
    <SplitShowcaseSection
      id={streakSection.id}
      eyebrow={streakSection.eyebrow}
      title={streakSection.title}
      subtitle={streakSection.subtitle}
      bullets={streakSection.bullets}
      screen="streak"
      reverse
      tone="white"
    />
  );
}
