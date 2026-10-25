import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('application bootstrap', () => {
  it('renders the foundation shell', async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('main h1')?.textContent).toBe('Work Order Schedule');
  });
});
