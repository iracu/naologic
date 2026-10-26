import {
  addCalendarDays,
  centeredScrollLeft,
  createTimelineColumns,
  dateColumnPosition,
  localCalendarDate,
} from './timeline';

describe('timeline calendar geometry', () => {
  it('builds 29 contiguous days centered on the supplied day across a year boundary', () => {
    const columns = createTimelineColumns('2026-01-01', 'day');
    expect(columns).toHaveLength(29);
    expect(columns[0].start).toBe('2025-12-18');
    expect(columns[14].start).toBe('2026-01-01');
    expect(columns[28].end).toBe('2026-01-16');
    for (let i = 1; i < columns.length; i++) expect(columns[i].start).toBe(columns[i - 1].end);
    expect(dateColumnPosition('2026-01-01', columns)).toBe(14.5);
  });

  it('starts weeks on Monday, including when today is Sunday', () => {
    const columns = createTimelineColumns('2026-10-25', 'week');
    expect(columns).toHaveLength(19);
    expect(columns[9]).toEqual({ start: '2026-10-19', end: '2026-10-26', label: 'Week of Oct 19' });
    expect(dateColumnPosition('2026-10-25', columns)).toBeCloseTo(9 + 6.5 / 7);
  });

  it('builds real months across leap years without month-end overflow', () => {
    const columns = createTimelineColumns('2024-02-29', 'month');
    expect(columns).toHaveLength(13);
    expect(columns[6]).toEqual({ start: '2024-02-01', end: '2024-03-01', label: 'Feb 2024' });
    expect(dateColumnPosition('2024-02-29', columns)).toBeCloseTo(6 + 28.5 / 29);
    expect(createTimelineColumns('2026-01-31', 'month')[7].start).toBe('2026-02-01');
  });

  it('uses calendar days across daylight-saving transitions and leap days', () => {
    expect(addCalendarDays('2026-03-08', 1)).toBe('2026-03-09');
    expect(addCalendarDays('2026-10-25', 1)).toBe('2026-10-26');
    expect(addCalendarDays('2024-02-28', 1)).toBe('2024-02-29');
    expect(addCalendarDays('2026-01-01', -1)).toBe('2025-12-31');
    expect(localCalendarDate(new Date(2026, 9, 25, 23, 59))).toBe('2026-10-25');
  });

  it('rejects invalid dates and returns null for dates outside the grid', () => {
    expect(() => createTimelineColumns('2026-02-30', 'day')).toThrow();
    expect(() => createTimelineColumns('invalid', 'week')).toThrow();
    expect(dateColumnPosition('2026-10-25', [])).toBeNull();
    const columns = createTimelineColumns('2026-10-25', 'day');
    expect(dateColumnPosition(columns[28].end, columns)).toBeNull();
    expect(dateColumnPosition('2025-10-25', columns)).toBeNull();
  });

  it('centers in the space to the right of the sidebar and clamps scroll bounds', () => {
    expect(centeredScrollLeft(500, 800, 200, 2000)).toBe(200);
    expect(centeredScrollLeft(10, 800, 200, 2000)).toBe(0);
    expect(centeredScrollLeft(1999, 800, 200, 2000)).toBe(1400);
    expect(centeredScrollLeft(50, 800, 200, 100)).toBe(0);
  });
});
