import { addCalendarDays, isCalendarDate } from './timeline';
import { WorkOrderDocument, STATUS_LABELS } from './work-order';

export interface CreateOrderContext {
  readonly workCenterId: string;
  readonly startDate: string;
}
export type WorkOrderDraft = WorkOrderDocument['data'];
export function createOrderDefaults(context: CreateOrderContext): WorkOrderDraft {
  return { ...context, name: '', status: 'open', endDate: addCalendarDays(context.startDate, 7) };
}
export function validDateRange(start: string, end: string): boolean {
  return isCalendarDate(start) && isCalendarDate(end) && end > start;
}
/** Order endpoints are inclusive: sharing even one calendar day is a conflict. */
export function hasOrderOverlap(
  draft: WorkOrderDraft,
  orders: readonly WorkOrderDocument[],
  excludedOrderId?: string,
): boolean {
  return orders.some(
    (order) =>
      order.docId !== excludedOrderId &&
      order.data.workCenterId === draft.workCenterId &&
      draft.startDate <= order.data.endDate &&
      draft.endDate >= order.data.startDate,
  );
}
export function validateWorkOrder(
  draft: WorkOrderDraft,
  orders: readonly WorkOrderDocument[],
  excludedOrderId?: string,
): string | null {
  if (!draft.name.trim()) return 'Work order name is required.';
  if (!Object.hasOwn(STATUS_LABELS, draft.status)) return 'Status is required.';
  if (!isCalendarDate(draft.startDate) || !isCalendarDate(draft.endDate))
    return 'Enter valid start and end dates (YYYY-MM-DD).';
  if (!validDateRange(draft.startDate, draft.endDate)) return 'End date must be after start date.';
  if (hasOrderOverlap(draft, orders, excludedOrderId))
    return 'This work order overlaps an existing order on this work center. Choose different dates.';
  return null;
}
