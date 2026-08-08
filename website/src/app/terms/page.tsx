import type { Metadata } from 'next';

import { LegalDocumentLayout } from '@/components/legal/LegalDocumentLayout';
import { PageHero } from '@/components/layout/PageHero';
import { termsPage } from '@/content/legal';

export const metadata: Metadata = {
  title: termsPage.title,
  description: termsPage.subtitle,
};

export default function TermsPage() {
  return (
    <main>
      <PageHero
        eyebrow={termsPage.eyebrow}
        title={termsPage.headline}
        subtitle={termsPage.subtitle}
        meta={
          <span className="text-mizora-ink-secondary inline-flex items-center rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-[13px] font-medium shadow-[0_1px_0_rgba(20,28,18,0.04)]">
            Last updated {termsPage.lastUpdated}
          </span>
        }
      />
      <LegalDocumentLayout content={termsPage} />
    </main>
  );
}
