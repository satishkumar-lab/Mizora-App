import { Container } from '@/components/layout/Container';
import { faqSection } from '@/content/home';

export function FaqSection() {
  return (
    <section
      id={faqSection.id}
      aria-labelledby="faq-heading"
      className="border-b border-black/[0.04] bg-[#fafdf6] py-16 sm:py-20 lg:py-24"
    >
      <Container className="max-w-[720px]">
        <div className="text-center">
          <p className="text-mizora-premium text-[12px] font-bold tracking-[0.12em] uppercase sm:text-[13px]">
            {faqSection.eyebrow}
          </p>
          <h2
            id="faq-heading"
            className="text-mizora-ink mt-3 text-[32px] leading-[1.08] font-bold tracking-[-0.04em] sm:text-[40px]"
          >
            {faqSection.title}
          </h2>
          <p className="text-mizora-ink-secondary mt-4 text-[16px] leading-[1.55] sm:text-[18px]">
            {faqSection.subtitle}
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqSection.items.map((item) => (
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
              <p className="text-mizora-ink-secondary mt-3 text-[15px] leading-[1.55]">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
