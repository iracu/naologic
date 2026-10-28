beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

import { OverlayContainer } from '@angular/cdk/overlay';
import { WorkOrderSchedule } from '../../work-order-schedule';
import { TestBed } from '@angular/core/testing';
import { WorkOrderPanel } from './work-order-panel';
import { WorkOrderDataService } from '../../data-access/work-order-data.service';
import { CalendarDateAdapter } from './calendar-date-adapter';

describe('work order panel', () => {
  // jsdom does not implement the browser's top-layer dialog methods.
  beforeAll(() => {
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.open = true;
      },
    });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.open = false;
      },
    });
  });
  afterAll(() => {
    Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal');
    Reflect.deleteProperty(HTMLDialogElement.prototype, 'close');
  });
  beforeEach(() => {
    vi.spyOn(HTMLDialogElement.prototype, 'showModal').mockImplementation(function (
      this: HTMLDialogElement,
    ) {
      this.open = true;
    });
    vi.spyOn(HTMLDialogElement.prototype, 'close').mockImplementation(function (
      this: HTMLDialogElement,
    ) {
      this.open = false;
    });
  });
  afterEach(() => vi.restoreAllMocks());
  async function setup() {
    const fixture = TestBed.createComponent(WorkOrderPanel);
    fixture.componentRef.setInput('context', {
      mode: 'create',
      workCenterId: 'wc-1',
      startDate: '2050-01-01',
    });
    await fixture.whenStable();
    return fixture;
  }
  it('prefills dates/status and rejects missing name, missing dates and invalid ranges', async () => {
    const fixture = await setup();
    const panel = fixture.componentInstance;
    expect(panel.form.getRawValue()).toEqual({
      name: '',
      status: 'open',
      startDate: '2050-01-01',
      endDate: '2050-01-08',
    });
    panel.submit();
    expect(panel.form.invalid).toBe(true);
    panel.form.patchValue({ name: 'Order', endDate: '2050-01-01' });
    expect(panel.form.hasError('dateRange')).toBe(true);
    panel.form.patchValue({ endDate: null });
    expect(panel.form.controls.endDate.hasError('required')).toBe(true);
    expect(TestBed.inject(WorkOrderDataService).schedule().workOrders).toHaveLength(8);
  });
  it('shows overlaps and creates only after a valid submission', async () => {
    const fixture = await setup();
    const panel = fixture.componentInstance;
    const service = TestBed.inject(WorkOrderDataService);
    panel.form.patchValue({ ...service.schedule().workOrders[0].data, name: 'Conflict' });
    panel.submit();
    expect(panel.error()).toContain('overlaps');
    expect(service.schedule().workOrders).toHaveLength(8);
    const closed = vi.fn();
    panel.dismissed.subscribe(closed);
    panel.form.patchValue({ startDate: '2050-01-01', endDate: '2050-01-08' });
    panel.submit();
    expect(service.schedule().workOrders).toHaveLength(9);
    expect(closed).toHaveBeenCalledOnce();
  });
  it('Cancel and outside dismissal discard entered values; a new context resets the form', async () => {
    const fixture = await setup();
    const panel = fixture.componentInstance;
    panel.form.controls.name.setValue('Discard');
    const closed = vi.fn();
    panel.dismissed.subscribe(closed);
    const element: HTMLElement = fixture.nativeElement;
    element.querySelector<HTMLButtonElement>('button[type="button"]')?.click();
    expect(closed).toHaveBeenCalledOnce();
    expect(TestBed.inject(WorkOrderDataService).schedule().workOrders).toHaveLength(8);
    fixture.componentRef.setInput('context', {
      mode: 'create',
      workCenterId: 'wc-2',
      startDate: '2050-02-01',
    });
    await fixture.whenStable();
    expect(element.querySelector('dialog')?.open).toBe(true);
    expect(panel.form.controls.name.value).toBe('');
    expect(panel.form.controls.endDate.value).toBe('2050-02-08');
    element
      .querySelector('dialog')
      ?.dispatchEvent(new MouseEvent('click', { clientX: -1, bubbles: true }));
    expect(closed).toHaveBeenCalledTimes(2);
  });
  it('creates from a scrolled row click and immediately renders the order in that row', async () => {
    const fixture = TestBed.createComponent(WorkOrderSchedule);
    fixture.componentInstance.scale.set('day');
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const slot = element.querySelectorAll<HTMLButtonElement>('.create-slot')[3];
    // A horizontally scrolled canvas begins outside the viewport.
    vi.spyOn(slot, 'getBoundingClientRect').mockReturnValue(new DOMRect(-1000, 0, 29 * 114, 48));
    slot.dispatchEvent(
      new MouseEvent('click', { bubbles: true, detail: 1, clientX: -1000 + 14.5 * 114 }),
    );
    await fixture.whenStable();
    const start = element.querySelector<HTMLInputElement>('#order-start');
    expect(start?.value).toBe(
      fixture.componentInstance.today().replace(/(\d{4})-(\d{2})-(\d{2})/, '$2.$3.$1'),
    );
    const name = element.querySelector<HTMLInputElement>('#order-name');
    if (!name) throw new Error('Create panel did not open');
    name.value = 'Created from timeline';
    name.dispatchEvent(new Event('input', { bubbles: true }));
    element
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(element.querySelector('dialog')).toBeNull();
    expect(element.querySelectorAll('app-work-order-bar')).toHaveLength(9);
    expect(element.querySelectorAll('tbody tr')[3].textContent).toContain('Created from timeline');
    expect(TestBed.inject(WorkOrderDataService).schedule().workOrders[8].data.workCenterId).toBe(
      'wc-4',
    );
  });

  it('bar clicks do not open Create; Escape dismisses without creating', async () => {
    const fixture = TestBed.createComponent(WorkOrderSchedule);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    element.querySelector<HTMLElement>('.bar')?.click();
    await fixture.whenStable();
    expect(element.querySelector('dialog')).toBeNull();
    element.querySelector<HTMLButtonElement>('.create-slot')?.click();
    await fixture.whenStable();
    element.querySelector('dialog')?.dispatchEvent(new Event('cancel', { cancelable: true }));
    await fixture.whenStable();
    expect(element.querySelector('dialog')).toBeNull();
    expect(element.querySelectorAll('app-work-order-bar')).toHaveLength(8);
  });

  it('adapts only valid calendar dates without UTC conversions', () => {
    const adapter = new CalendarDateAdapter();
    expect(adapter.fromModel('2024-02-29')).toEqual({ year: 2024, month: 2, day: 29 });
    expect(adapter.toModel({ year: 2024, month: 2, day: 29 })).toBe('2024-02-29');
    expect(adapter.toModel({ year: 2026, month: 2, day: 29 })).toBeNull();
  });
  it('opens Edit through the actual menu, prefills all fields and saves to the same bar', async () => {
    const fixture = TestBed.createComponent(WorkOrderSchedule);
    await fixture.whenStable();
    const service = TestBed.inject(WorkOrderDataService);
    const original = service.schedule().workOrders[0];
    const element: HTMLElement = fixture.nativeElement;
    element.querySelector<HTMLButtonElement>('app-work-order-bar .actions')?.click();
    await fixture.whenStable();
    TestBed.inject(OverlayContainer)
      .getContainerElement()
      .querySelector<HTMLButtonElement>('[role="menuitem"]')
      ?.click();
    await fixture.whenStable();
    expect(element.querySelector('h2')?.textContent).toBe('Work Order Details');
    expect(element.querySelector('button[type="submit"]')?.textContent?.trim()).toBe('Save');
    expect(element.querySelector<HTMLInputElement>('#order-name')?.value).toBe(original.data.name);
    expect(element.querySelector<HTMLInputElement>('#order-start')?.value).toBe(
      original.data.startDate.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2.$3.$1'),
    );
    expect(element.querySelector<HTMLInputElement>('#order-end')?.value).toBe(
      original.data.endDate.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2.$3.$1'),
    );
    expect(element.querySelector('app-work-order-panel ng-select')?.textContent).toContain(
      'Complete',
    );
    const name = element.querySelector<HTMLInputElement>('#order-name');
    if (!name) throw new Error('Edit panel missing');
    name.value = 'Saved edit';
    name.dispatchEvent(new Event('input', { bubbles: true }));
    element
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(element.querySelector('dialog')).toBeNull();
    expect(element.querySelectorAll('app-work-order-bar')).toHaveLength(8);
    expect(element.querySelector('app-work-order-bar')?.textContent).toContain('Saved edit');
    expect(service.schedule().workOrders[0].docId).toBe(original.docId);
  });

  it('keeps conflicting edits open, then saves changed dates and status without creating a new order', async () => {
    const fixture = TestBed.createComponent(WorkOrderPanel);
    const service = TestBed.inject(WorkOrderDataService);
    const before = service.schedule();
    const [original, other] = before.workOrders;
    fixture.componentRef.setInput('context', { mode: 'edit', order: original });
    await fixture.whenStable();
    const panel = fixture.componentInstance;
    panel.form.patchValue({ startDate: other.data.startDate, endDate: other.data.endDate });
    panel.submit();
    expect(panel.error()).toContain('overlaps');
    expect(service.schedule()).toBe(before);
    panel.form.patchValue({
      startDate: '2050-01-01',
      endDate: '2050-01-08',
      status: 'in-progress',
    });
    panel.submit();
    expect(service.schedule().workOrders[0]).toEqual({
      ...original,
      data: {
        ...original.data,
        startDate: '2050-01-01',
        endDate: '2050-01-08',
        status: 'in-progress',
      },
    });
    expect(service.schedule().workOrders).toHaveLength(8);
  });

  it.each(['cancel', 'outside', 'escape'])(
    'discards edits on %s and resets Create defaults',
    async (dismissal) => {
      const fixture = TestBed.createComponent(WorkOrderPanel);
      const service = TestBed.inject(WorkOrderDataService);
      const before = service.schedule();
      fixture.componentRef.setInput('context', { mode: 'edit', order: before.workOrders[0] });
      await fixture.whenStable();
      fixture.componentInstance.form.patchValue({ name: 'Discard edit', status: 'blocked' });
      const element: HTMLElement = fixture.nativeElement;
      if (dismissal === 'cancel')
        element.querySelector<HTMLButtonElement>('button[type="button"]')?.click();
      else if (dismissal === 'outside')
        element
          .querySelector('dialog')
          ?.dispatchEvent(new MouseEvent('click', { clientX: -1, bubbles: true }));
      else
        element.querySelector('dialog')?.dispatchEvent(new Event('cancel', { cancelable: true }));
      expect(service.schedule()).toBe(before);
      fixture.componentRef.setInput('context', {
        mode: 'create',
        workCenterId: 'wc-2',
        startDate: '2050-01-01',
      });
      await fixture.whenStable();
      expect(fixture.componentInstance.form.getRawValue()).toEqual({
        name: '',
        status: 'open',
        startDate: '2050-01-01',
        endDate: '2050-01-08',
      });
      expect(element.querySelector('button[type="submit"]')?.textContent?.trim()).toBe('Create');
    },
  );
});
