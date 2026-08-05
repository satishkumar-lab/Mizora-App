const WEEKDAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export type LocalDateParts = {
  year: number;
  month: number;
  day: number;
};

export function getLocalTodayParts(date: Date = new Date()): LocalDateParts {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

export function localDateKey(parts: LocalDateParts): string {
  return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
}

export function localTodayDateKey(): string {
  return localDateKey(getLocalTodayParts());
}

function startOfWeekMonday(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  const column = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - column);
  return copy;
}

export type RollingWeekDayBase = {
  weekday: (typeof WEEKDAY_SHORT)[number];
  day: string;
  isToday: boolean;
};

/** Monday → Sunday for the week containing `anchor`. */
export function buildRollingWeekDays(anchor: Date = new Date()): RollingWeekDayBase[] {
  const today = getLocalTodayParts(anchor);
  const monday = startOfWeekMonday(anchor);
  const rows: RollingWeekDayBase[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const dayNum = d.getDate();
    rows.push({
      weekday: WEEKDAY_SHORT[i],
      day: String(dayNum).padStart(2, '0'),
      isToday: y === today.year && m === today.month && dayNum === today.day,
    });
  }

  return rows;
}

export function dateKeyForRollingDay(anchor: Date, index: number): string {
  const monday = startOfWeekMonday(anchor);
  const d = new Date(monday);
  d.setDate(monday.getDate() + index);
  return localDateKey(getLocalTodayParts(d));
}
