import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { MizoraIonIcon } from '@/components/icons/MizoraIonIcon';
import {
  MockLiveBadgeMd,
  RING_PATH_LENGTH,
  RING_TRACK_PATH,
} from '@/components/mockups/MockStepsDetailParts';

const WATER_FILL = '#0a84ff';
const WATER_TRACK = '#e5ece2';

function formatLitersFromMl(ml: number): string {
  const liters = ml / 1000;
  const roundedTenth = Math.round(liters * 10) / 10;
  return Number.isInteger(roundedTenth) ? String(roundedTenth) : roundedTenth.toFixed(1);
}

export function MockWaterArcRing({
  currentMl,
  goalMl,
  width = 168,
}: {
  currentMl: number;
  goalMl: number;
  width?: number;
}) {
  const progress = Math.min(currentMl / Math.max(goalMl, 1), 1);
  const dashOffset = RING_PATH_LENGTH * (1 - progress);
  const scale = width / 140;
  const svgH = 114 * scale;
  const goalLabel = `${formatLitersFromMl(goalMl)} L`;

  return (
    <div className="relative mx-auto" style={{ width, height: svgH + 2 }}>
      <svg viewBox="0 0 140 114" width={width} height={svgH} aria-hidden>
        <path
          d={RING_TRACK_PATH}
          stroke={WATER_TRACK}
          strokeWidth={7}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={RING_TRACK_PATH}
          stroke={WATER_FILL}
          strokeWidth={7}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${RING_PATH_LENGTH} ${RING_PATH_LENGTH}`}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div
        className="pointer-events-none absolute inset-x-0 flex flex-col items-center px-1.5 text-center"
        style={{ top: `${40 * scale}px` }}
      >
        <span
          className="font-bold text-[#0a84ff] tabular-nums"
          style={{ fontSize: `${26 * scale}px`, lineHeight: 1.05 }}
        >
          {formatLitersFromMl(currentMl)} L
        </span>
        <span
          className="font-medium text-[#626b5e]"
          style={{ fontSize: `${11 * scale}px`, marginTop: 2 }}
        >
          logged today
        </span>
        <span className="text-[#8e8e93]" style={{ fontSize: `${10 * scale}px`, marginTop: 2 }}>
          of {goalLabel} daily goal
        </span>
      </div>
    </div>
  );
}

export function MockWaterDetailHeroCard({
  currentMl,
  goalMl,
}: {
  currentMl: number;
  goalMl: number;
}) {
  const remaining = Math.max(goalMl - currentMl, 0);
  const remainingL = formatLitersFromMl(remaining);
  const goalL = formatLitersFromMl(goalMl);
  const progressPct = Math.min(100, Math.round((currentMl / Math.max(goalMl, 1)) * 100));

  return (
    <div className="overflow-hidden rounded-[15px] bg-white shadow-[0_1px_2px_rgba(20,28,18,0.05)]">
      <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-1">
        <div className="flex min-w-0 items-center gap-2">
          <MetricBadgeIcon kind="water" size={34} />
          <div className="min-w-0">
            <p className="text-[14px] leading-tight font-medium text-[#141c12]">
              Today&apos;s hydration
            </p>
            <p className="mt-0.5 text-[10px] leading-snug text-[#8e8e93]">
              {remaining > 0
                ? `${remainingL} L left · ${progressPct}% of ${goalL} L`
                : `Daily target reached · ${goalL} L`}
            </p>
          </div>
        </div>
        <MockLiveBadgeMd />
      </div>
      <div className="px-4 py-3">
        <MockWaterArcRing currentMl={currentMl} goalMl={goalMl} />
      </div>
      <div className="mx-4 mb-5 flex flex-row items-center border-t border-[#f2f3f0] pt-4">
        {[
          { label: 'Logged', value: `${currentMl.toLocaleString()} ml` },
          { label: 'Remaining', value: `${remaining.toLocaleString()} ml` },
          { label: 'Target', value: `${goalL} L` },
        ].map((cell, i) => (
          <div key={cell.label} className="flex flex-1 flex-row items-center">
            {i > 0 ? <div className="mr-2 h-7 w-px bg-[#e5ece2]" /> : null}
            <div className="flex-1 text-center">
              <p className="text-[9px] font-medium text-[#8e8e93]">{cell.label}</p>
              <p className="mt-0.5 text-[15px] leading-tight font-bold tracking-[-0.02em] tabular-nums">
                {cell.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LogStepperRow({ label, amountMl }: { label: string; amountMl: number }) {
  return (
    <div className="flex flex-row items-center justify-between gap-3">
      <span className="text-[13px] font-medium text-[#626b5e]">{label}</span>
      <div className="flex flex-row items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ededed] bg-white">
          <MizoraIonIcon name="remove" size={18} color={WATER_FILL} />
        </div>
        <span className="min-w-[72px] text-center text-[16px] font-medium text-[#141c12] tabular-nums">
          {amountMl} ml
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ededed] bg-white">
          <MizoraIonIcon name="add" size={18} color={WATER_FILL} />
        </div>
      </div>
    </div>
  );
}

export function MockWaterQuickLogCard({ remainingMl }: { remainingMl: number }) {
  const remainingL = formatLitersFromMl(remainingMl);
  const remainingLine = remainingMl > 0 ? `${remainingL} L left today. ` : 'Target reached. ';

  return (
    <div className="space-y-3 rounded-[15px] bg-white p-4 shadow-[0_1px_2px_rgba(20,28,18,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-medium text-[#626b5e]">Log intake</span>
        {remainingMl > 0 ? (
          <span className="text-[16px] font-medium text-[#141c12] tabular-nums">
            {remainingL} L left
          </span>
        ) : (
          <span className="text-[13px] font-medium text-[#0a84ff]">Target reached</span>
        )}
      </div>
      <div className="space-y-3">
        <LogStepperRow label="Glass" amountMl={250} />
        <LogStepperRow label="Bottle" amountMl={500} />
        <LogStepperRow label="Large" amountMl={750} />
      </div>
      <p className="text-[11px] leading-snug text-[#8e8e93]">
        {remainingLine}+ logs · − removes · counts toward unlocks on home.
      </p>
    </div>
  );
}
