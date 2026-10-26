export type WorkOrderStatus = 'open' | 'in-progress' | 'complete' | 'blocked';

export interface WorkCenterDocument {
  readonly docId: string;
  readonly docType: 'workCenter';
  readonly data: { readonly name: string };
}

export interface WorkOrderDocument {
  readonly docId: string;
  readonly docType: 'workOrder';
  readonly data: {
    readonly name: string;
    readonly workCenterId: string;
    readonly status: WorkOrderStatus;
    /** Calendar dates in YYYY-MM-DD format, without a time or timezone. */
    readonly startDate: string;
    readonly endDate: string;
  };
}

export interface ScheduleData {
  readonly workCenters: readonly WorkCenterDocument[];
  readonly workOrders: readonly WorkOrderDocument[];
}
