import Link from 'next/link';

import { MizoraFullLogo } from '@/components/brand/MizoraFullLogo';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { headerNavLinks } from '@/content/navigation';
import { heroContent } from '@/content/home';
import { SITE } from '@/lib/site';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.04] bg-white/85 backdrop-blur-xl">
      <Container className="flex h-[64px] items-center justify-between gap-4 sm:h-[72px]">
        <Link
          href="/"
          className="focus-visible:ring-mizora-ink/20 shrink-0 rounded-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          <MizoraFullLogo width={124} priority />
        </Link>

        <nav
          aria-label="Primary"
          className="hidden flex-1 items-center justify-center gap-6 lg:flex"
        >
          {headerNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-mizora-ink-secondary hover:text-mizora-ink text-[14px] font-medium transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Button
          href={SITE.downloadUrl}
          className="!px-5 !py-2.5 text-[14px]"
          aria-label={heroContent.primaryCta}
        >
          {heroContent.primaryCta}
        </Button>
      </Container>
    </header>
  );
}
