import { CalendarOutlineIcon } from '@/components/icons/CalendarOutlineIcon';
import {
  MockStreakHeroMainCard,
  MockStreakPersonalRecordsCard,
  MockStreakWeekProgressCard,
} from '@/components/mockups/MockStreakDetailParts';
import { MockScreenHeader } from '@/components/mockups/MockScreenHeader';

/** Marketing recreation of `StreakCalendarScreen` (light mode). */
export function StreakScreenMockup() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#fafafa] px-3.5 pt-10 pb-3 text-[#141c12]">
      <MockScreenHeader
        title="Streak Calendar"
        rightSlot={
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ededed] bg-white shadow-[0_1px_0_rgba(20,28,18,0.04)]">
            <CalendarOutlineIcon size={18} color="#626b5e" />
          </div>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        <MockStreakHeroMainCard />
        <MockStreakWeekProgressCard />
        <div className="min-h-0 flex-1 overflow-hidden">
          <MockStreakPersonalRecordsCard />
        </div>
      </div>
    </div>
  );
}
