import { expect, test } from '@playwright/test';

const tops = (els: Element[]) => els.map((e) => Math.round(e.getBoundingClientRect().top));

test('Carousel controls on a phone: dots stay on one line, the counter drops below', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/?demo=Carousel&theme=parchment');
  const controls = page.locator('.pa-carousel-controls').first();
  await expect(controls).toBeVisible();
  const dotTops = await controls.locator('.pa-dots button').evaluateAll(tops);
  expect(dotTops.length).toBeGreaterThan(1);
  expect(new Set(dotTops).size, `dot rows: ${dotTops.join(',')}`).toBe(1);
  const [dots, prev, next] = await Promise.all([
    controls.locator('.pa-dots').boundingBox(),
    controls.getByRole('button', { name: /previous/i }).boundingBox(),
    controls.getByRole('button', { name: /next/i }).boundingBox(),
  ]);
  // Prev, dots and next share a row; nothing overlaps.
  expect(Math.abs(prev!.y + prev!.height / 2 - (dots!.y + dots!.height / 2))).toBeLessThan(4);
  expect(prev!.x + prev!.width).toBeLessThanOrEqual(dots!.x + 1);
  expect(dots!.x + dots!.width).toBeLessThanOrEqual(next!.x + 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
});

test('the docs theme switch sits on one row of equal cells', async ({ page }) => {
  await page.goto('/?theme=parchment');
  const cells = page.locator('.themes [role="radio"]');
  await expect(cells).toHaveCount(3);
  const boxes = await cells.evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return { top: Math.round(r.top), width: Math.round(r.width), fits: e.scrollWidth <= e.clientWidth }; }));
  expect(new Set(boxes.map((b) => b.top)).size).toBe(1);
  expect(new Set(boxes.map((b) => b.width)).size).toBe(1);
  expect(boxes.every((b) => b.fits)).toBe(true);
});

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test('Menubar: the Export submenu never pops out by itself', async ({ page }) => {
    await page.goto('/?demo=Menubar&theme=parchment');
    const file = page.getByRole('menuitem', { name: 'File', exact: true });
    await expect(file).toHaveAttribute('data-state', 'open');
    await expect(page.getByRole('menuitem', { name: 'TIFF · print' })).toHaveCount(0);
    await file.tap();
    await expect(file).toHaveAttribute('data-state', 'closed');
    // Let the sheet finish sliding up (a tap during its exit is ignored), as a reader would.
    await page.waitForTimeout(300);
    await file.tap();
    await expect(file).toHaveAttribute('data-state', 'open');
    await page.waitForTimeout(400);
    await expect(page.getByRole('menuitem', { name: 'TIFF · print' })).toHaveCount(0);
  });

  test('Tabs and Navigation Menu scroll sideways instead of overflowing, with the far edge faded', async ({ page }) => {
    for (const [demo, sel] of [['Tabs', '[role="tablist"]'], ['NavigationMenu', '.pa-navmenu-list']] as const) {
      await page.goto(`/?demo=${demo}&theme=parchment`);
      const strip = page.locator(sel).first();
      await expect(strip).toBeVisible();
      const s = await strip.evaluate((e) => ({ sw: e.scrollWidth, cw: e.clientWidth, overflowX: getComputedStyle(e).overflowX, end: e.hasAttribute('data-scroll-end'), rows: (() => {
        // One row when every item overlaps every other vertically (the selected tab hangs 3px over the rule).
        const boxes = Array.from(e.children).filter((c) => (c as HTMLElement).offsetHeight).map((c) => c.getBoundingClientRect());
        return Math.max(...boxes.map((b) => b.top)) < Math.min(...boxes.map((b) => b.bottom)) ? 1 : 2;
      })() }));
      expect(s.sw, demo).toBeGreaterThan(s.cw);
      expect(s.overflowX, demo).toBe('auto');
      expect(s.end, demo).toBe(true);
      expect(s.rows, `${demo} items on one row`).toBe(1);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), demo).toBeLessThanOrEqual(1);
      await strip.evaluate((e) => e.scrollTo({ left: e.scrollWidth }));
      await expect(strip).toHaveAttribute('data-scroll-start', '');
      await expect(strip).not.toHaveAttribute('data-scroll-end', '');
    }
  });

  test('Pagination switches to the compact layout', async ({ page }) => {
    await page.goto('/?demo=Pagination&theme=parchment');
    await expect(page.locator('.pa-pg-summary')).toBeVisible();
    await expect(page.locator('.pa-pg-summary')).toHaveText('Page 2 / of 12');
    await expect(page.getByRole('link', { name: '12', exact: true })).toBeHidden();
    await expect(page.getByRole('link', { name: 'Go to next page' })).toBeVisible();
  });
});

test('Pagination keeps the numbered layout when there is room', async ({ page }) => {
  await page.goto('/?demo=Pagination&theme=parchment');
  await expect(page.locator('.pa-pg-summary')).toBeHidden();
  await expect(page.getByRole('link', { name: '12', exact: true })).toBeVisible();
});
