import { Injectable, signal } from '@angular/core';
import { WorkOrderDraft, validateWorkOrder } from '../domain/work-order-rules';
import { decodeWorkOrders } from '../domain/stored-work-orders';
import { ScheduleData } from '../domain/work-order';
import { createSampleData } from './sample-data';

export const WORK_ORDERS_STORAGE_KEY = 'naologic.work-orders.v1';

@Injectable({ providedIn: 'root' })
export class WorkOrderDataService {
  // Use the user's local calendar day; toISOString() could select an adjacent UTC date.
  private readonly today = new Date();
  private readonly anchorDate = [
    this.today.getFullYear(),
    String(this.today.getMonth() + 1).padStart(2, '0'),
    String(this.today.getDate()).padStart(2, '0'),
  ].join('-');
  private readonly state = signal(createSampleData(this.anchorDate));
  readonly schedule = this.state.asReadonly();

  private readonly warning = signal<string | null>(null);
  readonly persistenceWarning = this.warning.asReadonly();

  constructor() {
    try {
      const stored = localStorage.getItem(WORK_ORDERS_STORAGE_KEY);
      if (stored === null) return;
      const orders = decodeWorkOrders(JSON.parse(stored), this.state().workCenters);
      if (orders === null) throw new Error('Invalid stored orders');
      this.state.set({ ...this.state(), workOrders: orders });
    } catch {
      this.warning.set('Saved orders could not be loaded. Sample data is shown.');
    }
  }

  private save(schedule: ScheduleData): void {
    this.state.set(schedule);
    try {
      localStorage.setItem(
        WORK_ORDERS_STORAGE_KEY,
        JSON.stringify({
          version: 1,
          orders: schedule.workOrders,
        }),
      );
      this.warning.set(null);
    } catch {
      this.warning.set('Changes are available in this tab but could not be saved for refresh.');
    }
  }

  create(draft: WorkOrderDraft): string | null {
    const schedule = this.state();
    if (!schedule.workCenters.some((center) => center.docId === draft.workCenterId))
      return 'Select a valid work center.';
    const error = validateWorkOrder(draft, schedule.workOrders);
    if (error) return error;
    this.save({
      ...schedule,
      workOrders: [
        ...schedule.workOrders,
        {
          docId: crypto.randomUUID(),
          docType: 'workOrder',
          data: { ...draft, name: draft.name.trim() },
        },
      ],
    });
    return null;
  }

  update(orderId: string, changes: Omit<WorkOrderDraft, 'workCenterId'>): string | null {
    const schedule = this.state();
    const existing = schedule.workOrders.find((order) => order.docId === orderId);
    if (!existing) return 'This work order no longer exists.';
    const draft = { ...changes, workCenterId: existing.data.workCenterId };
    const error = validateWorkOrder(draft, schedule.workOrders, orderId);
    if (error) return error;
    this.save({
      ...schedule,
      workOrders: schedule.workOrders.map((order) =>
        order.docId === orderId ? { ...order, data: { ...draft, name: draft.name.trim() } } : order,
      ),
    });
    return null;
  }

  delete(orderId: string): void {
    const schedule = this.state();
    const workOrders = schedule.workOrders.filter((order) => order.docId !== orderId);
    if (workOrders.length !== schedule.workOrders.length) this.save({ ...schedule, workOrders });
  }
}
