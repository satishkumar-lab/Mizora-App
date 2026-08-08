import type { ComponentType } from 'react';

import { HomeScreenMockup } from '@/components/mockups/HomeScreenMockup';
import { StepsScreenMockup } from '@/components/mockups/StepsScreenMockup';
import { StreakScreenMockup } from '@/components/mockups/StreakScreenMockup';
import { WaterScreenMockup } from '@/components/mockups/WaterScreenMockup';
import { WeeklyReportMockup } from '@/components/mockups/WeeklyReportMockup';

export type ScreenKey = 'home' | 'steps' | 'water' | 'weekly-report' | 'streak';

export type ProductScreenMode = 'mockup' | 'screenshot';

export type ProductScreenDefinition = {
  key: ScreenKey;
  /** Flip to `screenshot` when a final App Store image is dropped into public/screenshots. */
  mode: ProductScreenMode;
  screenshotSrc?: string;
  Mockup?: ComponentType;
  alt: string;
};

/**
 * Single registry for every phone on the site.
 * Sections only reference a ScreenKey — never hardcode images or mockups.
 */
export const PRODUCT_SCREENS: Record<ScreenKey, ProductScreenDefinition> = {
  home: {
    key: 'home',
    mode: 'mockup',
    screenshotSrc: '/screenshots/home.png',
    Mockup: HomeScreenMockup,
    alt: 'Mizora home screen showing today’s steps, water, and streak overview',
  },
  steps: {
    key: 'steps',
    mode: 'mockup',
    screenshotSrc: '/screenshots/steps.png',
    Mockup: StepsScreenMockup,
    alt: 'Mizora steps screen with daily step goal and hourly activity',
  },
  water: {
    key: 'water',
    mode: 'mockup',
    screenshotSrc: '/screenshots/water.png',
    Mockup: WaterScreenMockup,
    alt: 'Mizora water tracker with daily hydration progress',
  },
  'weekly-report': {
    key: 'weekly-report',
    mode: 'mockup',
    screenshotSrc: '/screenshots/weekly-report.png',
    Mockup: WeeklyReportMockup,
    alt: 'Mizora weekly health report with steps, water, and insights',
  },
  streak: {
    key: 'streak',
    mode: 'mockup',
    screenshotSrc: '/screenshots/streak.png',
    Mockup: StreakScreenMockup,
    alt: 'Mizora streak calendar celebrating daily consistency',
  },
};

export function getProductScreen(key: ScreenKey): ProductScreenDefinition {
  return PRODUCT_SCREENS[key];
}
