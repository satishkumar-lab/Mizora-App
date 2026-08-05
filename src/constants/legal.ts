/** Store listing + in-app legal — web export serves `/privacy` and `/terms` at these URLs when hosted on webBaseUrl. */
export const LEGAL = {
  webBaseUrl: 'https://mizora.app',
  privacyPolicyUrl: 'https://mizora.app/privacy',
  termsOfServiceUrl: 'https://mizora.app/terms',
  supportEmail: 'support@mizora.app',
  /** In-app routes (match public paths for consistency). */
  privacyPolicyPath: '/privacy' as const,
  termsOfServicePath: '/terms' as const,
} as const;
