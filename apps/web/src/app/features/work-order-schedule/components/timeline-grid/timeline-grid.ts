import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  viewChild,
} from '@angular/core';
import {
  centeredScrollLeft,
  dateColumnPosition,
  workOrderBarPosition,
  TimelineColumn,
} from '../../domain/timeline';
import { WorkOrderBar, WorkOrderAction } from '../work-order-bar/work-order-bar';
import { WorkCenterDocument, WorkOrderDocument } from '../../domain/work-order';

@Component({
  selector: 'app-timeline-grid',
  imports: [WorkOrderBar],
  templateUrl: './timeline-grid.html',
  styleUrl: './timeline-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineGrid {
  readonly centers = input.required<readonly WorkCenterDocument[]>();
  readonly orders = input.required<readonly WorkOrderDocument[]>();
  readonly orderAction = output<WorkOrderAction>();
  readonly rows = computed(() =>
    this.centers().map((center) => ({
      center,
      bars: this.orders()
        .filter((order) => order.data.workCenterId === center.docId)
        .flatMap((order) => {
          const position = workOrderBarPosition(
            order.data.startDate,
            order.data.endDate,
            this.columns(),
          );
          return position ? [{ order, position }] : [];
        }),
    })),
  );
  readonly columns = input.required<readonly TimelineColumn[]>();
  readonly today = input.required<string>();
  readonly todayPosition = computed(() => dateColumnPosition(this.today(), this.columns()));
  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');

  constructor() {
    afterRenderEffect(() => {
      const position = this.todayPosition();
      const viewport = this.viewport()?.nativeElement;
      if (position === null || !viewport) return;
      const sidebar = viewport.querySelector<HTMLElement>('th')?.offsetWidth ?? 0;
      const columnWidth = viewport.querySelector<HTMLElement>('th[data-date]')?.offsetWidth ?? 0;
      viewport.scrollLeft = centeredScrollLeft(
        position * columnWidth,
        viewport.clientWidth,
        sidebar,
        this.columns().length * columnWidth,
      );
    });
  }
}
