import { ScheduleData, WorkOrderStatus } from '../domain/work-order';

/** Pure fixture factory: the caller supplies a calendar-date anchor for repeatable tests. */
export function createSampleData(anchorDate: string): ScheduleData {
  const anchor = new Date(`${anchorDate}T00:00:00.000Z`);
  if (!Number.isFinite(anchor.getTime()) || anchor.toISOString().slice(0, 10) !== anchorDate) {
    throw new Error('Sample anchor must be a valid YYYY-MM-DD calendar date.');
  }

  function dateAt(offset: number): string {
    const date = new Date(anchor);
    // UTC calendar arithmetic avoids daylight-saving shifts in date-only fixture values.
    date.setUTCDate(date.getUTCDate() + offset);
    return date.toISOString().slice(0, 10);
  }

  const names = [
    'Extrusion Line A',
    'CNC Machine 1',
    'Assembly Station',
    'Quality Control',
    'Packaging Line',
  ];
  const orders: readonly [string, number, WorkOrderStatus, number, number][] = [
    ['Aluminium profile batch', 1, 'complete', -12, -8],
    ['Window frame extrusion', 1, 'in-progress', -2, 3],
    ['Precision shaft machining', 2, 'in-progress', -3, 2],
    ['Valve housing machining', 2, 'open', 5, 10],
    ['Pump assembly', 3, 'blocked', -1, 6],
    ['Motor assembly', 3, 'open', 9, 14],
    ['Incoming material inspection', 4, 'complete', -7, -4],
    ['Export shipment packaging', 5, 'open', 2, 7],
  ];
  return {
    workCenters: names.map((name, index) => ({
      docId: `wc-${index + 1}`,
      docType: 'workCenter',
      data: { name },
    })),
    workOrders: orders.map(([name, center, status, start, end], index) => ({
      docId: `wo-${index + 1}`,
      docType: 'workOrder',
      data: {
        name,
        workCenterId: `wc-${center}`,
        status,
        startDate: dateAt(start),
        endDate: dateAt(end),
      },
    })),
  };
}
