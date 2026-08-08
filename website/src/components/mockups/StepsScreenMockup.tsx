import {
  MockStepsDetailHeroCard,
  MockStepsHourlyLineChart,
} from '@/components/mockups/MockStepsDetailParts';
import { MockScreenHeader } from '@/components/mockups/MockScreenHeader';

const STEPS = 6842;
const GOAL = 10000;

function StatTile({ value, unit, label }: { value: string; unit: string; label: string }) {
  return (
    <div className="flex flex-1 flex-col items-center px-1 text-center">
      <p className="text-[13px] font-bold tracking-[-0.02em] text-[#141c12] tabular-nums">
        {value}
        {unit ? <span className="text-[10px] font-medium text-[#626b5e]"> {unit}</span> : null}
      </p>
      <p className="mt-0.5 text-[9px] font-medium text-[#626b5e]">{label}</p>
    </div>
  );
}

/** Marketing recreation of `StepsDetailScreen` (light mode). */
export function StepsScreenMockup() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#fafafa] px-3.5 pt-10 pb-3 text-[#141c12]">
      <MockScreenHeader title="Today's Steps" badgeKind="steps" />

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-hidden">
        <MockStepsDetailHeroCard steps={STEPS} goal={GOAL} />

        <div>
          <p className="mb-1.5 text-[12px] font-medium text-[#141c12]">Today&apos;s activity</p>
          <div className="flex flex-row items-center rounded-[15px] bg-white py-4 shadow-[0_1px_2px_rgba(20,28,18,0.05)]">
            <StatTile value="4.8" unit="km" label="Distance" />
            <div className="h-10 w-px bg-[#ededed]" />
            <StatTile value="52" unit="min" label="Active time" />
            <div className="h-10 w-px bg-[#ededed]" />
            <StatTile value="+840" unit="" label="vs yesterday" />
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <p className="mb-1.5 text-[12px] font-medium text-[#141c12]">Trends</p>
          <div className="rounded-[15px] bg-white px-3 py-3 shadow-[0_1px_2px_rgba(20,28,18,0.05)]">
            <MockStepsHourlyLineChart activeIndex={17} width={262} />
          </div>
        </div>
      </div>
    </div>
  );
}
