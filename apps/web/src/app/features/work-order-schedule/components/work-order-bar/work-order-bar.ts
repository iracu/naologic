import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { WorkOrderDocument, STATUS_LABELS } from '../../domain/work-order';

export interface WorkOrderAction {
  readonly type: 'edit' | 'delete';
  readonly orderId: string;
}

@Component({
  selector: 'app-work-order-bar',
  imports: [CdkMenu, CdkMenuItem, CdkMenuTrigger],
  templateUrl: './work-order-bar.html',
  styleUrl: './work-order-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkOrderBar {
  readonly order = input.required<WorkOrderDocument>();
  readonly action = output<WorkOrderAction>();
  readonly statusLabel = computed(() => STATUS_LABELS[this.order().data.status]);
  readonly description = computed(() => {
    const data = this.order().data;
    return `${data.name}, ${this.statusLabel()}, ${data.startDate} to ${data.endDate}`;
  });
  readonly menuPositions: ConnectedPosition[] = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 5 },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 5 },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -5 },
  ];
}
