import { useEffect, useState } from 'react';

import type { HourlyStepSlot } from '@/constants/hourlySteps';
import type { StepsWeekDay } from '@/constants/stepsToday';
import {
  resolveWeeklyPeakWalkInsight,
  type WeeklyPeakWalkInsight,
} from '@/lib/health/weeklyPeakWalk';

const INITIAL: WeeklyPeakWalkInsight = {
  peakWalkWindow: null,
  peakWalkNotification: '',
  status: 'loading',
};

export function useWeeklyPeakWalk(options: {
  week: readonly StepsWeekDay[];
  hourlySlots: readonly HourlyStepSlot[];
  metricsLive: boolean;
}): WeeklyPeakWalkInsight {
  const [peak, setPeak] = useState<WeeklyPeakWalkInsight>(INITIAL);

  useEffect(() => {
    let cancelled = false;

    void resolveWeeklyPeakWalkInsight({
      week: options.week,
      hourlySlots: options.hourlySlots,
      metricsLive: options.metricsLive,
    }).then((result) => {
      if (!cancelled) {
        setPeak(result);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [options.week, options.hourlySlots, options.metricsLive]);

  return peak;
}
