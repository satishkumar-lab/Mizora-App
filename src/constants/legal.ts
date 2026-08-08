/** Store listing + in-app legal — canonical public URLs (production website). */
export const LEGAL = {
  webBaseUrl: 'https://website-chi-red-98.vercel.app',
  privacyPolicyUrl: 'https://website-chi-red-98.vercel.app/privacy',
  termsOfServiceUrl: 'https://website-chi-red-98.vercel.app/terms',
  supportUrl: 'https://website-chi-red-98.vercel.app/support',
  /** In-app routes (match public paths for consistency). */
  privacyPolicyPath: '/privacy' as const,
  termsOfServicePath: '/terms' as const,
} as const;
