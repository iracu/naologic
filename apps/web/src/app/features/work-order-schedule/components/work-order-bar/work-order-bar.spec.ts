import { TestBed } from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { WorkOrderBar, WorkOrderAction } from './work-order-bar';
import { WorkOrderDocument } from '../../domain/work-order';

const order: WorkOrderDocument = {
  docId: 'order-1',
  docType: 'workOrder',
  data: {
    name: 'Test order',
    workCenterId: 'wc-1',
    status: 'in-progress',
    startDate: '2026-10-25',
    endDate: '2026-10-27',
  },
};

describe('work order bar', () => {
  it.each([
    ['open', 'Open'],
    ['in-progress', 'In Progress'],
    ['complete', 'Complete'],
    ['blocked', 'Blocked'],
  ] as const)('renders %s with a text badge', async (status, label) => {
    const fixture = TestBed.createComponent(WorkOrderBar);
    fixture.componentRef.setInput('order', { ...order, data: { ...order.data, status } });
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.name')?.textContent).toBe('Test order');
    expect(element.querySelector('.badge')?.textContent).toBe(label);
    expect(element.querySelector('button')?.getAttribute('aria-label')).toContain(label);
  });

  it('opens from keyboard, navigates, emits only an action, and restores focus on Escape', async () => {
    const fixture = TestBed.createComponent(WorkOrderBar);
    fixture.componentRef.setInput('order', order);
    const actions: WorkOrderAction[] = [];
    fixture.componentInstance.action.subscribe((event) => actions.push(event));
    await fixture.whenStable();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const overlay = TestBed.inject(OverlayContainer).getContainerElement();
    trigger.focus();
    trigger.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true }),
    );
    await fixture.whenStable();
    const items = overlay.querySelectorAll<HTMLButtonElement>('[role="menuitem"]');
    expect(items).toHaveLength(2);
    expect(document.activeElement).toBe(items[0]);
    items[0].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40, bubbles: true }),
    );
    expect(document.activeElement).toBe(items[1]);
    items[1].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }),
    );
    await fixture.whenStable();
    expect(actions).toEqual([{ type: 'delete', orderId: 'order-1' }]);
    expect(order.data.name).toBe('Test order');
    trigger.click();
    await fixture.whenStable();
    overlay
      .querySelector<HTMLElement>('[role="menuitem"]')
      ?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', keyCode: 27, bubbles: true }));
    await fixture.whenStable();
    expect(overlay.querySelector('[role="menu"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    trigger.click();
    await fixture.whenStable();
    overlay.querySelector<HTMLButtonElement>('[role="menuitem"]')?.click();
    await fixture.whenStable();
    expect(actions[1]).toEqual({ type: 'edit', orderId: 'order-1' });
  });
});
