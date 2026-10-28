import { decodeWorkOrders } from './stored-work-orders';
import { createSampleData } from '../data-access/sample-data';

describe('stored order validation', () => {
  const sample = createSampleData('2026-10-26');
  const decode = (orders: unknown) => decodeWorkOrders({ version: 1, orders }, sample.workCenters);
  it('accepts valid snapshots and intentional empty schedules', () => {
    expect(decode(sample.workOrders)).toEqual(sample.workOrders);
    expect(decode([])).toEqual([]);
  });
  it('rejects unknown schemas, invalid shapes and duplicate IDs', () => {
    expect(decodeWorkOrders({ version: 2, orders: [] }, sample.workCenters)).toBeNull();
    expect(decode([null])).toBeNull();
    expect(decode([sample.workOrders[0], sample.workOrders[0]])).toBeNull();
  });
  it('rejects invalid dates, status, centers and overlapping intervals', () => {
    const original = sample.workOrders[0];
    for (const changes of [
      { startDate: '2026-02-30' },
      { status: 'unknown' },
      { workCenterId: 'missing' },
      { name: ' ' },
      { endDate: original.data.startDate },
    ]) {
      expect(decode([{ ...original, data: { ...original.data, ...changes } }])).toBeNull();
    }
    expect(decode([original, { ...original, docId: 'duplicate-interval' }])).toBeNull();
  });
});
