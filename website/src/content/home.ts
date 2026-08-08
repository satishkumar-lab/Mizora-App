import type { MetricBadgeKind } from '@/components/icons/tokens';

export const heroContent = {
  eyebrow: 'Daily health, simplified',
  headlineLine1: 'A calmer way',
  headlineLine2: 'to get healthier.',
  /** Full sentence for metadata / accessibility fallbacks */
  headline: 'A calmer way to get healthier.',
  subheadline:
    'Mizora turns walking, water, and small daily wins into a habit you can actually keep.',
  primaryCta: 'Download now',
  secondaryLine: 'Available on iPhone & Android',
  highlights: ['Live steps', 'Water tracking', 'Weekly streaks'] as const,
} as const;

export type FeatureIcon = Extract<MetricBadgeKind, 'steps' | 'water' | 'goal'>;

export const featuresSection = {
  id: 'features',
  eyebrow: 'Why Mizora',
  title: 'Health tracking that stays out of your way',
  subtitle:
    'No noisy dashboards or guilt trips — just the metrics that help you show up again tomorrow.',
  items: [
    {
      icon: 'steps' as FeatureIcon,
      title: 'Live steps from your phone',
      description:
        'See today’s steps, hourly rhythm, distance, and active time — synced from Apple Health or Health Connect on Android.',
    },
    {
      icon: 'water' as FeatureIcon,
      title: 'Water you’ll actually log',
      description:
        'Tap glasses through the day, set a daily goal, and watch hydration sit alongside movement on one calm home screen.',
    },
    {
      icon: 'goal' as FeatureIcon,
      title: 'Streaks that celebrate consistency',
      description:
        'A gentle week view and step streak counter reward showing up — not perfection — so momentum feels achievable.',
    },
  ],
} as const;

export const weeklySection = {
  id: 'weekly-report',
  eyebrow: 'Weekly health report',
  title: 'Your whole week, in one glance',
  subtitle:
    'Every Monday, Mizora rolls up steps, estimated active calories, water, and peak walk patterns — so you know what worked before the week gets away from you.',
  bullets: [
    'Mon–Sun totals for steps, active kcal, and water',
    'Peak walk window and best day highlights',
    'Week selectors to compare steps, calories, and hydration',
  ],
  footnote: 'Delivered in-app — no inbox clutter required.',
} as const;

export const stepsSection = {
  id: 'steps',
  eyebrow: 'Daily progress',
  title: 'Steps with context, not just a number',
  subtitle:
    'Drill into today’s ring, hourly rhythm, and weekly trends — the same charts you use in the app, without switching tools.',
  bullets: [
    'Live step count with goal progress and remaining steps',
    'Hourly activity chart for today’s rhythm',
    'Week view to compare each day at a glance',
  ],
  footnote: 'Syncs from Apple Health on iPhone and Health Connect on Android.',
} as const;

export const waterSection = {
  id: 'water',
  eyebrow: 'Water tracker',
  title: 'Hydration that fits your day',
  subtitle:
    'Log glasses in seconds, set a target that matches you, and see water alongside movement on home and in your weekly report.',
  bullets: [
    'Quick-log glasses with a tap — no calorie database',
    'Daily goal in liters with clear remaining progress',
    'Weekly hydration charts in your health report',
  ],
  footnote: 'Water logs stay on your device in Mizora 1.0.',
} as const;

export const streakSection = {
  id: 'streak',
  eyebrow: 'Streak calendar',
  title: 'Momentum you can feel',
  subtitle:
    'A lime-forward streak hero, week pills, and personal bests — built to celebrate showing up, not punishing missed days.',
  bullets: [
    'Step streak counter tied to your daily goal',
    'Week calendar with today and completed days highlighted',
    'Personal records and achievement previews',
  ],
} as const;

export const howItWorksSection = {
  id: 'how-it-works',
  eyebrow: 'How it works',
  title: 'Three minutes to your first calm check-in',
  subtitle:
    'No account required for Mizora 1.0 — install, allow health permissions, and start from home.',
  steps: [
    {
      title: 'Download Mizora',
      description: 'Get the app on iPhone or Android and open the home dashboard.',
    },
    {
      title: 'Connect your steps',
      description: 'Allow Motion or Health Connect so live steps and hourly charts can update.',
    },
    {
      title: 'Log water & keep the streak',
      description: 'Tap glasses through the day and hit your step goal to grow your streak.',
    },
  ],
} as const;

export const faqSection = {
  id: 'faq',
  eyebrow: 'FAQ',
  title: 'Questions, answered',
  subtitle: 'Straight talk about data, permissions, and what Mizora 1.0 includes today.',
  items: [
    {
      q: 'Steps not updating?',
      a: 'Allow Motion (iPhone) or Health Connect (Android) for Mizora in your phone settings, then open the Steps tab and tap Try again. On Android, install or update Health Connect if prompted.',
    },
    {
      q: 'Where is my data stored?',
      a: 'Steps, water, streaks, and goals stay on your device. Optional name and health profile personalize targets — see Profile → Privacy & data in the app.',
    },
    {
      q: 'Are calorie numbers medical advice?',
      a: 'Active calories are estimated from your steps for motivation only. They are not a medical or dietary prescription.',
    },
    {
      q: 'Does Mizora send push notifications?',
      a: 'Mizora 1.0 tracks progress in the app. Push reminders are planned for a later update.',
    },
    {
      q: 'How do I delete my data?',
      a: 'Profile → Privacy & data → Delete data on this device removes profile and preference fields stored by that action.',
    },
  ],
} as const;

export const downloadSection = {
  id: 'download',
  title: 'Ready for a calmer check-in?',
  subtitle: 'Download Mizora and build the habit on your terms — one walk and one glass at a time.',
  cta: 'Download now',
  note: 'Free to start · iPhone & Android',
} as const;

export const footerContent = {
  tagline: 'Walk more. Drink water. Feel the streak.',
  links: [
    { label: 'Features', href: '#features' },
    { label: 'Weekly report', href: '#weekly-report' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Download', href: '#download' },
  ],
} as const;
