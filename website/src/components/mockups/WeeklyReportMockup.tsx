import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import {
  MOCK_SELECTED_DAY,
  MOCK_WEEK_DAYS,
  MockCalendarDayPill,
  MockWeekStepsChart,
} from '@/components/mockups/WeekStepsChartMock';
import { MockScreenHeader } from '@/components/mockups/MockScreenHeader';

/**
 * Marketing recreation of `WeeklyHealthReportScreen` (light mode, V1 scope).
 */
export function WeeklyReportMockup() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#fafafa] px-4 pt-10 pb-4 text-[#141c12]">
      <MockScreenHeader title="Weekly report" badgeKind="steps" />

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        {/* WeeklyTotalsHero */}
        <div className="overflow-hidden rounded-[15px] bg-white shadow-[0_1px_2px_rgba(20,28,18,0.05)]">
          <div className="flex items-center gap-2 border-b border-[#f2f3f0] bg-[#fafbf4] px-3 py-2.5">
            <MetricBadgeIcon kind="steps" size={32} />
            <span className="text-[11px] font-bold tracking-[-0.01em]">This week · Mon – Sun</span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-[#f2f3f0] px-1 py-3">
            {[
              { label: 'Steps', value: '48,920' },
              { label: 'Est. active kcal', value: '1,842' },
              { label: 'Water', value: '2.4 L' },
            ].map((col) => (
              <div key={col.label} className="flex flex-col items-center gap-1 px-1 text-center">
                <span className="text-[16px] font-bold tracking-[-0.02em] tabular-nums">
                  {col.value}
                </span>
                <span className="text-[9px] font-medium text-[#8e8e93]">{col.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PeakWalkInsightCard */}
        <div className="rounded-[15px] bg-white p-3 shadow-[0_1px_2px_rgba(20,28,18,0.05)]">
          <div className="flex items-start gap-2.5">
            <MetricBadgeIcon kind="steps" size={40} />
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-[12px] font-bold tracking-[-0.01em]">Peak walk time</p>
              <p className="text-[10px] leading-[1.45] text-[#626b5e]">
                You tend to walk most between 6 and 7 PM — a steady window to protect on busy days.
              </p>
              <p className="text-[9px] font-medium text-[#8e8e93]">
                Busiest day · Wed · 9,840 steps
              </p>
              <span className="inline-flex rounded-full bg-[#eef9dc] px-2 py-0.5 text-[10px] font-bold text-[#34c759]">
                6–7 PM
              </span>
            </div>
          </div>
        </div>

        {/* Steps — WeekStepsSelector */}
        <div className="min-h-0 flex-1 space-y-1.5 overflow-hidden">
          <p className="text-[13px] font-medium tracking-[-0.01em]">Steps</p>
          <div className="flex h-full min-h-0 flex-col gap-2.5 rounded-[15px] bg-white p-3 shadow-[0_1px_2px_rgba(20,28,18,0.05)]">
            <div>
              <p className="text-[11px] font-medium text-[#141c12]">Daily steps</p>
              <p className="text-[9px] text-[#8e8e93]">Slide the chart to compare each day.</p>
            </div>

            <div className="flex gap-0.5">
              {MOCK_WEEK_DAYS.map((day) => (
                <MockCalendarDayPill key={`${day.weekday}-${day.day}`} day={day} />
              ))}
            </div>

            <div className="flex items-end justify-between px-0.5">
              <div>
                <p className="text-[18px] leading-none font-bold tracking-[-0.03em] tabular-nums">
                  {MOCK_SELECTED_DAY.steps.toLocaleString()}
                </p>
                <p className="mt-0.5 text-[10px] font-medium text-[#626b5e]">
                  steps · {MOCK_SELECTED_DAY.weekday}
                </p>
              </div>
              <p className="max-w-[88px] text-right text-[9px] leading-snug text-[#8e8e93]">
                Slide chart to compare days
              </p>
            </div>

            <div className="min-h-[88px] w-full shrink-0">
              <MockWeekStepsChart selectedIndex={3} width={268} height={88} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
