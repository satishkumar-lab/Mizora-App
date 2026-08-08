import { SplitShowcaseSection } from '@/components/marketing/SplitShowcaseSection';
import { weeklySection } from '@/content/home';

export function WeeklyReportSection() {
  return (
    <SplitShowcaseSection
      id={weeklySection.id}
      eyebrow={weeklySection.eyebrow}
      title={weeklySection.title}
      subtitle={weeklySection.subtitle}
      bullets={weeklySection.bullets}
      footnote={weeklySection.footnote}
      screen="weekly-report"
      tone="soft"
    />
  );
}
