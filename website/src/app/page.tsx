import { DownloadCtaSection } from '@/components/marketing/DownloadCtaSection';
import { FaqSection } from '@/components/marketing/FaqSection';
import { FeaturesSection } from '@/components/marketing/FeaturesSection';
import { HeroSection } from '@/components/marketing/HeroSection';
import { HowItWorksSection } from '@/components/marketing/HowItWorksSection';
import { StepsShowcaseSection } from '@/components/marketing/StepsShowcaseSection';
import { StreakShowcaseSection } from '@/components/marketing/StreakShowcaseSection';
import { WaterShowcaseSection } from '@/components/marketing/WaterShowcaseSection';
import { WeeklyReportSection } from '@/components/marketing/WeeklyReportSection';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <StepsShowcaseSection />
      <WaterShowcaseSection />
      <WeeklyReportSection />
      <StreakShowcaseSection />
      <HowItWorksSection />
      <FaqSection />
      <DownloadCtaSection />
    </main>
  );
}
