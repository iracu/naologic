import { WorkOrderDocument, WorkCenterDocument } from './work-order';
import { validateWorkOrder } from './work-order-rules';

/** Stored data is untrusted. Reject the whole snapshot rather than silently losing orders. */
export function decodeWorkOrders(
  value: unknown,
  centers: readonly WorkCenterDocument[],
): readonly WorkOrderDocument[] | null {
  if (
    !value ||
    typeof value !== 'object' ||
    !('version' in value) ||
    value.version !== 1 ||
    !('orders' in value) ||
    !Array.isArray(value.orders)
  )
    return null;
  const result: WorkOrderDocument[] = [];
  for (const order of value.orders) {
    if (
      !order ||
      typeof order !== 'object' ||
      typeof order.docId !== 'string' ||
      !order.docId ||
      order.docType !== 'workOrder' ||
      !order.data ||
      typeof order.data !== 'object'
    )
      return null;
    const data = order.data;
    if (
      typeof data.name !== 'string' ||
      typeof data.status !== 'string' ||
      typeof data.workCenterId !== 'string' ||
      typeof data.startDate !== 'string' ||
      typeof data.endDate !== 'string' ||
      !centers.some((center) => center.docId === data.workCenterId) ||
      result.some((existing) => existing.docId === order.docId)
    )
      return null;
    // Runtime shape checks above and domain validation below guard this boundary.
    const candidate = order as WorkOrderDocument;
    if (validateWorkOrder(candidate.data, result)) return null;
    result.push({ docId: candidate.docId, docType: 'workOrder', data: { ...candidate.data } });
  }
  return result;
}
