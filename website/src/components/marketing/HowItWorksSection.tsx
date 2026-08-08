import { Container } from '@/components/layout/Container';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { howItWorksSection } from '@/content/home';

const STEP_ICONS = ['steps', 'unlock', 'water'] as const;

export function HowItWorksSection() {
  return (
    <section
      id={howItWorksSection.id}
      aria-labelledby="how-heading"
      className="border-b border-black/[0.04] bg-white py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-mizora-premium text-[12px] font-bold tracking-[0.12em] uppercase sm:text-[13px]">
            {howItWorksSection.eyebrow}
          </p>
          <h2
            id="how-heading"
            className="text-mizora-ink mt-3 text-[32px] leading-[1.08] font-bold tracking-[-0.04em] text-balance sm:text-[40px]"
          >
            {howItWorksSection.title}
          </h2>
          <p className="text-mizora-ink-secondary mt-4 text-[16px] leading-[1.55] sm:text-[18px]">
            {howItWorksSection.subtitle}
          </p>
        </div>

        <ol className="mt-12 grid gap-5 sm:mt-14 lg:grid-cols-3 lg:gap-6">
          {howItWorksSection.steps.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-[20px] border border-black/[0.06] bg-[#fafdf6] p-6 sm:p-7"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-mizora-lime-soft text-[32px] leading-none font-bold tracking-[-0.04em]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <MetricBadgeIcon kind={STEP_ICONS[index] ?? 'steps'} size={40} />
              </div>
              <h3 className="text-[18px] font-bold tracking-[-0.02em]">{step.title}</h3>
              <p className="text-mizora-ink-secondary mt-2 text-[15px] leading-[1.55]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
