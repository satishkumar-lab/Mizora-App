import { footerContent } from '@/content/home';

/** Hash anchors on the homepage, prefixed for use from any route. */
export const homeSectionLinks = footerContent.links.map((link) => ({
  label: link.label,
  href: link.href.startsWith('#') ? `/${link.href}` : link.href,
}));

export const legalPageLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Support', href: '/support' },
] as const;

/** Primary header navigation (product + support). */
export const headerNavLinks = [
  homeSectionLinks[0],
  homeSectionLinks[1],
  legalPageLinks[0],
  legalPageLinks[1],
  legalPageLinks[2],
] as const;

/** Footer includes marketing anchors and legal pages. */
export const footerNavLinks = [...homeSectionLinks, ...legalPageLinks] as const;
