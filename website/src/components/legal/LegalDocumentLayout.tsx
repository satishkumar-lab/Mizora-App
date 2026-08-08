import type { ReactNode } from 'react';

import { Container } from '@/components/layout/Container';
import { LegalSectionBlock } from '@/components/legal/LegalSectionBlock';
import { LegalToc } from '@/components/legal/LegalToc';
import type { LegalPageContent } from '@/content/legal';

type LegalDocumentLayoutProps = {
  content: LegalPageContent;
  children?: ReactNode;
};

export function LegalDocumentLayout({ content, children }: LegalDocumentLayoutProps) {
  return (
    <Container className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[720px]">
        <p className="text-mizora-ink-secondary text-[16px] leading-[1.65]">{content.intro}</p>
      </div>

      <div className="mx-auto mt-12 grid max-w-[1120px] gap-10 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-14">
        <aside className="hidden lg:block">
          <LegalToc sections={content.sections} />
        </aside>

        <div className="min-w-0 space-y-5">
          <nav
            aria-label="Table of contents"
            className="rounded-[16px] border border-black/[0.06] bg-white p-4 lg:hidden"
          >
            <p className="text-mizora-premium text-[11px] font-bold tracking-[0.1em] uppercase">
              Jump to section
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {content.sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-mizora-ink-secondary hover:border-mizora-lime hover:bg-mizora-lime-soft rounded-full border border-black/[0.08] bg-[#fafdf6] px-3 py-1.5 text-[13px] font-medium transition"
                >
                  {section.heading}
                </a>
              ))}
            </div>
          </nav>

          {content.sections.map((section) => (
            <LegalSectionBlock key={section.id} section={section} />
          ))}

          {children}
        </div>
      </div>
    </Container>
  );
}
