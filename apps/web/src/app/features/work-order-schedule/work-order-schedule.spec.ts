import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgSelectComponent } from '@ng-select/ng-select';
import { WorkOrderSchedule } from './work-order-schedule';

describe('timeline zoom integration', () => {
  it('switches headers and retains the same work centers through ng-select', async () => {
    const fixture = TestBed.createComponent(WorkOrderSchedule);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const centers = () =>
      Array.from(element.querySelectorAll('tbody th'), (cell) => cell.textContent);
    const initialCenters = centers();
    const select = fixture.debugElement.query(By.directive(NgSelectComponent))
      .componentInstance as NgSelectComponent;
    for (const [scale, count] of [
      ['week', 19],
      ['month', 13],
      ['day', 29],
    ] as const) {
      const item = select.itemsList.items.find((option) => option.value.value === scale);
      if (!item) throw new Error('Missing timescale option');
      select.select(item);
      await fixture.whenStable();
      expect(element.querySelectorAll('th[data-date]')).toHaveLength(count);
      expect(centers()).toEqual(initialCenters);
      expect(element.querySelectorAll('app-work-order-bar')).toHaveLength(8);
      expect(element.querySelector('[aria-label^="Today,"]')).not.toBeNull();
    }
  });
});
