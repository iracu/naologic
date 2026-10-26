import { createTimelineColumns, workOrderBarPosition } from './timeline';

describe('work order bar geometry', () => {
  it('includes both endpoint days and supports adjacent separated orders', () => {
    const columns = createTimelineColumns('2026-01-01', 'day');
    expect(workOrderBarPosition('2025-12-31', '2026-01-02', columns)).toEqual({
      start: 13,
      width: 3,
    });
    expect(workOrderBarPosition('2026-01-03', '2026-01-03', columns)).toEqual({
      start: 16,
      width: 1,
    });
  });

  it('interpolates across Monday week boundaries', () => {
    const columns = createTimelineColumns('2026-10-25', 'week');
    const position = workOrderBarPosition('2026-10-25', '2026-10-27', columns);
    expect(position?.start).toBeCloseTo(9 + 6 / 7);
    expect(position?.width).toBeCloseTo(3 / 7);
  });

  it('uses actual month lengths across leap day and a month boundary', () => {
    const columns = createTimelineColumns('2024-02-29', 'month');
    const position = workOrderBarPosition('2024-02-28', '2024-03-02', columns);
    expect(position?.start).toBeCloseTo(6 + 27 / 29);
    expect(position?.width).toBeCloseTo(2 / 29 + 2 / 31);
    expect(workOrderBarPosition('2024-02-01', '2024-02-29', columns)).toEqual({
      start: 6,
      width: 1,
    });
  });

  it.each(['2026-03-08', '2026-10-25'])('keeps a full day at DST boundary %s', (date) => {
    expect(workOrderBarPosition(date, date, createTimelineColumns(date, 'day'))).toEqual({
      start: 14,
      width: 1,
    });
  });

  it.each(['day', 'week', 'month'] as const)(
    'clips orders at both %s grid edges and omits invisible orders',
    (scale) => {
      const columns = createTimelineColumns('2026-10-25', scale);
      expect(workOrderBarPosition('2020-01-01', '2030-01-01', columns)).toEqual({
        start: 0,
        width: columns.length,
      });
      expect(workOrderBarPosition('2020-01-01', columns[0].start, columns)?.start).toBe(0);
      const right = workOrderBarPosition(columns[columns.length - 1].start, '2030-01-01', columns);
      expect(right).toEqual({ start: columns.length - 1, width: 1 });
      expect(
        workOrderBarPosition(columns[columns.length - 1].end, '2030-01-01', columns),
      ).toBeNull();
      expect(workOrderBarPosition('2020-01-01', '2020-01-02', columns)).toBeNull();
    },
  );

  it('rejects malformed dates and omits reversed intervals or empty grids', () => {
    const columns = createTimelineColumns('2026-10-25', 'day');
    expect(() => workOrderBarPosition('2026-02-30', '2026-03-01', columns)).toThrow();
    expect(workOrderBarPosition('2026-10-26', '2026-10-25', columns)).toBeNull();
    expect(workOrderBarPosition('2026-10-25', '2026-10-26', [])).toBeNull();
  });
});
