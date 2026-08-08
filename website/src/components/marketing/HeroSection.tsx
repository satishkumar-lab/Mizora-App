import { Container } from '@/components/layout/Container';
import { PhoneShowcase } from '@/components/device/PhoneShowcase';
import { Button } from '@/components/ui/Button';
import { heroContent } from '@/content/home';
import { SITE } from '@/lib/site';

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-x-clip border-b border-black/[0.04]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 72% 58% at 78% 42%, rgba(193, 253, 58, 0.22) 0%, rgba(193, 253, 58, 0) 68%), radial-gradient(ellipse 48% 38% at 12% 8%, rgba(245, 255, 187, 0.45) 0%, rgba(255, 255, 255, 0) 62%), linear-gradient(180deg, #ffffff 0%, #fafdf6 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(20,28,18,0.04) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      <Container className="relative grid items-center gap-12 py-12 pb-16 sm:gap-14 sm:py-20 lg:min-h-[calc(100svh-72px)] lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-10 lg:py-24 xl:gap-6">
        <div className="mx-auto max-w-[580px] text-center lg:mx-0 lg:pb-6 lg:text-left">
          <p className="reveal text-mizora-premium inline-flex items-center rounded-full border border-black/[0.06] bg-white/70 px-3.5 py-1.5 text-[12px] font-bold tracking-[0.12em] uppercase shadow-[0_1px_0_rgba(20,28,18,0.04)] sm:text-[13px]">
            {heroContent.eyebrow}
          </p>

          <h1
            id="hero-heading"
            className="reveal reveal-delay-1 text-mizora-ink mt-5 text-[40px] leading-[1.02] font-bold tracking-[-0.045em] text-balance sm:text-[56px] lg:mt-6 lg:text-[68px]"
          >
            {heroContent.headlineLine1}
            <br />
            <span className="bg-gradient-to-r from-[#141c12] via-[#141c12] to-[#5c6d05] bg-clip-text text-transparent dark:from-white dark:via-white dark:to-[#c1fd3a]">
              {heroContent.headlineLine2}
            </span>
          </h1>

          <p className="reveal reveal-delay-2 text-mizora-ink-secondary mx-auto mt-5 max-w-[460px] text-[17px] leading-[1.5] tracking-[-0.015em] sm:mt-6 sm:text-[19px] lg:mx-0">
            {heroContent.subheadline}
          </p>

          <ul className="reveal reveal-delay-2 mx-auto mt-6 flex flex-wrap items-center justify-center gap-2 lg:mx-0 lg:justify-start">
            {heroContent.highlights.map((item) => (
              <li
                key={item}
                className="bg-mizora-lime-soft/80 text-mizora-premium rounded-full px-3 py-1 text-[12px] font-semibold tracking-[-0.01em] sm:text-[13px]"
              >
                {item}
              </li>
            ))}
          </ul>

          <div className="reveal reveal-delay-3 mt-8 flex flex-col items-center gap-3 sm:mt-10 lg:items-start">
            <Button
              href={SITE.downloadUrl}
              className="min-w-[188px] text-[15px] shadow-[0_8px_28px_rgba(193,253,58,0.35)] sm:min-w-[204px] sm:!px-8 sm:!py-3.5 sm:text-[16px]"
            >
              {heroContent.primaryCta}
            </Button>
            <p className="text-mizora-ink-muted text-[13px] font-medium tracking-[-0.01em] sm:text-[14px]">
              {heroContent.secondaryLine}
            </p>
          </div>
        </div>

        <div className="reveal reveal-delay-4 relative flex justify-center lg:justify-end lg:pr-0 xl:pr-4">
          <div
            aria-hidden="true"
            className="absolute top-[42%] left-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(193,253,58,0.32)_0%,rgba(193,253,58,0)_70%)] blur-3xl"
          />
          <PhoneShowcase
            screen="home"
            size="hero"
            float
            className="relative origin-top scale-[0.9] sm:scale-[0.96] lg:scale-100"
          />
        </div>
      </Container>
    </section>
  );
}
