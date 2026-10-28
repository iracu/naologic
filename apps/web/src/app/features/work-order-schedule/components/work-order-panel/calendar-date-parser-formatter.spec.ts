import { CalendarDateParserFormatter } from './calendar-date-parser-formatter';

describe('calendar display format', () => {
  const formatter = new CalendarDateParserFormatter();
  it('formats Sketch month.day.year dates with leading zeroes', () => {
    expect(formatter.format({ year: 2026, month: 1, day: 2 })).toBe('01.02.2026');
    expect(formatter.format(null)).toBe('');
  });
  it('parses leap days and rejects invalid or ambiguous dates', () => {
    expect(formatter.parse('02.29.2028')).toEqual({ year: 2028, month: 2, day: 29 });
    for (const value of ['02.29.2026', '04.31.2026', '13.01.2026', '2026-01-02', '', '1.2.2026']) {
      expect(formatter.parse(value)).toBeNull();
    }
  });
});
