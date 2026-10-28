import { CreateOrderContext } from '../../domain/work-order-rules';
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import {
  centeredScrollLeft,
  dateAtColumnPosition,
  dateColumnPosition,
  workOrderBarPosition,
  TimelineColumn,
  TimelineScale,
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
  readonly scale = input<TimelineScale>('day');
  readonly extendRange = output<'before' | 'after'>();
  private previousColumns: readonly TimelineColumn[] = [];
  private previousScale: TimelineScale | undefined;
  private extending = false;

  readonly hover = signal<{ centerId: string; left: number } | null>(null);

  previewDate(event: MouseEvent, centerId: string): void {
    const target = event.currentTarget;
    if (!(target instanceof HTMLElement)) return;
    const bounds = target.getBoundingClientRect();
    this.hover.set({
      centerId,
      left: Math.max(0, Math.min(bounds.width - 113, event.clientX - bounds.left - 56.5)),
    });
  }

  onScroll(): void {
    this.hover.set(null);
    const viewport = this.viewport()?.nativeElement;
    if (!viewport || this.extending) return;
    const width = viewport.querySelector<HTMLElement>('th[data-date]')?.offsetWidth ?? 0;
    if (!width) return;
    const remaining = viewport.scrollWidth - viewport.clientWidth - viewport.scrollLeft;
    if (viewport.scrollLeft < width * 2 || remaining < width * 2) {
      this.extending = true;
      this.extendRange.emit(viewport.scrollLeft < width * 2 ? 'before' : 'after');
    }
  }

  centerToday(): void {
    const position = this.todayPosition();
    const viewport = this.viewport()?.nativeElement;
    if (position === null || !viewport) return;
    const sidebar = viewport.querySelector<HTMLElement>('th')?.offsetWidth ?? 0;
    const width = viewport.querySelector<HTMLElement>('th[data-date]')?.offsetWidth ?? 0;
    viewport.scrollLeft = centeredScrollLeft(
      position * width,
      viewport.clientWidth,
      sidebar,
      this.columns().length * width,
    );
  }

  readonly centers = input.required<readonly WorkCenterDocument[]>();
  readonly orders = input.required<readonly WorkOrderDocument[]>();
  readonly createOrder = output<CreateOrderContext>();
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

  focusViewport(): void {
    this.viewport()?.nativeElement.focus({ preventScroll: true });
  }

  selectEmptyDate(event: MouseEvent, workCenterId: string): void {
    const track = event.currentTarget;
    // Bar/menu clicks must never start a new order.
    if (!(track instanceof HTMLElement) || event.target !== track) return;
    const bounds = track.getBoundingClientRect();
    const date =
      event.detail === 0
        ? this.today()
        : dateAtColumnPosition(
            (event.clientX - bounds.left) / (bounds.width / this.columns().length),
            this.columns(),
          );
    if (date) this.createOrder.emit({ workCenterId, startDate: date });
    this.viewport()?.nativeElement.focus({ preventScroll: true });
  }

  constructor() {
    afterRenderEffect(() => {
      const columns = this.columns();
      const scale = this.scale();
      const viewport = this.viewport()?.nativeElement;
      if (!viewport) return;
      if (this.previousScale !== scale) {
        this.centerToday();
      } else if (this.previousColumns.length && columns !== this.previousColumns) {
        // Restore the old first column's pixel position after prepending.
        const added = columns.findIndex((column) => column.start === this.previousColumns[0].start);
        const width = viewport.querySelector<HTMLElement>('th[data-date]')?.offsetWidth ?? 0;
        if (added > 0) viewport.scrollLeft += added * width;
      }
      this.previousColumns = columns;
      this.previousScale = scale;
      this.extending = false;
    });
  }
}
