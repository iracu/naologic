import {
  createOrderDefaults,
  hasOrderOverlap,
  validDateRange,
  validateWorkOrder,
} from './work-order-rules';
import { createTimelineColumns, dateAtColumnPosition } from './timeline';
import { WorkOrderDocument } from './work-order';

const draft = {
  ...createOrderDefaults({ workCenterId: 'wc-1', startDate: '2024-02-28' }),
  name: 'New order',
};
const existing: WorkOrderDocument = { docId: 'one', docType: 'workOrder', data: draft };

describe('create work order rules', () => {
  it('defaults to Open and seven calendar days later across leap day and year end', () => {
    expect(draft.endDate).toBe('2024-03-06');
    expect(draft.status).toBe('open');
    expect(createOrderDefaults({ workCenterId: 'wc-1', startDate: '2026-12-28' }).endDate).toBe(
      '2027-01-04',
    );
    expect(createOrderDefaults({ workCenterId: 'wc-1', startDate: '2026-03-06' }).endDate).toBe(
      '2026-03-13',
    );
  });
  it('requires a real date range with end strictly after start', () => {
    expect(validDateRange('2024-02-29', '2024-03-01')).toBe(true);
    for (const [start, end] of [
      ['2026-02-29', '2026-03-01'],
      ['2026-01-01', '2026-01-01'],
      ['2026-01-02', '2026-01-01'],
      ['', '2026-01-01'],
    ])
      expect(validDateRange(start, end)).toBe(false);
    expect(validateWorkOrder({ ...draft, name: '  ' }, [])).toContain('name');
  });
  it.each([
    ['2024-02-20', '2024-02-28'],
    ['2024-03-06', '2024-03-07'],
    ['2024-02-29', '2024-03-01'],
    ['2024-01-01', '2024-04-01'],
  ])('detects inclusive overlap for %s through %s', (startDate, endDate) => {
    expect(hasOrderOverlap({ ...draft, startDate, endDate }, [existing])).toBe(true);
  });
  it('allows next-day adjacency and orders on different centers', () => {
    expect(
      hasOrderOverlap({ ...draft, startDate: '2024-03-07', endDate: '2024-03-08' }, [existing]),
    ).toBe(false);
    expect(hasOrderOverlap({ ...draft, workCenterId: 'wc-2' }, [existing])).toBe(false);
  });
  it('maps fractional column positions at every zoom to calendar days', () => {
    expect(dateAtColumnPosition(14.99, createTimelineColumns('2024-02-29', 'day'))).toBe(
      '2024-02-29',
    );
    expect(dateAtColumnPosition(9 + 6.5 / 7, createTimelineColumns('2026-10-25', 'week'))).toBe(
      '2026-10-25',
    );
    expect(dateAtColumnPosition(6 + 28.5 / 29, createTimelineColumns('2024-02-29', 'month'))).toBe(
      '2024-02-29',
    );
    expect(dateAtColumnPosition(7, createTimelineColumns('2024-02-29', 'month'))).toBe(
      '2024-03-01',
    );
    expect(dateAtColumnPosition(-1, createTimelineColumns('2024-02-29', 'day'))).toBeNull();
    expect(dateAtColumnPosition(29, createTimelineColumns('2024-02-29', 'day'))).toBeNull();
  });
  it('excludes only the edited ID, still detecting another order sharing an endpoint', () => {
    expect(hasOrderOverlap(draft, [existing], existing.docId)).toBe(false);
    expect(validateWorkOrder(draft, [existing], existing.docId)).toBeNull();
    const other = {
      ...existing,
      docId: 'other',
      data: { ...draft, startDate: draft.endDate, endDate: '2024-03-09' },
    };
    expect(hasOrderOverlap(draft, [existing, other], existing.docId)).toBe(true);
    expect(hasOrderOverlap(draft, [existing], 'different-id')).toBe(true);
  });
});
