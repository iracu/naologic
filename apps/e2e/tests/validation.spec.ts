import { expect, test, prepareSchedule, action, clickEmptyDay } from './support/schedule';

test.beforeEach(async ({ page }) => prepareSchedule(page));

test('invalid and overlapping Create/Edit submissions stay open without mutating orders', async ({
  page,
}) => {
  await clickEmptyDay(page, 'Extrusion Line A', '2026-10-23');
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.getByText('Work order name is required.', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'Work Order Name', exact: true }).fill('Conflict');
  await page.getByRole('textbox', { name: 'End Date', exact: true }).fill('10.23.2026');
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.getByText('End date must be after start date.', { exact: true })).toBeVisible();
  await page.getByRole('textbox', { name: 'End Date', exact: true }).fill('10.30.2026');
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('overlaps');
  await expect(page.locator('app-work-order-bar')).toHaveCount(8);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await action(page, 'Precision shaft machining', 'Edit');
  await page.getByRole('textbox', { name: 'End Date', exact: true }).fill('10.31.2026');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('overlaps');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(
    page.getByRole('button', { name: /Actions for Precision shaft machining/ }),
  ).toHaveAttribute('aria-label', /2026-10-23 to 2026-10-28/);
  await expect(page.locator('app-work-order-bar')).toHaveCount(8);
});

for (const invalidDate of ['', '02.29.2026', '13.01.2026']) {
  test(`rejects missing or invalid calendar date: ${invalidDate || 'empty'}`, async ({ page }) => {
    await clickEmptyDay(page, 'Quality Control', '2026-10-27');
    await page
      .getByRole('textbox', { name: 'Work Order Name', exact: true })
      .fill('Date validation');
    for (const field of ['Start Date', 'End Date']) {
      const input = page.getByRole('textbox', { name: field, exact: true });
      const original = await input.inputValue();
      await input.fill(invalidDate);
      await page.getByRole('button', { name: 'Create', exact: true }).click();
      await expect(input).toHaveAttribute('aria-invalid', 'true');
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page.locator('app-work-order-bar')).toHaveCount(8);
      await input.fill(original);
    }
  });
}

test('whitespace-only name cannot create an order', async ({ page }) => {
  await clickEmptyDay(page, 'Quality Control', '2026-10-27');
  await page.getByRole('textbox', { name: 'Work Order Name', exact: true }).fill('   ');
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.getByText('Work order name is required.', { exact: true })).toBeVisible();
  await expect(page.locator('app-work-order-bar')).toHaveCount(8);
});

test('inclusive endpoint conflict is rejected but the next calendar day is allowed', async ({
  page,
}) => {
  await clickEmptyDay(page, 'Quality Control', '2026-10-27');
  await page.getByRole('textbox', { name: 'Work Order Name', exact: true }).fill('Boundary order');
  await page.getByRole('textbox', { name: 'Start Date', exact: true }).fill('10.22.2026');
  await page.getByRole('textbox', { name: 'End Date', exact: true }).fill('10.23.2026');
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('overlaps');
  await expect(page.locator('app-work-order-bar')).toHaveCount(8);
  await page.getByRole('textbox', { name: 'Start Date', exact: true }).fill('10.23.2026');
  await page.getByRole('textbox', { name: 'End Date', exact: true }).fill('10.24.2026');
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  // These dates overlap CNC/Extrusion orders, which belong to other centers.
  await expect(page.locator('app-work-order-bar')).toHaveCount(9);
});

test('saving unchanged dates excludes the edited order and preserves its ID', async ({ page }) => {
  await action(page, 'Precision shaft machining', 'Edit');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('app-work-order-bar')).toHaveCount(8);
  const stored = await page.evaluate(() => localStorage.getItem('naologic.work-orders.v1'));
  expect(stored).not.toBeNull();
  const data: { orders: { docId: string; data: { name: string } }[] } = JSON.parse(stored ?? '{}');
  expect(data.orders.filter((order) => order.data.name === 'Precision shaft machining')).toEqual([
    expect.objectContaining({ docId: 'wo-3' }),
  ]);
});
