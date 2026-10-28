import { expect, test, prepareSchedule, action, clickEmptyDay } from './support/schedule';

test.beforeEach(async ({ page }) => prepareSchedule(page));

test('Create, Edit and Delete persist across refreshes', async ({ page }) => {
  await clickEmptyDay(page, 'Quality Control', '2026-10-27');
  await page
    .getByRole('textbox', { name: 'Work Order Name', exact: true })
    .fill('Persistent order');
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('app-work-order-bar')).toHaveCount(9);
  await action(page, 'Persistent order', 'Edit');
  await page
    .getByRole('textbox', { name: 'Work Order Name', exact: true })
    .fill('Persistent revision');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.reload();
  await action(page, 'Persistent revision', 'Delete');
  await expect(page.locator('app-work-order-bar')).toHaveCount(8);
  await page.reload();
  await expect(page.locator('app-work-order-bar')).toHaveCount(8);
  await expect(page.getByRole('button', { name: /Actions for Persistent/ })).toHaveCount(0);
});

test('invalid stored data recovers to usable sample orders', async ({ page }) => {
  await page.evaluate(() => localStorage.setItem('naologic.work-orders.v1', '{broken'));
  await page.reload();
  await expect(page.getByRole('status', { name: 'Order persistence' })).toContainText(
    'could not be loaded',
  );
  await expect(page.locator('app-work-order-bar')).toHaveCount(8);
  await action(page, 'Precision shaft machining', 'Delete');
  await expect(page.getByRole('status', { name: 'Order persistence' })).toHaveCount(0);
  await page.reload();
  await expect(page.locator('app-work-order-bar')).toHaveCount(7);
});
