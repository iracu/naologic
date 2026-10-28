export type TimelineScale = 'day' | 'week' | 'month';

export interface TimelineColumn {
  readonly start: string;
  readonly end: string;
  readonly label: string;
}

const DAY_MS = 86_400_000;

function parseDate(value: string): Date {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new Error('Expected a valid YYYY-MM-DD calendar date.');
  }
  return date;
}

function iso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function localCalendarDate(date: Date): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

/** Calendar arithmetic uses UTC as a neutral representation, never elapsed local hours. */
export function addCalendarDays(value: string, days: number): string {
  const date = parseDate(value);
  date.setUTCDate(date.getUTCDate() + days);
  return iso(date);
}

export function createTimelineColumns(
  today: string,
  scale: TimelineScale,
  extraBefore = 0,
  extraAfter = 0,
): readonly TimelineColumn[] {
  const anchor = parseDate(today);
  const radius = scale === 'day' ? 14 : scale === 'week' ? 9 : 6;
  if (scale === 'week') anchor.setUTCDate(anchor.getUTCDate() - ((anchor.getUTCDay() + 6) % 7));
  if (scale === 'month') anchor.setUTCDate(1);
  const boundary = (offset: number): string => {
    const date = new Date(anchor);
    if (scale === 'month') date.setUTCMonth(date.getUTCMonth() + offset);
    else return addCalendarDays(iso(anchor), offset * (scale === 'week' ? 7 : 1));
    return iso(date);
  };
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'short',
    ...(scale === 'month' ? { year: 'numeric' } : { day: 'numeric' }),
  });
  return Array.from({ length: radius * 2 + 1 + extraBefore + extraAfter }, (_, index) => {
    const start = boundary(index - radius - extraBefore);
    const end = boundary(index - radius - extraBefore + 1);
    const label = formatter.format(parseDate(start));
    return { start, end, label: scale === 'week' ? `Week of ${label}` : label };
  });
}

/** Position in column units. Months interpolate using their actual calendar-day count.
 * Grid intervals are [start, end); this does not decide future work-order endpoint rules.
 */
export function dateColumnPosition(
  date: string,
  columns: readonly TimelineColumn[],
): number | null {
  const timestamp = parseDate(date).getTime();
  const index = columns.findIndex((column) => date >= column.start && date < column.end);
  if (index < 0) return null;
  const column = columns[index];
  const start = parseDate(column.start).getTime();
  const end = parseDate(column.end).getTime();
  // Place the indicator in the middle of today's day, even within a week or month.
  return index + (timestamp - start + DAY_MS / 2) / (end - start);
}

export function centeredScrollLeft(
  position: number,
  viewport: number,
  sidebar: number,
  content: number,
): number {
  const requested = position - Math.max(0, viewport - sidebar) / 2;
  return Math.max(0, Math.min(requested, Math.max(0, content + sidebar - viewport)));
}

export interface TimelineBarPosition {
  readonly start: number;
  readonly width: number;
}

/** Inclusive order dates, clipped to the visible half-open grid range.
 * Positions use column units, so each month retains its own calendar-day length.
 */
export function workOrderBarPosition(
  startDate: string,
  endDate: string,
  columns: readonly TimelineColumn[],
): TimelineBarPosition | null {
  const startTime = parseDate(startDate).getTime();
  const endTime = parseDate(endDate).getTime() + DAY_MS;
  if (startDate > endDate || columns.length === 0) return null;
  const boundaryPosition = (timestamp: number): number => {
    for (const [index, column] of columns.entries()) {
      const start = parseDate(column.start).getTime();
      const end = parseDate(column.end).getTime();
      if (timestamp <= start) return index;
      if (timestamp < end) return index + (timestamp - start) / (end - start);
    }
    return columns.length;
  };
  const start = boundaryPosition(startTime);
  const end = boundaryPosition(endTime);
  return end > start ? { start, width: end - start } : null;
}

export function isCalendarDate(value: string): boolean {
  try {
    parseDate(value);
    return true;
  } catch {
    return false;
  }
}

/** Inverse of bar geometry: floor to the calendar day under a pointer. */
export function dateAtColumnPosition(
  position: number,
  columns: readonly TimelineColumn[],
): string | null {
  if (!Number.isFinite(position) || position < 0 || position >= columns.length) return null;
  const index = Math.floor(position);
  const column = columns[index];
  const days = (parseDate(column.end).getTime() - parseDate(column.start).getTime()) / DAY_MS;
  return addCalendarDays(
    column.start,
    Math.min(days - 1, Math.floor((position - index) * days + 1e-9)),
  );
}
