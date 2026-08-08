import { Container } from '@/components/layout/Container';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { featuresSection } from '@/content/home';

export function FeaturesSection() {
  return (
    <section
      id={featuresSection.id}
      aria-labelledby="features-heading"
      className="border-b border-black/[0.04] bg-white py-16 sm:py-20 lg:py-24"
    >
      <Container>
        <div className="mx-auto max-w-[640px] text-center">
          <p className="text-mizora-premium text-[12px] font-bold tracking-[0.12em] uppercase sm:text-[13px]">
            {featuresSection.eyebrow}
          </p>
          <h2
            id="features-heading"
            className="text-mizora-ink mt-3 text-[32px] leading-[1.08] font-bold tracking-[-0.04em] text-balance sm:text-[40px] lg:text-[44px]"
          >
            {featuresSection.title}
          </h2>
          <p className="text-mizora-ink-secondary mt-4 text-[16px] leading-[1.5] tracking-[-0.01em] sm:text-[18px]">
            {featuresSection.subtitle}
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {featuresSection.items.map((item, index) => (
            <li
              key={item.title}
              className="flex flex-col rounded-[20px] border border-black/[0.06] bg-[#fafdf6] p-6 shadow-[0_1px_0_rgba(20,28,18,0.04)] transition duration-200 hover:border-black/[0.08] hover:shadow-[0_12px_40px_rgba(20,28,18,0.06)] sm:p-7 lg:rounded-[24px]"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <MetricBadgeIcon kind={item.icon} size={44} />
              <h3 className="text-mizora-ink mt-5 text-[18px] font-bold tracking-[-0.02em] sm:text-[19px]">
                {item.title}
              </h3>
              <p className="text-mizora-ink-secondary mt-2.5 flex-1 text-[15px] leading-[1.55] tracking-[-0.01em]">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
