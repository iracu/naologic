import { expect, test, prepareSchedule, action } from './support/schedule';

test.beforeEach(async ({ page }) => prepareSchedule(page));

test('Cancel, outside click and Escape discard edits and reset Create', async ({ page }) => {
  for (const dismissal of ['Cancel', 'outside', 'Escape']) {
    await action(page, 'Precision shaft machining', 'Edit');
    await page.getByRole('textbox', { name: 'Work Order Name', exact: true }).fill('Unsaved name');
    if (dismissal === 'Cancel')
      await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    else if (dismissal === 'Escape')
      await page.getByRole('textbox', { name: 'Work Order Name', exact: true }).press('Escape');
    else await page.mouse.click(100, 100);
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(
      page.getByRole('button', { name: /Actions for Precision shaft machining/ }),
    ).toBeFocused();
  }
  await page.getByRole('button', { name: /Create work order for Quality Control/ }).press('Enter');
  await expect(page.getByRole('textbox', { name: 'Work Order Name', exact: true })).toHaveValue('');
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.locator('app-work-order-bar')).toHaveCount(8);
});

test('mobile panel, keyboard menu and deletion remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: /Create work order for Quality Control/ }).press('Enter');
  await expect(page.getByRole('dialog')).toBeVisible();
  const bounds = await page.getByRole('dialog').boundingBox();
  expect(bounds?.width).toBeCloseTo(390, 2);
  await page.getByRole('textbox', { name: 'Work Order Name', exact: true }).fill('Mobile order');
  await page.getByRole('button', { name: 'Create', exact: true }).click();
  await expect(page.locator('app-work-order-bar')).toHaveCount(9);
  await action(page, 'Mobile order', 'Delete');
  await expect(page.locator('app-work-order-bar')).toHaveCount(8);
  await expect(page.getByRole('region')).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('saving an order outside the visible range leaves a keyboard focus target', async ({
  page,
}) => {
  await action(page, 'Precision shaft machining', 'Edit');
  await page.getByRole('textbox', { name: 'Start Date', exact: true }).fill('01.01.2050');
  await page.getByRole('textbox', { name: 'End Date', exact: true }).fill('01.08.2050');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('app-work-order-bar')).toHaveCount(7);
  await expect(page.getByRole('region')).toBeFocused();
});

test('panel keyboard navigation avoids background controls and Escape restores focus', async ({
  page,
}) => {
  const trigger = page.getByRole('button', { name: /Actions for Precision shaft machining/ });
  const bar = page.locator('.bar').filter({ has: trigger });
  await expect(bar).toHaveAttribute(
    'title',
    /Precision shaft machining, In Progress, 2026-10-23 to 2026-10-28/,
  );
  await action(page, 'Precision shaft machining', 'Edit');
  await expect(page.getByRole('textbox', { name: 'Work Order Name', exact: true })).toBeFocused();
  // Native modal dialogs can hand focus to browser chrome at the boundary.
  // Background application controls must remain outside the keyboard sequence.
  for (const key of ['Tab', 'Shift+Tab']) {
    let focusedPanelControls = 0;
    for (let step = 0; step < 12; step++) {
      await page.keyboard.press(key);
      const focus = await page.evaluate(() => ({
        inPanel: !!document.activeElement?.closest('dialog'),
        onBody: document.activeElement === document.body,
      }));
      expect(focus.inPanel || focus.onBody, JSON.stringify(focus)).toBe(true);
      if (focus.inPanel) focusedPanelControls++;
    }
    expect(focusedPanelControls).toBeGreaterThan(6);
  }
  await page.getByRole('textbox', { name: 'Work Order Name', exact: true }).focus();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('Month bars show only Edit and Delete through pointer and keyboard actions', async ({
  page,
}) => {
  await page.locator('app-timeline-toolbar .ng-arrow-wrapper').click();
  await page.getByRole('option', { name: 'Month', exact: true }).click();
  const trigger = page.getByRole('button', { name: /Actions for Window frame extrusion/ });
  await expect(trigger).toHaveCSS('opacity', '1');
  for (const method of ['pointer', 'keyboard']) {
    if (method === 'pointer') await trigger.click();
    else await trigger.press('ArrowDown');
    await expect(page.getByRole('menu').getByRole('menuitem')).toHaveText(['Edit', 'Delete']);
    await expect(page.getByRole('menu')).toHaveText(/^\s*Edit\s+Delete\s*$/);
    await page.keyboard.press('Escape');
    await expect(trigger).toBeFocused();
  }
});

test.describe('compact order touch access', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });
  test('opens only Edit and Delete by tapping a Month bar action', async ({ page }) => {
    await page.locator('app-timeline-toolbar .ng-arrow-wrapper').click();
    await page.getByRole('option', { name: 'Month', exact: true }).click();
    const trigger = page.getByRole('button', { name: /Actions for Window frame extrusion/ });
    await trigger.tap();
    await expect(page.getByRole('menu').getByRole('menuitem')).toHaveText(['Edit', 'Delete']);
    await expect(page.getByRole('menu')).toHaveText(/^\s*Edit\s+Delete\s*$/);
    await expect(page.getByRole('menuitem', { name: 'Edit', exact: true })).toBeVisible();
  });
});
