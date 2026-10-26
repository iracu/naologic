import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { WorkOrderDataService } from './data-access/work-order-data.service';
import { createTimelineColumns, localCalendarDate, TimelineScale } from './domain/timeline';
import { TimelineGrid } from './components/timeline-grid/timeline-grid';
import { TimelineToolbar } from './components/timeline-toolbar/timeline-toolbar';

@Component({
  selector: 'app-work-order-schedule',
  imports: [TimelineToolbar, TimelineGrid],
  templateUrl: './work-order-schedule.html',
  styleUrl: './work-order-schedule.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrderSchedule {
  private readonly data = inject(WorkOrderDataService);
  readonly centers = computed(() => this.data.schedule().workCenters);
  readonly orders = computed(() => this.data.schedule().workOrders);
  readonly today = localCalendarDate(new Date());
  readonly scale = signal<TimelineScale>('day');
  readonly columns = computed(() => createTimelineColumns(this.today, this.scale()));
}
