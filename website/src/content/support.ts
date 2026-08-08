import { SITE } from '@/lib/site';

/** Mirrors `src/constants/helpFaq.ts` + Profile → Help & support. */
export const supportPage = {
  title: 'Help & support',
  eyebrow: 'Support',
  headline: 'Need help? We’re here.',
  subtitle: 'Quick answers below — the same topics as Profile → Help & support in the app.',
  banner: 'Quick answers below. Still stuck? Email us — we read every message.',
  contact: {
    label: 'Contact support',
    subtitle: 'Bug reports, feedback, and data questions',
    email: SITE.supportEmail,
    responseTime: 'We usually reply within 1–2 business days.',
  },
  faqFooter: 'Tap a question to read the answer.',
  faq: [
    {
      q: 'Steps not updating?',
      a: 'Allow Motion (iPhone) or Health Connect (Android) for Mizora in your phone settings, then open the Steps tab and tap Try again. On Android, install or update Health Connect if prompted.',
    },
    {
      q: 'How do I change daily goals?',
      a: 'Open Profile → Daily step goal, or use Quick actions (+) on Home. Water goals are under Profile → Health profile or the Water tracker.',
    },
    {
      q: 'Does Mizora send push notifications?',
      a: 'Mizora 1.0 tracks progress in the app. Push reminders are planned for a later update.',
    },
    {
      q: 'Where is my data stored?',
      a: 'Steps, water, streaks, and goals stay on your device. Optional name and health profile personalize targets — see Profile → Privacy & data.',
    },
    {
      q: 'Are calorie numbers medical advice?',
      a: 'Active calories are estimated from your steps for motivation only. They are not a medical or dietary prescription.',
    },
    {
      q: 'How do I delete my data?',
      a: 'Profile → Privacy & data → Delete data on this device removes profile and preference fields stored by that action. Step and water logs may remain until a full app reinstall.',
    },
  ],
  legalLinks: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
} as const;
