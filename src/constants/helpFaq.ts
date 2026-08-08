import { HELP_FAQ_ANDROID_HEALTH_CONNECT } from '@/constants/androidHealthConnectGuidance';

export const HELP_FAQ = [
  HELP_FAQ_ANDROID_HEALTH_CONNECT,
  {
    q: 'Steps not updating?',
    a: 'On iPhone, allow Motion & Fitness for Mizora. On Android, allow step access when Mizora asks, and make sure your fitness apps sync steps into Health Connect. Open Steps and tap Try again—or use Profile → Help if you dismissed setup.',
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
] as const;
