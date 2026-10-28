import { DOCUMENT } from '@angular/common';
import { WorkOrderAction } from './components/work-order-bar/work-order-bar';
import {
  WorkOrderPanel,
  WorkOrderPanelContext,
} from './components/work-order-panel/work-order-panel';
import { CreateOrderContext } from './domain/work-order-rules';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  Injector,
  signal,
  viewChild,
} from '@angular/core';
import { WorkOrderDataService } from './data-access/work-order-data.service';
import { createTimelineColumns, localCalendarDate, TimelineScale } from './domain/timeline';
import { TimelineGrid } from './components/timeline-grid/timeline-grid';
import { TimelineToolbar } from './components/timeline-toolbar/timeline-toolbar';

@Component({
  selector: 'app-work-order-schedule',
  imports: [TimelineToolbar, TimelineGrid, WorkOrderPanel],
  templateUrl: './work-order-schedule.html',
  styleUrl: './work-order-schedule.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrderSchedule {
  private readonly document = inject(DOCUMENT);
  private readonly data = inject(WorkOrderDataService);
  private readonly injector = inject(Injector);
  private readonly grid = viewChild(TimelineGrid);
  readonly panelContext = signal<WorkOrderPanelContext | null>(null);
  openCreate(context: CreateOrderContext): void {
    this.panelContext.set({ mode: 'create', ...context });
  }

  closePanel(): void {
    this.panelContext.set(null);
    afterNextRender(
      () => {
        // Saving dates outside the grid can remove the native dialog's return-focus target.
        if (this.document.activeElement === this.document.body) this.grid()?.focusViewport();
      },
      { injector: this.injector },
    );
  }

  handleOrderAction(action: WorkOrderAction): void {
    if (action.type === 'delete') {
      this.data.delete(action.orderId);
      // The deleted menu trigger no longer exists; give keyboard users a stable target.
      afterNextRender(() => this.grid()?.focusViewport(), { injector: this.injector });
      return;
    }
    const order = this.orders().find((order) => order.docId === action.orderId);
    if (order) this.panelContext.set({ mode: 'edit', order });
  }

  readonly persistenceWarning = this.data.persistenceWarning;
  readonly extraBefore = signal(0);
  readonly extraAfter = signal(0);

  changeScale(scale: TimelineScale): void {
    this.extraBefore.set(0);
    this.extraAfter.set(0);
    this.scale.set(scale);
  }

  extendRange(direction: 'before' | 'after'): void {
    const count = this.scale() === 'day' ? 14 : this.scale() === 'week' ? 8 : 6;
    (direction === 'before' ? this.extraBefore : this.extraAfter).update((value) => value + count);
  }

  goToToday(): void {
    this.grid()?.centerToday();
  }

  readonly centers = computed(() => this.data.schedule().workCenters);
  readonly orders = computed(() => this.data.schedule().workOrders);
  readonly today = signal(localCalendarDate(new Date()));

  constructor() {
    let timer: ReturnType<typeof setTimeout>;
    const refresh = () => {
      clearTimeout(timer);
      const now = new Date();
      this.today.set(localCalendarDate(now));
      // Construct local midnight to account for 23/25-hour daylight-saving days.
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      timer = setTimeout(refresh, midnight.getTime() - now.getTime());
    };
    const onVisibility = () => {
      if (this.document.visibilityState === 'visible') refresh();
    };
    refresh();
    this.document.addEventListener('visibilitychange', onVisibility);
    inject(DestroyRef).onDestroy(() => {
      clearTimeout(timer);
      this.document.removeEventListener('visibilitychange', onVisibility);
    });
  }
  readonly scale = signal<TimelineScale>('month');
  readonly columns = computed(() =>
    createTimelineColumns(this.today(), this.scale(), this.extraBefore(), this.extraAfter()),
  );
}
