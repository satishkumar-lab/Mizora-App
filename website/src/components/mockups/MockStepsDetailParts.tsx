import { MetricBadgeIcon } from '@/components/icons/MetricBadgeIcon';

const CHART_HEIGHT = 88;
const PADDING_X = 8;
const PADDING_Y = 10;

/** Demo hourly steps — morning ramp, afternoon peak ~6 PM. */
const HOUR_LABELS = [
  '12 AM',
  '1 AM',
  '2 AM',
  '3 AM',
  '4 AM',
  '5 AM',
  '6 AM',
  '7 AM',
  '8 AM',
  '9 AM',
  '10 AM',
  '11 AM',
  '12 PM',
  '1 PM',
  '2 PM',
  '3 PM',
  '4 PM',
  '5 PM',
  '6 PM',
  '7 PM',
  '8 PM',
  '9 PM',
  '10 PM',
  '11 PM',
] as const;

export const MOCK_HOURLY_STEPS = [
  0, 0, 0, 0, 0, 0, 120, 280, 410, 520, 480, 390, 620, 710, 580, 640, 890, 1020, 760, 420, 210, 80,
  0, 0,
] as const;

const AXIS_LABELS = ['12 AM', '6 AM', '12 PM', '6 PM', '11 PM'] as const;

type MockStepsHourlyLineChartProps = {
  steps?: readonly number[];
  activeIndex?: number;
  width?: number;
};

function buildHourlyChart(steps: readonly number[], width: number, height: number) {
  const maxSteps = Math.max(...steps, 1);
  const innerW = width - PADDING_X * 2;
  const innerH = height - PADDING_Y * 2;
  const bottomY = PADDING_Y + innerH;

  const points = steps.map((value, i) => {
    const x = PADDING_X + (i / Math.max(steps.length - 1, 1)) * innerW;
    const y = value > 0 ? PADDING_Y + innerH - (value / maxSteps) * innerH : bottomY - 2;
    return { x, y, bottomY, value };
  });

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
  const first = points[0];
  const last = points[points.length - 1];
  let areaPath = `M ${first.x} ${first.bottomY} L ${first.x} ${first.y}`;
  for (let i = 1; i < points.length; i++) {
    areaPath += ` L ${points[i].x} ${points[i].y}`;
  }
  areaPath += ` L ${last.x} ${last.bottomY} Z`;

  return { points, linePoints, areaPath, maxSteps };
}

