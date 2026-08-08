import type { ReactNode } from 'react';

import { Container } from '@/components/layout/Container';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  variant?: 'default' | 'soft';
};

export function PageHero({ eyebrow, title, subtitle, meta, variant = 'soft' }: PageHeroProps) {
  const bg =
    variant === 'soft'
      ? 'border-b border-black/[0.04] bg-[#fafdf6]'
      : 'border-b border-black/[0.04] bg-white';

  return (
    <section className={`relative overflow-hidden py-16 sm:py-20 lg:py-24 ${bg}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% -10%, rgba(193, 253, 58, 0.22) 0%, transparent 65%)',
        }}
      />
      <Container className="relative max-w-[800px] text-center">
        <p className="text-mizora-premium text-[12px] font-bold tracking-[0.12em] uppercase sm:text-[13px]">
          {eyebrow}
        </p>
        <h1 className="text-mizora-ink mt-3 text-[36px] leading-[1.06] font-bold tracking-[-0.04em] text-balance sm:text-[48px] lg:text-[52px]">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-mizora-ink-secondary mx-auto mt-5 max-w-[640px] text-[17px] leading-[1.55] tracking-[-0.01em] sm:text-[19px]">
            {subtitle}
          </p>
        ) : null}
        {meta ? (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{meta}</div>
        ) : null}
      </Container>
    </section>
  );
}
