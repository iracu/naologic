beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

import { OverlayContainer } from '@angular/cdk/overlay';
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
    expect(fixture.componentInstance.scale()).toBe('month');
    expect(element.querySelector('.timeline-scale .ng-value-label')?.textContent).toBe('Month');
    expect(element.querySelectorAll('th[data-date]')).toHaveLength(13);
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
  it('deletes through the menu and returns focus to the timeline', async () => {
    const fixture = TestBed.createComponent(WorkOrderSchedule);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    element.querySelector<HTMLButtonElement>('app-work-order-bar .actions')?.click();
    await fixture.whenStable();
    const items = TestBed.inject(OverlayContainer)
      .getContainerElement()
      .querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    items[1].click();
    await fixture.whenStable();
    expect(element.querySelectorAll('app-work-order-bar')).toHaveLength(7);
    expect(element.textContent).not.toContain('Aluminium profile batch');
    expect(document.activeElement).toBe(element.querySelector('.viewport'));
    expect(element.querySelector('dialog')).toBeNull();
  });
});

describe('current calendar day', () => {
  afterEach(() => vi.useRealTimers());

  it('refreshes at local midnight and releases its timer on destroy', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 27, 23, 59, 59));
    const fixture = TestBed.createComponent(WorkOrderSchedule);
    expect(fixture.componentInstance.today()).toBe('2026-10-27');
    vi.advanceTimersByTime(1000);
    expect(fixture.componentInstance.today()).toBe('2026-10-28');
    fixture.destroy();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('refreshes after a suspended tab becomes visible', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 27, 12));
    const fixture = TestBed.createComponent(WorkOrderSchedule);
    const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    vi.setSystemTime(new Date(2026, 9, 29, 12));
    document.dispatchEvent(new Event('visibilitychange'));
    expect(fixture.componentInstance.today()).toBe('2026-10-29');
    fixture.destroy();
    visibility.mockRestore();
  });
});
