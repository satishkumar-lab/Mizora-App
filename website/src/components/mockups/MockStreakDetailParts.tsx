import { CheckmarkIcon } from '@/components/icons/CheckmarkIcon';
import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';
import { MizoraIonIcon } from '@/components/icons/MizoraIonIcon';
import type { MetricBadgeKind } from '@/components/icons/tokens';

type WeekDotState = 'complete' | 'today-open' | 'future' | 'missed';

const WEEK_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;
const WEEK_DOTS: WeekDotState[] = [
  'complete',
  'complete',
  'complete',
  'today-open',
  'future',
  'future',
  'future',
];

const STREAK_DAYS = 4;
const TODAY_STEPS = 6842;
const STEP_GOAL = 10000;

function MockStepsLiveBadgeXs() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#eaffe3] px-1.5 py-0.5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34c759] opacity-40" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#34c759]" />
      </span>
      <span className="text-[7px] font-bold tracking-[0.06em] text-[#1b7a34] uppercase">Live</span>
    </span>
  );
}

function WeekDayDot({
  label,
  state,
  letter,
}: {
  label: string;
  state: WeekDotState;
  letter: string;
}) {
  const isComplete = state === 'complete';
  const isToday = state === 'today-open';
  const isFuture = state === 'future';

  return (
    <div className="flex flex-1 flex-col items-center gap-1.5">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full"
        style={{
          backgroundColor: isComplete ? '#ddfb43' : isToday ? '#ffffff' : 'transparent',
          borderWidth: isToday ? 2 : isFuture ? 1 : 0,
          borderColor: isToday ? '#ddfb43' : '#e5ece2',
        }}
      >
        {isComplete ? (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90">
            <CheckmarkIcon size={22} color="#34c759" />
          </div>
        ) : (
          <span className="text-[14px] font-medium text-[#626b5e]">{letter}</span>
        )}
      </div>
      <span className="text-[11px] font-medium text-[#8e8e93]">{label}</span>
    </div>
  );
}

export function MockStreakHeroMainCard() {
  const progress = Math.min(TODAY_STEPS / STEP_GOAL, 1);

  return (
    <div className="overflow-hidden rounded-[15px] bg-white shadow-[0_1px_2px_rgba(20,28,18,0.05)]">
      <div className="bg-gradient-to-b from-[#f5ffbb] via-[#ddfb43] to-[#d8f836] px-4 pt-4 pb-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(20,28,18,0.08)] px-2.5 py-1 text-[10px] font-medium tracking-[0.1em] text-[#141c12]">
            <MizoraIonIcon name="flame" size={12} color="#5c6d05" />
            STEP STREAK
          </span>
          <MockStepsLiveBadgeXs />
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0 flex-1 pr-4">
            <p className="text-[24px] leading-tight font-bold tracking-[-0.04em]">Streak rolling</p>
            <p className="mt-1.5 max-w-[220px] text-[13px] leading-snug text-[#3d4a12]">
              Today counts — keep the chain going tomorrow.
            </p>
          </div>
          <div className="text-right">
            <p className="text-[52px] leading-none font-bold tracking-[-0.04em] tabular-nums">
              {String(STREAK_DAYS).padStart(2, '0')}
            </p>
            <p className="mt-0.5 text-[12px] font-medium text-[#5c6d05]">days</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-[11px] font-medium text-[#5c6d05]">
            <span>Today&apos;s streak goal</span>
            <span className="text-[#141c12] tabular-nums">
              {TODAY_STEPS.toLocaleString()} / {STEP_GOAL.toLocaleString()}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/45">
            <div
              className="h-full rounded-full bg-white"
              style={{ width: `${Math.max(progress * 100, 4)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 border-t border-[#f2f3f0] bg-white px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f8ffd2]">
          <MizoraIonIcon name="footsteps" size={16} color="#5c6d05" />
        </div>
        <p className="min-w-0 flex-1 text-[12px] leading-snug text-[#626b5e]">
          Goal hit — this day counts toward your streak.
        </p>
      </div>
    </div>
  );
}

export function MockStreakWeekProgressCard() {
  return (
    <div className="rounded-[15px] bg-white p-4 shadow-[0_1px_2px_rgba(20,28,18,0.05)]">
      <p className="text-[16px] font-medium text-[#141c12]">Streak</p>
      <p className="mt-1 text-[13px] text-[#626b5e]">
        You&apos;re on a {STREAK_DAYS}-day streak! 🔥
      </p>
      <div className="my-3 h-px bg-[#f2f3f0]" />
      <div className="flex justify-between px-0.5 pt-1">
        {WEEK_DOTS.map((state, i) => (
          <WeekDayDot
            key={`${WEEK_LABELS[i]}-${i}`}
            label={WEEK_LABELS[i]}
            state={state}
            letter={WEEK_LABELS[i]}
          />
        ))}
      </div>
    </div>
  );
}

const MOCK_RECORDS: { metric: MetricBadgeKind; label: string; value: string }[] = [
  { metric: 'steps', label: 'Most steps in a day', value: '14,280 steps' },
  { metric: 'activeTime', label: 'Longest active time', value: '2h 14m' },
];

export function MockStreakPersonalRecordsCard() {
  const rows = MOCK_RECORDS;

  return (
    <div className="overflow-hidden rounded-[15px] bg-white shadow-[0_1px_2px_rgba(20,28,18,0.05)]">
      <div className="border-b border-[#f2f3f0] px-4 pt-4 pb-3">
        <p className="text-[16px] font-medium text-[#141c12]">Personal Records</p>
        <p className="mt-1 text-[12px] leading-snug text-[#8e8e93]">
          Your all-time bests from Mizora
        </p>
      </div>
      <div className="px-4 pt-1 pb-2">
        {rows.map((row, index) => (
          <div
            key={row.label}
            className={`flex items-center justify-between gap-2 py-3.5 ${index > 0 ? 'border-t border-[#f2f3f0]' : ''}`}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <MetricBadgeIcon kind={row.metric} size={40} />
              <span className="text-[14px] leading-snug text-[#626b5e]">{row.label}</span>
            </div>
            <span className="shrink-0 text-[15px] font-medium text-[#141c12] tabular-nums">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
