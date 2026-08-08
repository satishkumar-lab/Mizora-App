import { CalendarOutlineIcon } from '@/components/icons/CalendarOutlineIcon';
import { FlameOutlineIcon } from '@/components/icons/FlameOutlineIcon';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { MizoraPlusCrown } from '@/components/icons/MizoraPlusCrown';
import { StepsCardMenuIcon } from '@/components/icons/StepsCardMenuIcon';
import { SunOutlineIcon } from '@/components/icons/SunOutlineIcon';
import { MockupMainNav } from '@/components/mockups/MockupMainNav';

const RING_PATH =
  'M18.5214 110.5C9.13313 99.2031 3.5 84.7596 3.5 69.0198C3.5 32.8342 33.2731 3.5 70 3.5C106.727 3.5 136.5 32.8342 136.5 69.0198C136.5 84.7596 130.867 99.2031 121.479 110.5';
const RING_LENGTH = 297;
const STEPS = 6842;
const GOAL = 10000;
const PROGRESS = STEPS / GOAL;

const HOURLY = [
  0, 0, 0, 0, 0, 12, 28, 45, 62, 58, 71, 55, 48, 52, 44, 38, 66, 72, 41, 22, 14, 8, 0, 0,
];

const WEEK = [
  { d: 'M', day: 10, done: true },
  { d: 'T', day: 11, done: true },
  { d: 'W', day: 12, done: true },
  { d: 'T', day: 13, done: true, today: true },
  { d: 'F', day: 14, done: false },
  { d: 'S', day: 15, done: false },
  { d: 'S', day: 16, done: false },
] as const;

/**
 * Marketing recreation of Mizora Home (light mode).
 */
