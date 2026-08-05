export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalDocument = {
  id: 'privacy' | 'terms';
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

export const PRIVACY_POLICY: LegalDocument = {
  id: 'privacy',
  title: 'Privacy Policy',
  lastUpdated: 'August 4, 2026',
  intro:
    'Mizora (“we”, “our”, “us”) respects your privacy. This policy explains what we collect, why we collect it, and the choices you have when you use the Mizora mobile app.',
  sections: [
    {
      heading: 'Information we collect',
      paragraphs: [
        'Health and activity data you choose to connect (such as step counts) to power goals, charts, and unlock rules.',
        'App preferences you set in Mizora: daily goals, blocked apps, lock rules, notification settings, and streak progress — stored primarily on your device.',
        'Optional profile details you enter (such as display name, avatar preset, weight, or activity level) to personalize water and fitness targets.',
        'Basic diagnostic data if you contact support (device model, app version) so we can help you faster.',
      ],
    },
    {
      heading: 'How we use information',
      paragraphs: [
        'To run core features: habit tracking, app lock, unlock timers, reminders, and your dashboard.',
        'To improve reliability and fix bugs — not to sell personal data or show third-party ads.',
        'We do not use your health data for advertising profiles.',
      ],
    },
    {
      heading: 'Permissions',
      paragraphs: [
        'Motion / Health, notifications, and app-usage access are requested only when a feature needs them. You can change or revoke permissions in your phone settings at any time.',
        'If you deny a permission, related features may be limited but the rest of Mizora can still work where possible.',
      ],
    },
    {
      heading: 'Storage and retention',
      paragraphs: [
        'Most Mizora data stays on your device. If you use Delete data on this device in Profile, locally stored progress and settings tied to that action are removed from the app.',
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
        'Control notifications under Profile → Notifications.',
        'Read Privacy & data in the app for a plain-language summary of what Mizora stores.',
        'Email us at support@mizora.app for access, correction, or deletion questions.',
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
      paragraphs: ['Questions about privacy: support@mizora.app'],
    },
  ],
};

export const TERMS_OF_SERVICE: LegalDocument = {
  id: 'terms',
  title: 'Terms of Service',
  lastUpdated: 'August 4, 2026',
  intro:
    'These Terms govern your use of the Mizora app. By using Mizora, you agree to these Terms. If you do not agree, please do not use the app.',
  sections: [
    {
      heading: 'The service',
      paragraphs: [
        'Mizora helps you build healthy habits by linking optional app lock rules to goals you choose (such as steps or water intake).',
        'Mizora is not medical advice. Always consult a qualified professional for health decisions.',
      ],
    },
    {
      heading: 'Your account and device',
      paragraphs: [
        'You are responsible for your device, lock settings, and any apps you choose to block or unlock.',
        'You must comply with applicable laws and the terms of apps and platforms you use alongside Mizora.',
      ],
    },
    {
      heading: 'App lock and unlock',
      paragraphs: [
        'Lock and unlock behavior depends on your OS, permissions, and device manufacturer. Mizora cannot guarantee that every distracting app will be blocked in all circumstances.',
        'Do not use Mizora in situations where missing a notification or call could cause harm (for example, while driving or operating machinery).',
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
      paragraphs: ['Legal or Terms questions: support@mizora.app'],
    },
  ],
};

export const LEGAL_DOCUMENTS = {
  privacy: PRIVACY_POLICY,
  terms: TERMS_OF_SERVICE,
} as const;

export type LegalDocumentId = keyof typeof LEGAL_DOCUMENTS;
