import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WorkOrderSchedule } from './features/work-order-schedule/work-order-schedule';

@Component({
  selector: 'app-root',
  imports: [WorkOrderSchedule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
