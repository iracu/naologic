import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { isCalendarDate } from '../../domain/timeline';

/** Keep ng-bootstrap's date structs at the UI boundary; forms store calendar strings. */
@Injectable()
export class CalendarDateAdapter extends NgbDateAdapter<string> {
  fromModel(value: string | null): NgbDateStruct | null {
    if (!value || !isCalendarDate(value)) return null;
    const [year, month, day] = value.split('-').map(Number);
    return { year, month, day };
  }
  toModel(date: NgbDateStruct | null): string | null {
    if (!date) return null;
    const value = `${String(date.year).padStart(4, '0')}-${String(date.month).padStart(
      2,
      '0',
    )}-${String(date.day).padStart(2, '0')}`;
    return isCalendarDate(value) ? value : null;
  }
}
