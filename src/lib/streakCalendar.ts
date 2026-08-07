import type { CalendarDayPillModel, CalendarDayPillVariant } from '@/components/ui/CalendarDayPill';
import { MOCK_STREAK_STEPS_BY_DATE } from '@/constants/streakHistory';
import type { StepsWeekDay } from '@/constants/stepsToday';
import { getLocalTodayParts, type LocalDateParts } from '@/lib/localDate';
import { DEFAULT_DAILY_STEP_GOAL } from '@/lib/steps-preferences';
import { getStepsHistory, getTodayStepsLive } from '@/lib/steps-live-store';

/** @deprecated Import `DEFAULT_DAILY_STEP_GOAL` from `@/lib/steps-preferences` or pass the user goal from `useSteps()`. */
export const STREAK_DAILY_STEP_GOAL = DEFAULT_DAILY_STEP_GOAL;

export type StreakWeekDay = StepsWeekDay;

export type StreakMonthDay = {
  dateKey: string;
  weekdayLabel: string;
  dayNum: string;
  steps: number;
  isToday: boolean;
  inCurrentMonth: boolean;
  isPadding?: boolean;
};

export type StreakMonthWeek = StreakMonthDay[];

const WEEKDAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export { getLocalTodayParts };

function mondayFirstColumnIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

