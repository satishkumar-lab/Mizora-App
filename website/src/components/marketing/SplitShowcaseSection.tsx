import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon';
import { Container } from '@/components/layout/Container';
import { PhoneShowcase } from '@/components/device/PhoneShowcase';
import type { ScreenKey } from '@/lib/product-screens';

type SplitShowcaseSectionProps = {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  bullets?: readonly string[];
  footnote?: string;
  screen: ScreenKey;
  reverse?: boolean;
  tone?: 'white' | 'soft';
  phoneSize?: 'md' | 'lg';
};

export function SplitShowcaseSection({
  id,
  eyebrow,
  title,
  subtitle,
  bullets,
  footnote,
  screen,
  reverse = false,
  tone = 'soft',
  phoneSize = 'lg',
}: SplitShowcaseSectionProps) {
  const bg = tone === 'white' ? 'bg-white' : 'bg-[#fafdf6]';

  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-heading` : undefined}
      className={`relative overflow-x-clip border-b border-black/[0.04] py-16 sm:py-20 lg:py-24 ${bg}`}
    >
      {tone === 'soft' ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background: reverse
              ? 'radial-gradient(ellipse 55% 45% at 85% 50%, rgba(193, 253, 58, 0.14) 0%, transparent 65%)'
              : 'radial-gradient(ellipse 55% 45% at 15% 50%, rgba(193, 253, 58, 0.14) 0%, transparent 65%)',
          }}
        />
      ) : null}

      <Container
        className={`relative grid items-center gap-12 lg:grid-cols-2 lg:gap-14 xl:gap-20 ${reverse ? '' : ''}`}
      >
        <div className={reverse ? 'order-2 lg:order-2' : 'order-2 lg:order-1'}>
          <div
            className={`relative flex justify-center ${reverse ? 'lg:justify-end' : 'lg:justify-start'}`}
          >
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(193,253,58,0.25)_0%,transparent_70%)] blur-2xl"
            />
            <PhoneShowcase
              screen={screen}
              size={phoneSize}
              className="relative scale-[0.92] sm:scale-100"
            />
          </div>
        </div>

        <div
          className={`order-1 mx-auto max-w-[520px] text-center lg:mx-0 lg:text-left ${reverse ? 'lg:order-1' : 'lg:order-2'}`}
        >
          <p className="text-mizora-premium text-[12px] font-bold tracking-[0.12em] uppercase sm:text-[13px]">
            {eyebrow}
          </p>
          <h2
            id={id ? `${id}-heading` : undefined}
            className="text-mizora-ink mt-3 text-[32px] leading-[1.08] font-bold tracking-[-0.04em] text-balance sm:text-[40px] lg:text-[44px]"
          >
            {title}
          </h2>
          <p className="text-mizora-ink-secondary mt-4 text-[16px] leading-[1.55] tracking-[-0.01em] sm:text-[18px]">
            {subtitle}
          </p>

          {bullets && bullets.length > 0 ? (
            <ul className="mt-8 space-y-3 text-left">
              {bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="text-mizora-ink-strong flex gap-3 text-[15px] leading-[1.5]"
                >
                  <span
                    className="bg-mizora-lime-soft mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    aria-hidden="true"
                  >
                    <CheckmarkIcon size={14} color="#5c6d05" />
                  </span>
                  <span className="tracking-[-0.01em]">{bullet}</span>
                </li>
              ))}
            </ul>
          ) : null}

          {footnote ? (
            <p className="text-mizora-ink-muted mt-6 text-[13px] font-medium sm:text-[14px]">
              {footnote}
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
