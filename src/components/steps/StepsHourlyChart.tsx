import { StepsHourlyCompactChart } from '@/components/steps/StepsHourlyCompactChart';
import { StepsHourlyGradientCompact } from '@/components/steps/StepsHourlyGradientCompact';
import { StepsHourlyLineChart } from '@/components/steps/StepsHourlyLineChart';
import type { StepsHomeChartStyle } from '@/lib/home-dashboard-preferences';
import type { HourlyChartAxisMode, HourlyStepSlot } from '@/constants/hourlySteps';

type StepsHourlyChartProps = {
  slots?: readonly HourlyStepSlot[];
  /** @deprecated Use `slots` — legacy 9-bucket heights */
  heights?: readonly number[];
  peakIndex?: number;
  variant?: 'compact' | 'detail';
  peakLabel?: string;
  chartStyle?: StepsHomeChartStyle;
  axisMode?: HourlyChartAxisMode;
};

/** Home: hourly bars or gradient. Detail: scrubbable line chart. */
export function StepsHourlyChart({
  slots,
  variant = 'compact',
  chartStyle = 'bars',
  axisMode = 'full',
}: StepsHourlyChartProps) {
  if (variant === 'detail') {
    return <StepsHourlyLineChart slots={slots} />;
  }

  if (chartStyle === 'gradient') {
    return <StepsHourlyGradientCompact slots={slots} axisMode={axisMode} />;
  }

  return <StepsHourlyCompactChart slots={slots} axisMode={axisMode} />;
}