function dateKeyFromParts(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function parseDateKeyParts(
  dateKey: string,
): { year: number; month: number; day: number } | null {
  const parts = dateKey.split('-').map(Number);
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  if (!y || !m || !d) return null;
  return { year: y, month: m, day: d };
}

export function isNextCalendarDay(dateKeyA: string, dateKeyB: string): boolean {
  const a = parseDateKeyParts(dateKeyA);
  const b = parseDateKeyParts(dateKeyB);
  if (!a || !b) return false;
  const next = new Date(a.year, a.month - 1, a.day);
  next.setDate(next.getDate() + 1);
  return (
    next.getFullYear() === b.year && next.getMonth() + 1 === b.month && next.getDate() === b.day
  );
}

/** Active streak days + today (for connector through current day). */
export function buildStreakConnectorKeySet(
  today: LocalDateParts = getLocalTodayParts(),
  goal: number = DEFAULT_DAILY_STEP_GOAL,
): Set<string> {
  const set = buildActiveStreakDateKeySet(today, goal);
  set.add(dateKeyFromParts(today.year, today.month, today.day));
  return set;
}

export function streakDaysConnect(
  a: StreakMonthDay,
  b: StreakMonthDay,
  chainKeys: Set<string>,
): boolean {
  if (a.isPadding || b.isPadding || !a.inCurrentMonth || !b.inCurrentMonth) return false;
  if (!chainKeys.has(a.dateKey) || !chainKeys.has(b.dateKey)) return false;
  return isNextCalendarDay(a.dateKey, b.dateKey);
}

export type StreakDayConnections = {
  right: boolean;
  down: boolean;
  wrapToNextRow: boolean;
  wrapFromPrevRow: boolean;
};

export function buildStreakDayConnections(
  weeks: StreakMonthWeek[],
  chainKeys: Set<string>,
): Map<string, StreakDayConnections> {
  const flags = new Map<string, StreakDayConnections>();
  const empty = (): StreakDayConnections => ({
    right: false,
    down: false,
    wrapToNextRow: false,
    wrapFromPrevRow: false,
  });

  for (let w = 0; w < weeks.length; w++) {
    const week = weeks[w];
    for (let i = 0; i < week.length; i++) {
      const day = week[i];
      if (day.isPadding || !day.inCurrentMonth) continue;

      const entry = flags.get(day.dateKey) ?? empty();

      const nextInRow = week[i + 1];
      if (nextInRow && streakDaysConnect(day, nextInRow, chainKeys)) {
        entry.right = true;
      }

      const nextWeek = weeks[w + 1];
      const below = nextWeek?.[i];
      if (
        below &&
        !below.isPadding &&
        below.inCurrentMonth &&
        streakDaysConnect(day, below, chainKeys)
      ) {
        entry.down = true;
      }

      if (!entry.right && i === 6 && nextWeek) {
        const wrapTarget = nextWeek.find(
          (d) => d.inCurrentMonth && !d.isPadding && streakDaysConnect(day, d, chainKeys),
        );
        if (wrapTarget) {
          entry.wrapToNextRow = true;
          const wrapEntry = flags.get(wrapTarget.dateKey) ?? empty();
          wrapEntry.wrapFromPrevRow = true;
          flags.set(wrapTarget.dateKey, wrapEntry);
        }
      }

      flags.set(day.dateKey, entry);
    }
  }

  return flags;
}

export function stepsForDateKey(dateKey: string): number {
  return getStepsHistory()[dateKey] ?? MOCK_STREAK_STEPS_BY_DATE[dateKey] ?? 0;
}

export function isStreakDayComplete(
  steps: number,
  goal: number = DEFAULT_DAILY_STEP_GOAL,
): boolean {
  return steps >= goal;
}

function isCompleteOnCalendarDay(
  year: number,
  month: number,
  day: number,
  goal: number = DEFAULT_DAILY_STEP_GOAL,
): boolean {
  return isStreakDayComplete(stepsForDateKey(dateKeyFromParts(year, month, day)), goal);
}

export function buildMonthGrid(
  year: number,
  month: number,
  today: LocalDateParts = getLocalTodayParts(),
): StreakMonthWeek[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstOffset = mondayFirstColumnIndex(new Date(year, month - 1, 1));
  const cells: StreakMonthDay[] = [];

  for (let i = 0; i < firstOffset; i++) {
    cells.push({
      dateKey: `pad-start-${year}-${month}-${i}`,
      weekdayLabel: '',
      dayNum: '',
      steps: 0,
      isToday: false,
      inCurrentMonth: false,
      isPadding: true,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month - 1, day);
    const col = mondayFirstColumnIndex(date);
    const dateKey = dateKeyFromParts(year, month, day);
    cells.push({
      dateKey,
      weekdayLabel: WEEKDAY_SHORT[col],
      dayNum: String(day),
      steps: stepsForDateKey(dateKey),
      isToday: today.year === year && today.month === month && today.day === day,
      inCurrentMonth: true,
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push({
      dateKey: `pad-end-${cells.length}`,
      weekdayLabel: '',
      dayNum: '',
      steps: 0,
      isToday: false,
      inCurrentMonth: false,
      isPadding: true,
    });
  }

  const weeks: StreakMonthWeek[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

export function formatMonthYearLabel(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export type StreakCalendarDayTone = 'live' | 'past-win' | 'today-open' | 'empty' | 'future';

function calendarDayOrdinal(year: number, month: number, day: number): number {
  return new Date(year, month - 1, day).setHours(0, 0, 0, 0);
}

function todayOrdinal(today: { year: number; month: number; day: number }): number {
  return calendarDayOrdinal(today.year, today.month, today.day);
}

export function buildActiveStreakDateKeySet(
  today: LocalDateParts = getLocalTodayParts(),
  goal: number = DEFAULT_DAILY_STEP_GOAL,
): Set<string> {
  const set = new Set<string>();
  const cursor = new Date(today.year, today.month - 1, today.day);

  if (!isCompleteOnCalendarDay(today.year, today.month, today.day, goal)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (cursor.getFullYear() >= 2020) {
    const y = cursor.getFullYear();
    const m = cursor.getMonth() + 1;
    const d = cursor.getDate();
    if (!isCompleteOnCalendarDay(y, m, d, goal)) break;
    set.add(dateKeyFromParts(y, m, d));
    cursor.setDate(cursor.getDate() - 1);
  }
  return set;
}

export function streakCalendarDayTone(
  day: StreakMonthDay,
  activeStreakKeys: Set<string>,
  today: LocalDateParts = getLocalTodayParts(),
  goal: number = DEFAULT_DAILY_STEP_GOAL,
): StreakCalendarDayTone {
  if (day.isPadding || !day.inCurrentMonth) return 'empty';

  const parts = day.dateKey.split('-').map(Number);
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  if (!y || !m || !d) return 'empty';

  const ord = calendarDayOrdinal(y, m, d);
  const todayOrd = todayOrdinal(today);
  const complete = isStreakDayComplete(day.steps, goal);

  if (ord > todayOrd) return 'future';
  if (day.isToday && !complete) return 'today-open';
  if (complete && activeStreakKeys.has(day.dateKey)) return 'live';
  if (complete && ord < todayOrd) return 'past-win';
  if (complete && day.isToday) return 'live';
  return 'empty';
}

export function countGoalDaysInMonth(
  weeks: StreakMonthWeek[],
  goal: number = DEFAULT_DAILY_STEP_GOAL,
): number {
  return weeks.flat().filter((d) => d.inCurrentMonth && isStreakDayComplete(d.steps, goal)).length;
}

export function streakHeroSubtitle(
  streakDays: number,
  todayComplete: boolean,
  goal: number = DEFAULT_DAILY_STEP_GOAL,
): string {
  if (streakDays === 0) {
    return `Walk ${goal.toLocaleString()}+ steps to start your first streak.`;
  }
  if (!todayComplete) {
    return 'Finish today’s step goal to protect your streak.';
  }
  return 'Today counts — keep the chain going tomorrow.';
}

export function computeCurrentStreak(
  days: readonly StreakWeekDay[],
  goal: number = DEFAULT_DAILY_STEP_GOAL,
): number {
  const todayIdx = days.findIndex((d) => d.isToday);
  const ordered = todayIdx >= 0 ? days.slice(0, todayIdx + 1) : [...days];

  let streak = 0;
  let i = ordered.length - 1;
  if (i >= 0 && ordered[i].isToday && !isStreakDayComplete(ordered[i].steps, goal)) {
    i--;
  }
  while (i >= 0 && isStreakDayComplete(ordered[i].steps, goal)) {
    streak++;
    i--;
  }
  return streak;
}

export function computeCurrentStreakThroughToday(
  today: LocalDateParts = getLocalTodayParts(),
  goal: number = DEFAULT_DAILY_STEP_GOAL,
): number {
  let streak = 0;
  const cursor = new Date(today.year, today.month - 1, today.day);

  if (!isCompleteOnCalendarDay(today.year, today.month, today.day, goal)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (cursor.getFullYear() >= 2020) {
    const y = cursor.getFullYear();
    const m = cursor.getMonth() + 1;
    const d = cursor.getDate();
    if (!isCompleteOnCalendarDay(y, m, d, goal)) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function computeLongestStreakInMonth(
  weeks: StreakMonthWeek[],
  goal: number = DEFAULT_DAILY_STEP_GOAL,
): number {
  const flat = weeks.flat().filter((d) => d.inCurrentMonth);
  let best = 0;
  let run = 0;
  for (const d of flat) {
    if (isStreakDayComplete(d.steps, goal)) {
      run++;
      best = Math.max(best, run);
    } else {
      run = 0;
    }
  }
  return best;
}

export type StreakWeekDayUi = {
  dateKey: string;
  weekday: string;
  day: string;
  steps: number;
  isToday: boolean;
};

export type StreakWeekDayUiState = 'complete' | 'today-open' | 'future' | 'missed';

export function buildStreakWeekDays(
  today: LocalDateParts = getLocalTodayParts(),
): StreakWeekDayUi[] {
  const anchor = new Date(today.year, today.month - 1, today.day);
  const mondayOffset = (anchor.getDay() + 6) % 7;
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() - mondayOffset);

  const days: StreakWeekDayUi[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const dayNum = d.getDate();
    const dateKey = dateKeyFromParts(year, month, dayNum);
    const isToday = year === today.year && month === today.month && dayNum === today.day;
    const steps = isToday ? getTodayStepsLive() : stepsForDateKey(dateKey);
    days.push({
      dateKey,
      weekday: WEEKDAY_SHORT[i],
      day: String(dayNum).padStart(2, '0'),
      steps,
      isToday,
    });
  }
  return days;
}

export function streakWeekDayUiState(
  day: StreakWeekDayUi,
  today: LocalDateParts = getLocalTodayParts(),
  goal: number = DEFAULT_DAILY_STEP_GOAL,
): StreakWeekDayUiState {
  const complete = isStreakDayComplete(day.steps, goal);
  if (day.isToday) {
    return complete ? 'complete' : 'today-open';
  }

  const parts = parseDateKeyParts(day.dateKey);
  if (!parts) return 'future';

  const dayOrd = calendarDayOrdinal(parts.year, parts.month, parts.day);
  const todayOrd = todayOrdinal(today);

  if (dayOrd > todayOrd) return 'future';
  if (complete) return 'complete';
  return 'missed';
}

export function weekDayToPill(
  day: StreakWeekDay,
  goal: number = DEFAULT_DAILY_STEP_GOAL,
): CalendarDayPillModel {
  const complete = isStreakDayComplete(day.steps, goal);
  let variant: CalendarDayPillVariant;
  if (day.isToday) {
    variant = 'today';
  } else if (complete) {
    variant = 'active';
  } else {
    variant = 'future';
  }

  const streakFlame = complete && day.streak === true;

  return {
    weekday: day.weekday,
    day: day.day,
    variant,
    streak: streakFlame,
  };
}

export function buildHomeWeekPills(
  week: StreakWeekDay[],
  goal: number = DEFAULT_DAILY_STEP_GOAL,
): CalendarDayPillModel[] {
  return week.map((d) => weekDayToPill(d, goal));
}
