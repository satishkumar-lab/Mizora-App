import type { LegalSection } from '@/content/legal';

type LegalSectionBlockProps = {
  section: LegalSection;
};

export function LegalSectionBlock({ section }: LegalSectionBlockProps) {
  return (
    <section
      id={section.id}
      className="scroll-mt-28 rounded-[20px] border border-black/[0.06] bg-white p-6 shadow-[0_1px_0_rgba(20,28,18,0.04)] sm:p-8"
    >
      <h2 className="text-mizora-ink text-[22px] font-bold tracking-[-0.03em] sm:text-[26px]">
        {section.heading}
      </h2>
      <div className="mt-4 space-y-4">
        {section.paragraphs.map((paragraph, index) => (
          <p
            key={`${section.id}-p-${index}`}
            className="text-mizora-ink-secondary text-[16px] leading-[1.65]"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
