import { MockScreenHeader } from '@/components/mockups/MockScreenHeader';
import {
  MockWaterDetailHeroCard,
  MockWaterQuickLogCard,
} from '@/components/mockups/MockWaterDetailParts';

const CURRENT_ML = 1250;
const GOAL_ML = 2000;

/** Marketing recreation of `WaterDetailScreen` hero + quick log (light mode). */
export function WaterScreenMockup() {
  const remaining = GOAL_ML - CURRENT_ML;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#fafafa] px-3.5 pt-10 pb-3 text-[#141c12]">
      <MockScreenHeader title="Water Tracker" badgeKind="water" />

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        <MockWaterDetailHeroCard currentMl={CURRENT_ML} goalMl={GOAL_ML} />
        <MockWaterQuickLogCard remainingMl={remaining} />
      </div>
    </div>
  );
}
