import { Injectable, signal } from '@angular/core';
import { createSampleData } from './sample-data';

@Injectable({ providedIn: 'root' })
export class WorkOrderDataService {
  // Use the user's local calendar day; toISOString() could select an adjacent UTC date.
  private readonly today = new Date();
  private readonly anchorDate = [
    this.today.getFullYear(),
    String(this.today.getMonth() + 1).padStart(2, '0'),
    String(this.today.getDate()).padStart(2, '0'),
  ].join('-');
  private readonly state = signal(createSampleData(this.anchorDate));
  readonly schedule = this.state.asReadonly();
}