export function MockStepsHourlyLineChart({
  steps = MOCK_HOURLY_STEPS,
  activeIndex = 17,
  width = 268,
}: MockStepsHourlyLineChartProps) {
  const height = CHART_HEIGHT;
  const { points, linePoints, areaPath } = buildHourlyChart(steps, width, height);
  const active = points[activeIndex] ?? points[0];
  const activeSteps = steps[activeIndex] ?? 0;
  const activeLabel = HOUR_LABELS[activeIndex] ?? '6 PM';

  const gradientId = 'mock-hourly-steps-gradient';

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium text-[#141c12]">Today by hour</p>
          <p className="text-[9px] text-[#8e8e93]">Slide the chart for steps each hour</p>
        </div>
        <div className="text-right">
          <p className="text-[15px] leading-tight font-bold tracking-[-0.02em] tabular-nums">
            {activeSteps.toLocaleString()}
          </p>
          <p className="text-[9px] font-medium text-[#626b5e]">{activeLabel}</p>
        </div>
      </div>

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#DDFB43" stopOpacity={0.45} />
            <stop offset="0.7" stopColor="#DDFB43" stopOpacity={0.06} />
            <stop offset="1" stopColor="#DDFB43" stopOpacity={0} />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((t) => {
          const y = PADDING_Y + (height - PADDING_Y * 2) * t;
          return (
            <line
              key={t}
              x1={PADDING_X}
              y1={y}
              x2={width - PADDING_X}
              y2={y}
              stroke="#e5ece2"
              strokeWidth={1}
            />
          );
        })}

        <path d={areaPath} fill={`url(#${gradientId})`} />
        <polyline
          points={linePoints}
          fill="none"
          stroke="#626b5e"
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {active ? (
          <>
            <line
              x1={active.x}
              y1={PADDING_Y}
              x2={active.x}
              y2={height - PADDING_Y}
              stroke="#DDFB43"
              strokeWidth={2}
            />
            <circle cx={active.x} cy={active.y} r={5.5} fill="#DDFB43" />
            <circle cx={active.x} cy={active.y} r={2.75} fill="#141c12" />
          </>
        ) : null}
      </svg>

      <div className="flex justify-between px-0.5">
        {AXIS_LABELS.map((label) => (
          <span key={label} className="text-[8px] text-[#8e8e93]">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export const RING_TRACK_PATH =
  'M18.5214 110.5C9.13313 99.2031 3.5 84.7596 3.5 69.0198C3.5 32.8342 33.2731 3.5 70 3.5C106.727 3.5 136.5 32.8342 136.5 69.0198C136.5 84.7596 130.867 99.2031 121.479 110.5';

export const RING_PATH_LENGTH = 297;

export function MockStepsHeroRing({
  steps,
  goal,
  width = 168,
}: {
  steps: number;
  goal: number;
  width?: number;
}) {
  const progress = Math.min(steps / goal, 1);
  const dashOffset = RING_PATH_LENGTH * (1 - progress);
  const pct = Math.round(progress * 100);
  const scale = width / 140;
  const svgH = 114 * scale;

  return (
    <div className="relative mx-auto" style={{ width, height: svgH + 28 }}>
      <svg viewBox="0 0 140 114" width={width} height={svgH} aria-hidden>
        <path
          d={RING_TRACK_PATH}
          stroke="#e5ece2"
          strokeWidth={7}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d={RING_TRACK_PATH}
          stroke="#DDFB43"
          strokeWidth={7}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${RING_PATH_LENGTH} ${RING_PATH_LENGTH}`}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div
        className="pointer-events-none absolute inset-x-0 flex flex-col items-center"
        style={{ top: `${38 * scale}px` }}
      >
        <span
          className="font-bold tracking-[-0.04em] text-[#141c12] tabular-nums"
          style={{ fontSize: `${28 * scale}px`, lineHeight: 1 }}
        >
          {steps.toLocaleString()}
        </span>
        <span className="mt-0.5 text-[#626b5e]" style={{ fontSize: `${10 * scale}px` }}>
          of {goal.toLocaleString()} steps
        </span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
        <span className="rounded-full bg-[#eaffe3] px-2 py-0.5 text-[9px]">
          <span className="font-medium text-[#49a621]">{pct}% </span>
          <span className="text-[#626b5e]">of daily goal</span>
        </span>
      </div>
    </div>
  );
}

export function MockLiveBadgeMd() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[#eaffe3] px-2 py-1">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34c759] opacity-40" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#34c759]" />
      </span>
      <span className="text-[9px] font-bold tracking-[0.06em] text-[#1b7a34] uppercase">Live</span>
    </span>
  );
}

export function MockStepsDetailHeroCard({ steps, goal }: { steps: number; goal: number }) {
  const remaining = Math.max(goal - steps, 0);
  const progressPct = Math.round((steps / goal) * 100);

  return (
    <div className="overflow-hidden rounded-[15px] bg-white shadow-[0_1px_2px_rgba(20,28,18,0.05)]">
      <div className="flex items-center justify-between px-3.5 pt-3.5 pb-0.5">
        <div className="flex items-center gap-2">
          <MetricBadgeIcon kind="steps" size={34} />
          <div>
            <p className="text-[12px] leading-tight font-medium text-[#141c12]">Daily progress</p>
            <p className="text-[9px] text-[#8e8e93]">{goal.toLocaleString()} step goal</p>
          </div>
        </div>
        <MockLiveBadgeMd />
      </div>

      <div className="px-3 py-2">
        <MockStepsHeroRing steps={steps} goal={goal} width={164} />
      </div>

      <div className="mx-3.5 mb-4 flex flex-row items-center border-t border-[#f2f3f0] pt-3">
        {[
          { label: 'Remaining', value: `${remaining.toLocaleString()} steps` },
          { label: 'Completed', value: `${progressPct}%` },
          { label: 'Logged today', value: steps.toLocaleString() },
        ].map((cell, i) => (
          <div key={cell.label} className="flex flex-1 flex-row items-center">
            {i > 0 ? <div className="mr-2 h-7 w-px bg-[#e5ece2]" /> : null}
            <div className="flex-1 text-center">
              <p className="text-[8px] font-medium text-[#8e8e93]">{cell.label}</p>
              <p className="mt-0.5 text-[12px] font-bold tracking-[-0.02em] tabular-nums">
                {cell.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
