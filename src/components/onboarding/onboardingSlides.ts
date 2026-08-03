import type { OnboardingVisualId } from '@/components/onboarding/OnboardingSlideVisual';

export type OnboardingSlideConfig = {
  id: OnboardingVisualId;
  eyebrow: string;
  title: string;
  titleAccent?: string;
  body: string;
  backdrop: 'lime' | 'mint' | 'neutral' | 'glow';
};

export const ONBOARDING_SLIDES: OnboardingSlideConfig[] = [
  {
    id: 'welcome',
    eyebrow: 'Habits that stick',
    title: 'Less doomscroll.',
    titleAccent: 'More momentum.',
    body: 'Mizora turns the apps you pause into steps, water, and streaks you actually feel.',
    backdrop: 'lime',
  },
  {
    id: 'lock',
    eyebrow: 'App Lock',
    title: 'Pause distractions.',
    titleAccent: 'Unlock with effort.',
    body: 'Pick the apps that eat your time. Finish a small challenge — then enjoy guilt-free access.',
    backdrop: 'mint',
  },
  {
    id: 'track',
    eyebrow: 'Your dashboard',
    title: 'Progress you can',
    titleAccent: 'see in seconds.',
    body: 'Steps, water, streaks, and what’s unlocked — one calm home screen, no analytics overload.',
    backdrop: 'neutral',
  },
  {
    id: 'profile',
    eyebrow: 'Final step',
    title: 'Make it',
    titleAccent: 'yours.',
    body: 'Add a name for a personal touch. No account, no permissions — jump straight in.',
    backdrop: 'glow',
  },
];
