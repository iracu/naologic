import { expect, test, prepareSchedule, action, clickEmptyDay } from './support/schedule';

test.beforeEach(async ({ page }) => prepareSchedule(page));

test('Create, Edit, zoom and Delete preserve application state', async ({ page }) => {
  await clickEmptyDay(page, 'Quality Control', '2026-10-27');
  await expect(page.locator('.date-control input').first()).toHaveAttribute('id', 'order-end');
  await expect(page.locator('.date-control input').last()).toHaveAttribute('id', 'order-start');
  await expect(page.getByRole('textbox', { name: 'End Date', exact: true })).toHaveValue(
    '11.03.2026',
  );
  await expect(page.getByRole('textbox', { name: 'Work Order Name', exact: true })).toBeFocused();
  await page
    .getByRole('textbox', { name: 'Work Order Name', exact: true })
    .fill('E2E quality order');
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('app-work-order-bar')).toHaveCount(9);
  await expect(
    page
      .getByRole('row')
      .filter({ has: page.getByRole('rowheader', { name: 'Quality Control', exact: true }) }),
  ).toContainText('E2E quality order');
  await action(page, 'E2E quality order', 'Edit');
  await expect(page.getByRole('textbox', { name: 'Work Order Name', exact: true })).toHaveValue(
    'E2E quality order',
  );
  await expect(page.getByRole('textbox', { name: 'Start Date', exact: true })).toHaveValue(
    '10.27.2026',
  );
  await page
    .getByRole('textbox', { name: 'Work Order Name', exact: true })
    .fill('Revised quality order');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('app-work-order-bar')).toHaveCount(9);
  for (const [scale, count] of [
    ['Week', 19],
    ['Month', 13],
    ['Day', 29],
  ] as const) {
    await page.locator('app-timeline-toolbar .ng-arrow-wrapper').click();
    await page.getByRole('option', { name: scale, exact: true }).click();
    await expect(page.locator('th[data-date]')).toHaveCount(count);
    await expect(page.locator('app-work-order-bar')).toHaveCount(9);
    await expect(
      page.getByRole('button', { name: /Actions for Revised quality order/ }),
    ).toHaveCount(1);
  }
  await action(page, 'Revised quality order', 'Delete');
  await expect(page.locator('app-work-order-bar')).toHaveCount(8);
  await expect(page.getByRole('button', { name: /Actions for Revised quality order/ })).toHaveCount(
    0,
  );
  await expect(page.getByRole('region')).toBeFocused();
});

for (const width of [1280, 390]) {
  test(`status selection at ${width}px retains fields and persists in Create and Edit`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page
      .getByRole('button', { name: /Create work order for Quality Control/ })
      .press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    const name = page.getByRole('textbox', { name: 'Work Order Name', exact: true });
    await name.fill('Status regression');
    const status = page.locator('app-work-order-panel ng-select');
    for (const label of ['In Progress', 'Complete', 'Blocked', 'Open']) {
      await status.locator('.ng-arrow-wrapper').click();
      await page.getByRole('option', { name: label, exact: true }).click();
      await expect(status.locator('.status-badge')).toHaveText(label);
      await expect(name).toHaveValue('Status regression');
    }
    await status.locator('.ng-arrow-wrapper').click();
    await page.getByRole('option', { name: 'Blocked', exact: true }).click();
    await page.getByRole('button', { name: 'Create', exact: true }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await action(page, 'Status regression', 'Edit');
    await expect(status.locator('.status-badge')).toHaveText('Blocked');
    await status.locator('.ng-arrow-wrapper').click();
    await page.getByRole('option', { name: 'Complete', exact: true }).click();
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.reload();
    await action(page, 'Status regression', 'Edit');
    await expect(status.locator('.status-badge')).toHaveText('Complete');
  });
}
