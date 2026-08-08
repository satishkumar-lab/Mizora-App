import type { Metadata } from 'next';

import { LegalDocumentLayout } from '@/components/legal/LegalDocumentLayout';
import { PageHero } from '@/components/layout/PageHero';
import { privacyPage } from '@/content/legal';

export const metadata: Metadata = {
  title: privacyPage.title,
  description: privacyPage.subtitle,
};

export default function PrivacyPage() {
  return (
    <main>
      <PageHero
        eyebrow={privacyPage.eyebrow}
        title={privacyPage.headline}
        subtitle={privacyPage.subtitle}
        meta={
          <span className="text-mizora-ink-secondary inline-flex items-center rounded-full border border-black/[0.08] bg-white px-4 py-1.5 text-[13px] font-medium shadow-[0_1px_0_rgba(20,28,18,0.04)]">
            Last updated {privacyPage.lastUpdated}
          </span>
        }
      />
      <LegalDocumentLayout content={privacyPage} />
    </main>
  );
}
