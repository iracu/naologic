import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { TimelineScale } from '../../domain/timeline';

@Component({
  selector: 'app-timeline-toolbar',
  imports: [ReactiveFormsModule, NgSelectComponent],
  templateUrl: './timeline-toolbar.html',
  styleUrl: './timeline-toolbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineToolbar {
  readonly scaleChange = output<TimelineScale>();
  readonly control = new FormControl<TimelineScale>('day', { nonNullable: true });
  readonly scales = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];
}
