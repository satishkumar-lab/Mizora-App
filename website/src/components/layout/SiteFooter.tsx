import Link from 'next/link';

import { MizoraFullLogo } from '@/components/brand/MizoraFullLogo';
import { Container } from '@/components/layout/Container';
import { footerContent } from '@/content/home';
import { homeSectionLinks, legalPageLinks } from '@/content/navigation';
import { SITE } from '@/lib/site';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#141c12] py-12 text-white sm:py-14">
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[320px]">
            <MizoraFullLogo width={110} className="brightness-0 invert" />
            <p className="mt-4 text-[14px] leading-[1.55] text-white/65">{footerContent.tagline}</p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-14 lg:gap-16">
            <nav aria-label="Site sections">
              <p className="text-[11px] font-bold tracking-[0.1em] text-white/45 uppercase">
                Explore
              </p>
              <ul className="mt-3 flex flex-col gap-2.5">
                {homeSectionLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] font-medium text-white/80 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Legal">
              <p className="text-[11px] font-bold tracking-[0.1em] text-white/45 uppercase">
                Legal
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2.5">
                {legalPageLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[14px] font-medium text-white/80 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-8 text-[13px] text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Mizora. All rights reserved.</p>
          <p>
            <a href={`mailto:${SITE.supportEmail}`} className="hover:text-white/80">
              {SITE.supportEmail}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
