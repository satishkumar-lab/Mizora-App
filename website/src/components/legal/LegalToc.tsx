import Link from 'next/link';

type LegalTocProps = {
  sections: readonly { id: string; heading: string }[];
  title?: string;
};

export function LegalToc({ sections, title = 'On this page' }: LegalTocProps) {
  return (
    <nav
      aria-label="Table of contents"
      className="rounded-[20px] border border-black/[0.06] bg-white p-5 shadow-[0_1px_0_rgba(20,28,18,0.04)] lg:sticky lg:top-24 lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto"
    >
      <p className="text-mizora-premium text-[11px] font-bold tracking-[0.1em] uppercase">
        {title}
      </p>
      <ol className="mt-4 space-y-2">
        {sections.map((section) => (
          <li key={section.id}>
            <Link
              href={`#${section.id}`}
              className="text-mizora-ink-secondary hover:bg-mizora-lime-soft/60 hover:text-mizora-ink block rounded-lg px-2 py-1.5 text-[14px] leading-snug font-medium transition"
            >
              {section.heading}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
