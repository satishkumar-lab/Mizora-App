import { SITE } from '@/lib/site';

/** Keep in sync with `src/constants/legalDocuments.ts` (app source of truth). */
export const LEGAL_LAST_UPDATED = 'August 8, 2026';

export type LegalSection = {
  id: string;
  heading: string;
  paragraphs: readonly string[];
};

export type LegalPageContent = {
  title: string;
  eyebrow: string;
  headline: string;
  subtitle: string;
  lastUpdated: string;
  intro: string;
  sections: readonly LegalSection[];
};

function slugify(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function withIds(sections: { heading: string; paragraphs: readonly string[] }[]): LegalSection[] {
  return sections.map((section) => ({
    id: slugify(section.heading),
    heading: section.heading,
    paragraphs: section.paragraphs,
  }));
}

export const privacyPage: LegalPageContent = {
  title: 'Privacy Policy',
  eyebrow: 'Privacy',
  headline: 'Your health data stays yours.',
  subtitle:
    'The same Privacy Policy you open from Profile in the Mizora app — hosted here for the web and store listings.',
  lastUpdated: LEGAL_LAST_UPDATED,
  intro:
    'Mizora (“we”, “our”, “us”) respects your privacy. This policy explains what we collect, why we collect it, and the choices you have when you use the Mizora mobile app (Version 1).',
  sections: withIds([
    {
      heading: 'Information we collect',
      paragraphs: [
        'Health and activity data you choose to connect (such as step counts from Motion or Health Connect) to power goals, charts, and streaks.',
        'App preferences you set in Mizora: daily step and water goals, notification preferences, streak progress, and dashboard settings — stored primarily on your device.',
        'Optional profile details you enter (such as display name, weight, height, or activity level) to personalize water and step recommendations.',
        'Basic diagnostic information if you contact support (device model, app version) so we can help you faster.',
      ],
    },
    {
      heading: 'How we use information',
      paragraphs: [
        'To run Mizora 1.0 features: step and water tracking, calorie estimates from steps, streaks, and your dashboard.',
        'To improve reliability and fix bugs — not to sell personal data or show third-party ads.',
        'We do not use your health data for advertising profiles.',
      ],
    },
    {
      heading: 'Permissions',
      paragraphs: [
        'Motion (iOS) or Health Connect (Android) is used for step tracking when you allow it. You can change or revoke access in your phone settings at any time.',
        'If you deny step access, step-related features are limited; water logging and goals on this device still work.',
        'Mizora 1.0 does not require app-usage or screen-time permissions.',
      ],
    },
    {
      heading: 'Storage and retention',
      paragraphs: [
        'Most Mizora data stays on your device. Delete data on this device in Profile removes certain profile and preference fields as described in the app.',
        'Support emails are kept only as long as needed to resolve your request.',
      ],
    },
    {
      heading: 'Sharing',
      paragraphs: [
        'We do not sell your personal information. We may use trusted infrastructure providers (hosting, email) under contracts that require them to protect your data.',
        'We may disclose information if required by law or to protect the safety of users and the public.',
      ],
    },
    {
      heading: 'Children',
      paragraphs: [
        'Mizora is intended for users who can consent to data processing under local law (typically 18+ in India). We do not knowingly collect data from children without appropriate consent.',
      ],
    },
    {
      heading: 'Your choices',
      paragraphs: [
        'Update or clear profile and health fields in Profile.',
        'Control saved notification preferences under Profile → Notifications (delivery may arrive in a future app update).',
        'Read Privacy & data in the app for a plain-language summary of what Mizora stores.',
        `Email us at ${SITE.supportEmail} for access, correction, or deletion questions.`,
      ],
    },
    {
      heading: 'Changes',
      paragraphs: [
        'We may update this policy as Mizora evolves. We will post the new date at the top and, for material changes, provide notice in the app where appropriate.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [`Questions about privacy: ${SITE.supportEmail}`],
    },
  ]),
};

export const termsPage: LegalPageContent = {
  title: 'Terms of Service',
  eyebrow: 'Terms',
  headline: 'Terms for using Mizora.',
  subtitle: 'The same Terms of Service linked from the app and App Store listings.',
  lastUpdated: LEGAL_LAST_UPDATED,
  intro:
    'These Terms govern your use of the Mizora app. By using Mizora, you agree to these Terms. If you do not agree, please do not use the app.',
  sections: withIds([
    {
      heading: 'The service',
      paragraphs: [
        'Mizora 1.0 helps you build healthy habits by tracking steps, water intake, streaks, and related goals on your device.',
        'Mizora is not medical advice. Calorie estimates and activity summaries are for general wellness only. Consult a qualified professional for health decisions.',
      ],
    },
    {
      heading: 'Your device',
      paragraphs: [
        'You are responsible for your device, permissions, and how you use Mizora alongside other apps.',
        'You must comply with applicable laws and the terms of platforms you use alongside Mizora.',
      ],
    },
    {
      heading: 'Acceptable use',
      paragraphs: [
        'Do not reverse engineer, abuse, or interfere with the service.',
        'Do not use Mizora to harass others or violate third-party rights.',
      ],
    },
    {
      heading: 'Intellectual property',
      paragraphs: [
        'Mizora’s branding, design, and software are owned by us or our licensors. Open-source components are used under their respective licenses.',
      ],
    },
    {
      heading: 'Disclaimer',
      paragraphs: [
        'Mizora is provided “as is” without warranties of any kind to the extent permitted by law. We do not guarantee uninterrupted or error-free operation.',
      ],
    },
    {
      heading: 'Limitation of liability',
      paragraphs: [
        'To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of Mizora.',
      ],
    },
    {
      heading: 'Changes and termination',
      paragraphs: [
        'We may update these Terms or discontinue features. Continued use after changes means you accept the updated Terms.',
        'You may stop using Mizora at any time by uninstalling the app.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [`Legal or Terms questions: ${SITE.supportEmail}`],
    },
  ]),
};
