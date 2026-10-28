import { Injectable } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CalendarDateAdapter } from './calendar-date-adapter';

/** Sketch's display format is independent of the ISO calendar-string model. */
@Injectable()
export class CalendarDateParserFormatter extends NgbDateParserFormatter {
  private readonly adapter = new CalendarDateAdapter();

  parse(value: string): NgbDateStruct | null {
    const match = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value.trim());
    if (!match) return null;
    return this.adapter.fromModel(`${match[3]}-${match[1]}-${match[2]}`);
  }

  format(date: NgbDateStruct | null): string {
    const value = this.adapter.toModel(date);
    if (!value) return '';
    const [year, month, day] = value.split('-');
    return `${month}.${day}.${year}`;
  }
}
