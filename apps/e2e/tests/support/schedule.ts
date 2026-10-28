import { expect, test, type Page } from '@playwright/test';
export async function prepareSchedule(page: Page) {
  await page.clock.setFixedTime(new Date('2026-10-26T12:00:00Z'));
  await page.goto('/');
  await expect(page.locator('app-work-order-bar')).toHaveCount(8);
  await expect(page.locator('.timeline-scale .ng-value-label')).toHaveText('Month');
  await expect(page.locator('th[data-date]')).toHaveCount(13);
  // Interaction scenarios below use individual dates; select Day explicitly.
  await page.locator('app-timeline-toolbar .ng-arrow-wrapper').click();
  await page.getByRole('option', { name: 'Day', exact: true }).click();
  await expect(page.locator('th[data-date]')).toHaveCount(29);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}
export async function action(page: Page, name: string, actionName: 'Edit' | 'Delete') {
  await expect(page.getByRole('dialog')).toHaveCount(0);
  const bar = page
    .locator('app-work-order-bar')
    .filter({ has: page.getByText(name, { exact: true }) });
  await bar.getByRole('button').press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Delete', exact: true })).toBeVisible();
  await page.getByRole('menuitem', { name: actionName, exact: true }).press('Enter');
}
export async function clickEmptyDay(page: Page, center: string, day: string, expectedDate = day) {
  const header = page.locator(`th[data-date="${day}"]`);
  const row = page
    .getByRole('row')
    .filter({ has: page.getByRole('rowheader', { name: center, exact: true }) });
  const dateBox = await header.boundingBox();
  const rowBox = await row.boundingBox();
  if (!dateBox || !rowBox) throw new Error('Timeline geometry unavailable');
  await page.mouse.click(dateBox.x + dateBox.width / 2, rowBox.y + rowBox.height / 2);
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Start Date', exact: true })).toHaveValue(
    expectedDate.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2.$3.$1'),
  );
}
export { expect, test };
