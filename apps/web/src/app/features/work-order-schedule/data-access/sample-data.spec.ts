import { createSampleData } from './sample-data';

describe('sample schedule contract', () => {
  it('provides linked, varied, non-overlapping orders with every required status', () => {
    const { workCenters, workOrders } = createSampleData('2026-10-25');
    expect(workCenters.length).toBeGreaterThanOrEqual(5);
    expect(workOrders.length).toBeGreaterThanOrEqual(8);
    const centerIds = new Set(workCenters.map((center) => center.docId));
    expect(centerIds.size).toBe(workCenters.length);
    expect(new Set(workOrders.map((order) => order.docId)).size).toBe(workOrders.length);
    expect(new Set(workOrders.map((order) => order.data.status))).toEqual(
      new Set(['open', 'in-progress', 'complete', 'blocked']),
    );
    expect(
      workCenters.some(
        (center) =>
          workOrders.filter((order) => order.data.workCenterId === center.docId).length > 1,
      ),
    ).toBe(true);
    for (const order of workOrders) {
      expect(centerIds.has(order.data.workCenterId)).toBe(true);
      expect(order.data.startDate < order.data.endDate).toBe(true);
      for (const other of workOrders) {
        if (order.docId === other.docId || order.data.workCenterId !== other.data.workCenterId)
          continue;
        expect(
          order.data.endDate < other.data.startDate || other.data.endDate < order.data.startDate,
        ).toBe(true);
      }
    }
  });

  it('uses calendar arithmetic across leap days and year boundaries', () => {
    expect(createSampleData('2024-02-28').workOrders[0]?.data.endDate).toBe('2024-02-20');
    expect(createSampleData('2024-02-28').workOrders[1]?.data.endDate).toBe('2024-03-02');
    expect(createSampleData('2026-01-01').workOrders[0]?.data.startDate).toBe('2025-12-20');
  });

  it('rejects invalid calendar dates and produces independent data', () => {
    expect(() => createSampleData('2026-02-30')).toThrow();
    expect(() => createSampleData('invalid')).toThrow();
    const first = createSampleData('2026-10-25');
    const second = createSampleData('2026-10-25');
    expect(first).toEqual(second);
    expect(first.workOrders).not.toBe(second.workOrders);
  });
});
