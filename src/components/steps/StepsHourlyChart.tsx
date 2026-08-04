import { StepsHourlyCompactChart } from '@/components/steps/StepsHourlyCompactChart';
import { StepsHourlyGradientCompact } from '@/components/steps/StepsHourlyGradientCompact';
import { StepsHourlyLineChart } from '@/components/steps/StepsHourlyLineChart';
import type { StepsHomeChartStyle } from '@/lib/home-dashboard-preferences';
import type { HourlyChartAxisMode } from '@/constants/hourlySteps';

type StepsHourlyChartProps = {
  /** @deprecated Home uses HOURLY_STEP_SLOTS via compact chart */
  heights?: readonly number[];
  peakIndex?: number;
  variant?: 'compact' | 'detail';
  peakLabel?: string;
  chartStyle?: StepsHomeChartStyle;
  axisMode?: HourlyChartAxisMode;
};

/** Home: hourly bars or gradient. Detail: scrubbable line chart. */
export function StepsHourlyChart({
  variant = 'compact',
  chartStyle = 'bars',
  axisMode = 'full',
}: StepsHourlyChartProps) {
  if (variant === 'detail') {
    return <StepsHourlyLineChart />;
  }

  if (chartStyle === 'gradient') {
    return <StepsHourlyGradientCompact axisMode={axisMode} />;
  }

  return <StepsHourlyCompactChart axisMode={axisMode} />;
}
