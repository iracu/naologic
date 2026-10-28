import { expect, test, prepareSchedule, clickEmptyDay } from './support/schedule';

test.beforeEach(async ({ page }) => prepareSchedule(page));

test('schedule canvas fills the screen and empty-row hover keeps Create usable', async ({
  page,
}) => {
  for (const [width, height] of [
    [1440, 1024],
    [390, 844],
  ]) {
    await page.setViewportSize({ width, height });
    const viewport = await page.getByRole('region').boundingBox();
    expect(viewport?.y).toBeCloseTo(204, 0);
    expect((viewport?.y ?? 0) + (viewport?.height ?? 0)).toBeCloseTo(height, 0);
    await expect(page.locator('.grid-extension')).toBeVisible();
    await expect(page.locator('thead .sidebar')).toHaveCSS('font-weight', '400');
    await expect(page.locator('thead .sidebar')).toHaveCSS('line-height', '16px');
    await expect(page.getByRole('rowheader', { name: 'Quality Control', exact: true })).toHaveCSS(
      'font-weight',
      '400',
    );
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  }
  await page.setViewportSize({ width: 1440, height: 1024 });
  await page.getByRole('button', { name: 'Center timeline on today' }).click();
  // Let the resize/Today scroll event settle before testing a stationary hover.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  const header = await page.locator('th[data-date="2026-10-27"]').boundingBox();
  const row = await page
    .getByRole('row')
    .filter({ has: page.getByRole('rowheader', { name: 'Quality Control', exact: true }) })
    .boundingBox();
  if (!header || !row) throw new Error('Missing timeline geometry');
  await page.mouse.move(header.x + header.width / 2, row.y + row.height / 2);
  await expect(page.locator('.create-preview')).toBeVisible();
  await expect(page.getByText('Click to add dates', { exact: true })).toBeVisible();
  await clickEmptyDay(page, 'Quality Control', '2026-10-27');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.locator('app-work-order-bar')).toHaveCount(8);
});

for (const width of [1280, 390]) {
  test(`Timescale overlay matches Sketch geometry at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    const control = page.locator('.timescale-control');
    await control.locator('.ng-arrow-wrapper').click();
    const menu = page.locator('.ng-dropdown-panel.timeline-scale-menu');
    await expect(menu).toBeVisible();
    const controlBox = await control.boundingBox();
    const menuBox = await menu.boundingBox();
    if (!controlBox || !menuBox) throw new Error('Timescale geometry unavailable');
    expect(menuBox.width).toBeCloseTo(200, 0);
    expect(menuBox.x).toBeCloseTo(controlBox.x, 0);
    expect(menuBox.y - controlBox.y - controlBox.height).toBeCloseTo(5, 0);
    await expect(page.getByRole('option', { name: 'Day', exact: true })).toHaveCSS(
      'height',
      '28px',
    );
    await expect(menu.locator('.ng-option-selected .ng-option-label')).toHaveCSS(
      'font-weight',
      '500',
    );
    await page.getByRole('option', { name: 'Week', exact: true }).click();
    await expect(control.locator('.ng-value-label')).toHaveText('Week');
    await expect(page.locator('app-work-order-bar')).toHaveCount(8);
  });
}

test('bar hover reveals light actions and trigger hover uses the darker gray', async ({ page }) => {
  const bar = page
    .locator('app-work-order-bar')
    .filter({ hasText: 'Window frame extrusion' })
    .locator('.bar');
  const trigger = bar.getByRole('button');
  await bar.locator('.name').hover();
  await expect(bar).toHaveCSS('box-shadow', 'none');
  await expect(trigger).toHaveCSS('opacity', '1');
  await expect(trigger).toHaveCSS('background-color', 'rgb(241, 243, 248)');
  await expect(trigger).toHaveCSS('color', 'rgb(104, 113, 150)');
  await trigger.hover();
  await expect(trigger).toHaveCSS('background-color', 'rgb(216, 220, 235)');
  await expect(bar).toHaveCSS('box-shadow', 'none');
  await trigger.press('ArrowDown');
  await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toBeVisible();
  await expect(trigger).toHaveCSS('background-color', 'rgb(216, 220, 235)');
});
