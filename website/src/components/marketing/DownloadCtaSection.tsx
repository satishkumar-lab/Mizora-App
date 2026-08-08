import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { downloadSection, heroContent } from '@/content/home';
import { SITE } from '@/lib/site';

export function DownloadCtaSection() {
  return (
    <section
      id={downloadSection.id}
      aria-labelledby="download-heading"
      className="bg-mizora-lime relative overflow-hidden border-b border-black/[0.06] py-16 sm:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(20,28,18,0.06) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />
      <Container className="relative text-center">
        <h2
          id="download-heading"
          className="text-mizora-ink text-[32px] leading-[1.06] font-bold tracking-[-0.04em] text-balance sm:text-[44px]"
        >
          {downloadSection.title}
        </h2>
        <p className="text-mizora-ink-strong/80 mx-auto mt-4 max-w-[480px] text-[17px] leading-[1.5] sm:text-[19px]">
          {downloadSection.subtitle}
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button
            href={SITE.downloadUrl}
            variant="ghost"
            className="!bg-mizora-ink min-w-[200px] !text-white shadow-[0_12px_40px_rgba(20,28,18,0.18)] hover:!brightness-110"
          >
            {downloadSection.cta}
          </Button>
          <p className="text-mizora-ink-strong/70 text-[13px] font-medium">
            {downloadSection.note}
          </p>
          <p className="text-mizora-ink-strong/55 text-[12px]">{heroContent.secondaryLine}</p>
        </div>
      </Container>
    </section>
  );
}
