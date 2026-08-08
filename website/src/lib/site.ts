export const SITE = {
  name: 'Mizora',
  url: 'https://mizora.app',
  tagline: 'A calmer way to get healthier.',
  description:
    'Mizora helps you build healthier habits through simple daily movement, hydration, and progress that feels rewarding.',
  /** App Store / Play Store / universal link — set via NEXT_PUBLIC_DOWNLOAD_URL */
  downloadUrl: process.env.NEXT_PUBLIC_DOWNLOAD_URL ?? '#',
  supportEmail: 'support@mizora.app',
  businessEmail: 'hello@mizora.app',
} as const;
