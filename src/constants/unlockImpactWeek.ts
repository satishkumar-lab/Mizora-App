import type { AppBrandId } from '@/components/icons/AppBrandIcon';

export type UnlockImpactAppSteps = {
  appId: AppBrandId;
  steps: number;
};

export type UnlockImpactWeekDay = {
  weekday: string;
  day: string;
  unlockSteps: number;
  isToday: boolean;
  stepsByApp: UnlockImpactAppSteps[];
};

export const UNLOCK_IMPACT_APP_ORDER: AppBrandId[] = ['instagram', 'whatsapp', 'snapchat'];

export const UNLOCK_IMPACT_APP_LABEL: Partial<Record<AppBrandId, string>> = {
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  snapchat: 'Snapchat',
};

export const UNLOCK_IMPACT_APP_SEGMENT: Partial<Record<AppBrandId, string>> = {
  instagram: '#34c759',
  whatsapp: '#a3b00d',
  snapchat: '#c7cfc4',
};

export const MOCK_UNLOCK_IMPACT_WEEK: UnlockImpactWeekDay[] = [
  {
    weekday: 'Mon',
    day: '04',
    unlockSteps: 890,
    isToday: false,
    stepsByApp: [
      { appId: 'snapchat', steps: 410 },
      { appId: 'whatsapp', steps: 280 },
      { appId: 'instagram', steps: 200 },
    ],
  },
  {
    weekday: 'Tue',
    day: '05',
    unlockSteps: 2340,
    isToday: false,
    stepsByApp: [
      { appId: 'instagram', steps: 1050 },
      { appId: 'whatsapp', steps: 720 },
      { appId: 'snapchat', steps: 570 },
    ],
  },
  {
    weekday: 'Wed',
    day: '06',
    unlockSteps: 1520,
    isToday: false,
    stepsByApp: [
      { appId: 'whatsapp', steps: 680 },
      { appId: 'snapchat', steps: 520 },
      { appId: 'instagram', steps: 320 },
    ],
  },
  {
    weekday: 'Thu',
    day: '07',
    unlockSteps: 2680,
    isToday: true,
    stepsByApp: [
      { appId: 'snapchat', steps: 1180 },
      { appId: 'instagram', steps: 920 },
      { appId: 'whatsapp', steps: 580 },
    ],
  },
  {
    weekday: 'Fri',
    day: '08',
    unlockSteps: 1180,
    isToday: false,
    stepsByApp: [
      { appId: 'instagram', steps: 540 },
      { appId: 'snapchat', steps: 380 },
      { appId: 'whatsapp', steps: 260 },
    ],
  },
  {
    weekday: 'Sat',
    day: '09',
    unlockSteps: 760,
    isToday: false,
    stepsByApp: [
      { appId: 'whatsapp', steps: 390 },
      { appId: 'instagram', steps: 220 },
      { appId: 'snapchat', steps: 150 },
    ],
  },
  {
    weekday: 'Sun',
    day: '10',
    unlockSteps: 1420,
    isToday: false,
    stepsByApp: [
      { appId: 'instagram', steps: 620 },
      { appId: 'snapchat', steps: 480 },
      { appId: 'whatsapp', steps: 320 },
    ],
  },
];

export const MOCK_UNLOCK_WEEK_STEP_GOAL = 14_000;
export const MOCK_WEEK_SCREEN_TIME_GOAL_MIN = 120;
export const MOCK_VS_LAST_WEEK_PCT = 12;
