import { expect, test, prepareSchedule, clickEmptyDay } from './support/schedule';

test.beforeEach(async ({ page }) => prepareSchedule(page));

test('horizontal scroll keeps the sidebar fixed and hover highlights the row', async ({ page }) => {
  const region = page.getByRole('region');
  const sidebar = page.getByRole('rowheader', { name: 'Quality Control', exact: true });
  const initial = await sidebar.boundingBox();
  const header = page.locator('th[data-date="2026-10-26"]');
  const before = await header.boundingBox();
  await region.hover();
  await page.mouse.wheel(500, 0);
  await expect.poll(async () => (await header.boundingBox())?.x).not.toBe(before?.x);
  expect((await sidebar.boundingBox())?.x).toBe(initial?.x);
  await sidebar.hover();
  await expect(sidebar).toHaveCSS('background-color', 'rgb(250, 251, 253)');
  await expect(sidebar).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)');
  expect((await sidebar.boundingBox())?.height).toBe(initial?.height);
  await page.getByRole('heading', { name: 'Work Orders', exact: true }).hover();
  await expect(sidebar).toHaveCSS('border-top-color', 'rgb(230, 235, 240)');
  await sidebar.hover();
  await expect(page.getByRole('row').filter({ has: sidebar }).locator('td')).toHaveCSS(
    'background-color',
    'rgb(238, 240, 255)',
  );
});

for (const [scale, headerDate, expectedDate, expectedEnd] of [
  ['Week', '2026-10-26', '2026-10-29', '2026-11-05'],
  ['Month', '2026-10-01', '2026-10-16', '2026-10-23'],
] as const) {
  test(`${scale} clicks select the calendar day within the column`, async ({ page }) => {
    await page.locator('app-timeline-toolbar .ng-arrow-wrapper').click();
    await page.getByRole('option', { name: scale, exact: true }).click();
    await expect(page.locator('th[data-date]')).toHaveCount(scale === 'Week' ? 19 : 13);
    await clickEmptyDay(page, 'Quality Control', headerDate, expectedDate);
    await expect(page.getByRole('textbox', { name: 'End Date', exact: true })).toHaveValue(
      expectedEnd.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2.$3.$1'),
    );
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(page.locator('app-work-order-bar')).toHaveCount(8);
  });
}

for (const [scale, initialCount, batch] of [
  ['Day', 29, 14],
  ['Week', 19, 8],
  ['Month', 13, 6],
] as const) {
  test(`infinite ${scale} scrolling preserves the prepend anchor and Today recenters`, async ({
    page,
  }) => {
    if (scale !== 'Day') {
      await page.locator('app-timeline-toolbar .ng-arrow-wrapper').click();
      await page.getByRole('option', { name: scale, exact: true }).click();
      await expect(page.locator('th[data-date]')).toHaveCount(initialCount);
    }
    const viewport = page.getByRole('region');
    const originalFirst = await page.locator('th[data-date]').first().getAttribute('data-date');
    const header = page.locator(`th[data-date="${originalFirst}"]`);
    // Change scroll position as a scrollbar drag would; inspect DOM geometry only.
    const before = await viewport.evaluate((element) => {
      element.scrollLeft = 114;
      return element.querySelector('th[data-date]')?.getBoundingClientRect().x;
    });
    await expect(page.locator('th[data-date]')).toHaveCount(initialCount + batch);
    expect((await header.boundingBox())?.x).toBe(before);
    await viewport.evaluate((element) => {
      element.scrollLeft = element.scrollWidth;
    });
    await expect(page.locator('th[data-date]')).toHaveCount(initialCount + batch * 2);
    await page.getByRole('button', { name: 'Center timeline on today' }).click();
    const centered = await viewport.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const sidebar = element.querySelector('th')?.getBoundingClientRect().width ?? 0;
      const today = element.querySelector('.today')?.getBoundingClientRect().x ?? 0;
      return Math.abs(today - (rect.x + sidebar + (element.clientWidth - sidebar) / 2));
    });
    expect(centered).toBeLessThan(3);
    await expect(page.locator('app-work-order-bar')).toHaveCount(8);
  });
}
