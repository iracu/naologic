beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('application bootstrap', () => {
  it('renders the timeline and existing work centers', async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('tbody tr').length).toBe(5);
    expect(element.querySelectorAll('app-work-order-bar')).toHaveLength(8);
    expect(
      element.querySelectorAll('tbody tr')[0].querySelectorAll('app-work-order-bar'),
    ).toHaveLength(2);
    expect(element.querySelectorAll('th[data-date]').length).toBe(13);
    expect(element.querySelector('[aria-label^="Today,"]')).not.toBeNull();
    expect(element.querySelector('main h1')?.textContent).toBe('Work Orders');
  });
});