export function HomeScreenMockup() {
  const dashOffset = RING_LENGTH * (1 - PROGRESS);

  return (
    <div className="flex h-full w-full flex-col bg-[#fafafa] px-5 pt-11 pb-2 text-[#141c12]">
      {/* HomeHeader */}
      <div className="mb-5 flex items-center justify-between">
        <div className="relative h-11 w-11 overflow-hidden rounded-full bg-gradient-to-br from-[#d7ffc7] via-[#a8e06a] to-[#34c759] p-[2px]">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#e8f5e0] text-[11px] font-bold text-[#5c6d05]">
            SK
          </div>
          <div className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-[#fafafa] bg-[#34c759]" />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 rounded-[10px] bg-[#f5ffbb] px-3 py-2">
            <MizoraPlusCrown size={14} color="#5c6d05" />
            <span className="text-[10px] font-bold tracking-[-0.01em] text-[#5c6d05]">Mizora+</span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ededed] bg-white">
            <SunOutlineIcon size={18} color="#626b5e" />
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-bold tracking-[-0.02em]">Health Overview</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#d7ffc7]/90 px-2 py-0.5 text-[9px] font-bold tracking-[0.04em] text-[#1b7a34] uppercase">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#34c759]" />
            Live
          </span>
        </div>

        <div className="rounded-[15px] bg-white p-4 shadow-[0_1px_2px_rgba(20,28,18,0.05)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MetricBadgeIcon kind="steps" size={20} />
              <span className="text-[13px] font-bold tracking-[-0.02em]">Today&apos;s Steps</span>
            </div>
            <StepsCardMenuIcon size={16} color="#141c12" />
          </div>

          <div className="relative mx-auto w-[168px]">
            <svg viewBox="0 0 140 114" className="h-auto w-full" aria-hidden>
              <path
                d={RING_PATH}
                stroke="#e5ece2"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d={RING_PATH}
                stroke="#DDFB43"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${RING_LENGTH} ${RING_LENGTH}`}
                strokeDashoffset={dashOffset}
              />
            </svg>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center pt-[32%]">
              <span className="text-[26px] leading-none font-bold tracking-[-0.04em] tabular-nums">
                {STEPS.toLocaleString()}
              </span>
              <span className="mt-1 text-[10px] font-medium text-[#626b5e]">
                of {GOAL.toLocaleString()}
              </span>
              <span className="mt-1 rounded-full bg-[#f5ffbb] px-2 py-0.5 text-[9px] font-bold text-[#5c6d05]">
                {Math.round(PROGRESS * 100)}%
              </span>
            </div>
          </div>

          <div className="mt-3 flex h-10 items-end justify-between gap-[1px] px-0.5">
            {HOURLY.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-[2px] bg-[#ddfb43]"
                style={{
                  height: `${Math.max(h, 4)}%`,
                  opacity: h > 0 ? 0.65 + (i % 4) * 0.08 : 0.15,
                }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-[15px] bg-white p-4 shadow-[0_1px_2px_rgba(20,28,18,0.05)]">
            <div className="mb-4 flex items-start justify-between">
              <div className="text-[12px] leading-tight font-bold tracking-[-0.02em]">
                Active
                <br />
                Calories
              </div>
              <MetricBadgeIcon kind="calories" size={36} />
            </div>
            <div>
              <span className="text-[20px] font-bold tracking-[-0.03em] tabular-nums">248</span>
              <span className="text-[11px] font-medium text-[#626b5e]"> kcal</span>
            </div>
          </div>
          <div className="rounded-[15px] bg-white p-4 shadow-[0_1px_2px_rgba(20,28,18,0.05)]">
            <div className="mb-4 flex items-start justify-between">
              <div className="text-[12px] leading-tight font-bold tracking-[-0.02em]">
                Water
                <br />
                Intake
              </div>
              <MetricBadgeIcon kind="water" size={36} />
            </div>
            <div>
              <span className="text-[20px] font-bold tracking-[-0.03em] tabular-nums">5</span>
              <span className="text-[11px] font-medium text-[#626b5e]"> glasses</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 rounded-[15px] border border-[#e0f0ff] bg-white px-4 py-3.5">
          {[
            { value: '4.8', unit: 'km', label: 'Distance' },
            { value: '52', unit: 'min', label: 'Active Time' },
            { value: '6–7p', unit: '', label: 'Peak Hour' },
          ].map((item, index) => (
            <div key={item.label} className="flex flex-1 flex-row items-center">
              {index > 0 ? <div className="mr-3 h-9 w-px bg-[#ededed]" /> : null}
              <div className="flex flex-1 flex-col items-center">
                <div className="text-[13px] font-bold tracking-[-0.02em] tabular-nums">
                  {item.value}
                  {item.unit ? (
                    <span className="text-[10px] font-medium text-[#626b5e]"> {item.unit}</span>
                  ) : null}
                </div>
                <div className="text-[9px] font-medium text-[#626b5e]">{item.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[20px] bg-white p-4 shadow-[0_1px_2px_rgba(20,28,18,0.05)]">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-[32px] leading-none font-medium tracking-[-0.04em] tabular-nums">
              04
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium tracking-[0.08em] text-[#8e8e93] uppercase">
                Step streak
              </p>
              <p className="flex items-center gap-1 text-[14px] font-bold tracking-[-0.02em]">
                Days in a row
                <FlameOutlineIcon size={14} color="#5c6d05" />
              </p>
              <p className="text-[11px] leading-snug text-[#626b5e]">
                Goal met today — streak safe
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ededed] bg-[#fafafa]">
              <CalendarOutlineIcon size={18} color="#626b5e" />
            </div>
          </div>
          <p className="mb-2 text-[11px] font-medium text-[#626b5e]">This week</p>
          <div className="flex gap-1">
            {WEEK.map((cell, i) => (
              <div key={`${cell.d}-${i}`} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[9px] font-medium text-[#626b5e]">{cell.d}</span>
                <div
                  className={`flex h-8 w-full max-w-[34px] items-center justify-center rounded-full text-[10px] font-bold tabular-nums ${
                    cell.done ? 'bg-[#ddfb43] text-[#1e2c00]' : 'bg-[#f4f6f3] text-[#8e8e93]'
                  } ${'today' in cell && cell.today ? 'ring-2 ring-[#c1fd3a] ring-offset-1' : ''}`}
                >
                  {cell.day}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MockupMainNav activeIndex={0} />
    </div>
  );
}
