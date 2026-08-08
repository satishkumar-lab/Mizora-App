import { BackChevronIcon } from '@/components/icons/BackChevronIcon';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import type { MetricBadgeKind } from '@/components/icons/tokens';

type MockScreenHeaderProps = {
  title: string;
  badgeKind?: MetricBadgeKind;
  rightSlot?: React.ReactNode;
};

export function MockScreenHeader({ title, badgeKind, rightSlot }: MockScreenHeaderProps) {
  return (
    <div className="relative mb-3 flex min-h-9 flex-row items-center py-1">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ededed] bg-white shadow-[0_1px_0_rgba(20,28,18,0.04)]">
        <BackChevronIcon size={18} color="#626b5e" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 flex flex-col items-center px-10">
        <span className="text-[13px] font-medium tracking-[-0.01em] text-[#141c12]">{title}</span>
      </div>
      <div className="ml-auto">
        {rightSlot ??
          (badgeKind ? (
            <MetricBadgeIcon kind={badgeKind} size={36} />
          ) : (
            <div className="h-9 w-9" />
          ))}
      </div>
    </div>
  );
}
