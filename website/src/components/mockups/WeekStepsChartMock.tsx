type MockWeekDay = {
  weekday: string;
  day: string;
  variant: 'active' | 'today' | 'future';
  streak?: boolean;
};

type MockWeekStepsChartProps = {
  steps?: number[];
  selectedIndex?: number;
  width?: number;
  height?: number;
};

const DEFAULT_STEPS = [8420, 6180, 9840, 7210, 10320, 5520, 6840];

function buildChartGeometry(steps: number[], width: number, height: number) {
  const paddingX = 4;
  const paddingY = 10;
  const innerW = width - paddingX * 2;
  const innerH = height - paddingY * 2;
  const bottomY = paddingY + innerH;
  const maxSteps = Math.max(...steps, 1);

  const points = steps.map((value, i) => {
    const x = paddingX + (i / Math.max(steps.length - 1, 1)) * innerW;
    const y = value > 0 ? paddingY + innerH - (value / maxSteps) * innerH : bottomY - 3;
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

  return { points, linePoints, areaPath, paddingY, height, width, paddingX };
}

export function MockWeekStepsChart({
  steps = DEFAULT_STEPS,
  selectedIndex = 3,
  width = 268,
  height = 88,
}: MockWeekStepsChartProps) {
  const { points, linePoints, areaPath, paddingY, paddingX } = buildChartGeometry(
    steps,
    width,
    height,
  );
  const active = points[selectedIndex] ?? points[0];
  const gradientId = 'mock-week-steps-gradient';

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DDFB43" stopOpacity={0.55} />
          <stop offset="0.65" stopColor="#DDFB43" stopOpacity={0.12} />
          <stop offset="1" stopColor="#DDFB43" stopOpacity={0} />
        </linearGradient>
      </defs>

      {[0.33, 0.66].map((t) => {
        const y = paddingY + (height - paddingY * 2) * t;
        return (
          <line
            key={t}
            x1={paddingX}
            y1={y}
            x2={width - paddingX}
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
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {active ? (
        <>
          <line
            x1={active.x}
            y1={paddingY}
            x2={active.x}
            y2={height - paddingY}
            stroke="#DDFB43"
            strokeWidth={2}
          />
          <circle cx={active.x} cy={active.y} r={6} fill="#DDFB43" />
          <circle cx={active.x} cy={active.y} r={3} fill="#141c12" />
        </>
      ) : null}
    </svg>
  );
}

export const MOCK_WEEK_DAYS: MockWeekDay[] = [
  { weekday: 'Mon', day: '10', variant: 'future' },
  { weekday: 'Tue', day: '11', variant: 'future' },
  { weekday: 'Wed', day: '12', variant: 'future', streak: true },
  { weekday: 'Thu', day: '13', variant: 'active', streak: true },
  { weekday: 'Fri', day: '14', variant: 'today' },
  { weekday: 'Sat', day: '15', variant: 'future' },
  { weekday: 'Sun', day: '16', variant: 'future' },
];

export function MockCalendarDayPill({ day }: { day: MockWeekDay }) {
  const isLime = day.variant === 'active';
  const isToday = day.variant === 'today';

  return (
    <div
      className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-[14px] py-1.5 ${
        isLime ? 'bg-[#ddfb43]' : 'bg-white'
      } ${isToday ? 'border-2 border-[#ddfb43]' : day.variant === 'future' ? 'border border-[#e5e7eb]' : ''}`}
      style={{ minHeight: 52 }}
    >
      {day.streak ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="mb-0.5" aria-hidden>
          <path
            d="M12 21.5c-2.35 0-4.25-1.85-4.25-4.35 0-1.45.65-2.85 1.7-4.15.55-.75 1.05-1.45 1.35-2.05.3.6.8 1.3 1.35 2.05 1.05 1.3 1.7 2.7 1.7 4.15 0 2.5-1.9 4.35-4.25 4.35Z"
            stroke={isLime ? '#1e2c00' : '#5c6d05'}
            strokeWidth={1.5}
          />
        </svg>
      ) : (
        <span className="mb-0.5 h-2.5" />
      )}
      <span
        className={`text-[8px] ${isLime ? 'text-[#1e2c00]' : 'text-[#626b5e]'}`}
        style={{ fontWeight: 400 }}
      >
        {day.weekday}
      </span>
      <span className={`text-[11px] font-medium ${isLime ? 'text-[#1e2c00]' : 'text-[#141c12]'}`}>
        {day.day}
      </span>
    </div>
  );
}

export const MOCK_SELECTED_DAY = { steps: 7210, weekday: 'Thu' };
