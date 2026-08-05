import type { AppBrandId } from '@/components/icons/AppBrandIcon';
import { buildRollingWeekDays } from '@/lib/localDate';
import { DEFAULT_DAILY_STEP_GOAL } from '@/lib/steps-preferences';

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

function buildEmptyUnlockImpactWeek(): UnlockImpactWeekDay[] {
  return buildRollingWeekDays().map((row) => ({
    weekday: row.weekday,
    day: row.day,
    unlockSteps: 0,
    isToday: row.isToday,
    stepsByApp: UNLOCK_IMPACT_APP_ORDER.map((appId) => ({ appId, steps: 0 })),
  }));
}

export const MOCK_UNLOCK_IMPACT_WEEK: UnlockImpactWeekDay[] = buildEmptyUnlockImpactWeek();

export const MOCK_UNLOCK_WEEK_STEP_GOAL = DEFAULT_DAILY_STEP_GOAL * 7;
export const MOCK_WEEK_SCREEN_TIME_GOAL_MIN = 0;
export const MOCK_VS_LAST_WEEK_PCT = 0;
