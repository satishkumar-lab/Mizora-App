import Link from 'next/link';
import type { Metadata } from 'next';

import { Container } from '@/components/layout/Container';
import { PageHero } from '@/components/layout/PageHero';
import { Button } from '@/components/ui/Button';
import { supportPage } from '@/content/support';

export const metadata: Metadata = {
  title: supportPage.title,
  description: supportPage.subtitle,
};

export default function SupportPage() {
  return (
    <main>
      <PageHero
        eyebrow={supportPage.eyebrow}
        title={supportPage.headline}
        subtitle={supportPage.subtitle}
      />

      <Container className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-[720px]">
          <div className="bg-mizora-lime-soft/50 text-mizora-ink-strong rounded-[18px] border border-black/[0.06] px-5 py-4 text-[15px] leading-[1.55]">
            {supportPage.banner}
          </div>
        </div>

        <section aria-labelledby="support-faq-heading" className="mx-auto mt-12 max-w-[720px]">
          <p className="text-mizora-premium text-[12px] font-bold tracking-[0.12em] uppercase">
            FAQ
          </p>
          <h2
            id="support-faq-heading"
            className="text-mizora-ink mt-2 text-[28px] font-bold tracking-[-0.03em] sm:text-[32px]"
          >
            Frequently asked questions
          </h2>
          <p className="text-mizora-ink-muted mt-2 text-[14px]">{supportPage.faqFooter}</p>
          <div className="mt-8 space-y-3">
            {supportPage.faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-[16px] border border-black/[0.06] bg-white px-5 py-4 shadow-[0_1px_0_rgba(20,28,18,0.04)] open:shadow-[0_8px_30px_rgba(20,28,18,0.06)]"
              >
                <summary className="text-mizora-ink cursor-pointer list-none text-[15px] font-bold tracking-[-0.01em] marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-mizora-ink-muted text-[18px] font-normal transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="text-mizora-ink-secondary mt-3 text-[15px] leading-[1.55]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="contact-heading" className="mx-auto mt-14 max-w-[720px]">
          <h2
            id="contact-heading"
            className="text-mizora-ink text-[22px] font-bold tracking-[-0.03em]"
          >
            Get in touch
          </h2>
          <div className="mt-5 rounded-[20px] border border-black/[0.06] bg-white p-6 shadow-[0_1px_0_rgba(20,28,18,0.04)] sm:p-7">
            <p className="text-mizora-ink text-[17px] font-bold">{supportPage.contact.label}</p>
            <p className="text-mizora-ink-secondary mt-1 text-[14px]">
              {supportPage.contact.subtitle}
            </p>
            <a
              href={`mailto:${supportPage.contact.email}?subject=${encodeURIComponent('Mizora support')}`}
              className="text-mizora-ink decoration-mizora-lime mt-4 block text-[20px] font-bold tracking-[-0.02em] underline decoration-[3px] underline-offset-4"
            >
              {supportPage.contact.email}
            </a>
            <p className="text-mizora-ink-muted mt-3 text-[14px]">
              {supportPage.contact.responseTime}
            </p>
            <Button
              href={`mailto:${supportPage.contact.email}?subject=${encodeURIComponent('Mizora support')}`}
              className="mt-5"
            >
              Email support
            </Button>
          </div>
        </section>

        <section aria-labelledby="policies-heading" className="mx-auto mt-14 max-w-[720px]">
          <h2
            id="policies-heading"
            className="text-mizora-ink text-[22px] font-bold tracking-[-0.03em]"
          >
            Policies
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {supportPage.legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-mizora-ink hover:border-mizora-lime hover:bg-mizora-lime-soft/60 rounded-[16px] border border-black/[0.06] bg-[#fafdf6] px-5 py-4 text-[15px] font-bold transition"
              >
                {link.label}
                <span className="text-mizora-ink-secondary mt-1 block text-[13px] font-medium">
                  Read on website →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
