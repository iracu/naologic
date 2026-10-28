beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

import { WorkOrderDataService } from './work-order-data.service';
import { createOrderDefaults } from '../domain/work-order-rules';

describe('creating orders in the local data service', () => {
  it('adds an immutable document with a unique id and trimmed name', () => {
    const service = new WorkOrderDataService();
    const before = service.schedule();
    const draft = {
      ...createOrderDefaults({ workCenterId: 'wc-1', startDate: '2050-01-01' }),
      name: ' New order ',
    };
    expect(service.create(draft)).toBeNull();
    expect(before.workOrders).toHaveLength(8);
    const orders = service.schedule().workOrders;
    expect(orders).toHaveLength(9);
    expect(orders[8].data.name).toBe('New order');
    expect(orders[8].docType).toBe('workOrder');
    expect(new Set(orders.map((order) => order.docId)).size).toBe(9);
    expect(service.create(draft)).toContain('overlaps');
    expect(service.schedule().workOrders).toHaveLength(9);
  });
  it('guards invalid data and unknown centers without mutating state', () => {
    const service = new WorkOrderDataService();
    const before = service.schedule();
    expect(
      service.create(createOrderDefaults({ workCenterId: 'wc-1', startDate: '2050-01-01' })),
    ).toContain('required');
    expect(service.create({ ...before.workOrders[0].data, workCenterId: 'missing' })).toContain(
      'work center',
    );
    expect(service.schedule()).toBe(before);
  });
  it('updates immutably, preserves identity and center, and excludes itself from overlap', () => {
    const service = new WorkOrderDataService();
    const before = service.schedule();
    const original = before.workOrders[0];
    expect(
      service.update(original.docId, { ...original.data, name: ' Updated ', status: 'blocked' }),
    ).toBeNull();
    const after = service.schedule();
    expect(after.workOrders).toHaveLength(8);
    expect(after.workOrders[0]).toEqual({
      ...original,
      data: { ...original.data, name: 'Updated', status: 'blocked' },
    });
    expect(before.workOrders[0]).toBe(original);
    expect(original.data.name).not.toBe('Updated');
    expect(after.workOrders[1]).toBe(before.workOrders[1]);
  });

  it('rejects conflicts, invalid ranges, and unknown IDs without changing state', () => {
    const service = new WorkOrderDataService();
    const before = service.schedule();
    const [original, other] = before.workOrders;
    expect(
      service.update(original.docId, {
        ...original.data,
        startDate: other.data.startDate,
        endDate: other.data.endDate,
      }),
    ).toContain('overlaps');
    expect(
      service.update(original.docId, { ...original.data, endDate: original.data.startDate }),
    ).toContain('after');
    expect(service.update('missing', original.data)).toContain('no longer exists');
    expect(service.schedule()).toBe(before);
  });
  it('deletes only the selected document immutably and ignores missing IDs', () => {
    const service = new WorkOrderDataService();
    const before = service.schedule();
    const removed = before.workOrders[0];
    service.delete(removed.docId);
    expect(service.schedule().workOrders).toEqual(before.workOrders.slice(1));
    expect(before.workOrders).toHaveLength(8);
    expect(service.schedule().workCenters).toBe(before.workCenters);
    const after = service.schedule();
    service.delete(removed.docId);
    service.delete('unknown');
    expect(service.schedule()).toBe(after);
  });
});

describe('persistent schedule', () => {
  it('restores creation, editing and deletion across service instances', () => {
    const service = new WorkOrderDataService();
    service.create({
      ...createOrderDefaults({ workCenterId: 'wc-1', startDate: '2050-01-01' }),
      name: 'Persisted',
    });
    const created = service.schedule().workOrders[8];
    service.update(created.docId, { ...created.data, name: 'Updated persisted' });
    service.delete(service.schedule().workOrders[0].docId);
    expect(new WorkOrderDataService().schedule().workOrders).toEqual(service.schedule().workOrders);
    for (const order of service.schedule().workOrders) service.delete(order.docId);
    expect(new WorkOrderDataService().schedule().workOrders).toEqual([]);
  });
  it('falls back gracefully for malformed JSON and invalid schemas', () => {
    for (const value of ['{bad', '{"version":99,"orders":[]}']) {
      localStorage.setItem('naologic.work-orders.v1', value);
      const service = new WorkOrderDataService();
      expect(service.schedule().workOrders).toHaveLength(8);
      expect(service.persistenceWarning()).toContain('could not be loaded');
    }
  });
  it('keeps in-memory changes and reports storage write failures', () => {
    const service = new WorkOrderDataService();
    const write = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Quota exceeded', 'QuotaExceededError');
    });
    try {
      service.delete(service.schedule().workOrders[0].docId);
      expect(service.schedule().workOrders).toHaveLength(7);
      expect(service.persistenceWarning()).toContain('could not be saved');
    } finally {
      write.mockRestore();
    }
  });
});
