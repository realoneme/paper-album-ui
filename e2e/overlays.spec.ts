import { expect, test } from '@playwright/test';

test.describe('Drawer demo on the full docs page', () => {
  test('preview options work on first load; the real drawer takes focus, closes with Escape and unlocks the page', async ({ page }) => {
    await page.goto('/?theme=parchment');
    const card = page.locator('#c-drawer');
    await card.scrollIntoViewIfNeeded();

    // First load: the in-page preview is live.
    await card.getByRole('radio', { name: 'Square · $80' }).click();
    await expect(card.getByRole('button', { name: 'Add to cart · $80' })).toBeVisible();

    for (let round = 0; round < 2; round++) {
      await card.getByRole('button', { name: 'Order a print' }).click();
      const drawer = page.getByRole('dialog', { name: 'Order a print' });
      await expect(drawer).toBeVisible();
      await expect.poll(() => drawer.evaluate((el) => el.contains(document.activeElement))).toBe(true);
      await page.keyboard.press('Escape');
      await expect(drawer).toBeHidden();
      await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).pointerEvents)).toBe('auto');
      await expect.poll(() => page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe('hidden');
    }

    // The page scrolls again after closing.
    const before = await page.evaluate(() => window.scrollY);
    await page.mouse.wheel(0, 400);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
  });
});

test('Menubar opens its menu 12px below the bar, like Navigation Menu', async ({ page }) => {
  const settled = () => page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined))));
  await page.goto('/?demo=NavigationMenu&theme=parchment');
  await expect(page.locator('.pa-navmenu-content').first()).toBeVisible();
  await settled();
  const navGap = await page.evaluate(() => {
    const list = document.querySelector('.pa-navmenu-list')!.getBoundingClientRect();
    const panel = document.querySelector('.pa-navmenu-content')!.getBoundingClientRect();
    return Math.round(panel.top - list.bottom);
  });
  await page.goto('/?demo=Menubar&theme=parchment');
  await expect(page.locator('[role="menu"][data-side="bottom"]').first()).toBeVisible();
  await settled();
  const barGap = await page.evaluate(() => {
    const bar = document.querySelector('.pa-menubar')!.getBoundingClientRect();
    const menu = document.querySelector('[role="menu"][data-side="bottom"]')!.getBoundingClientRect();
    return Math.round(menu.top - bar.bottom);
  });
  expect(navGap).toBe(12);
  expect(barGap).toBe(navGap);
});

test.describe('moving between menu titles swaps in place', () => {
  const runningAnimations = (sel: string) =>
    `Array.from(document.querySelectorAll('${sel}')).flatMap((el) => el.getAnimations()).filter((a) => a.playState === 'running').map((a) => a.animationName ?? 'transition')`;

  test('Menubar: the slip slides, sheets swap without their slide-down, no hover fill flashes', async ({ page }) => {
    await page.goto('/?demo=Menubar&theme=parchment');
    await expect(page.locator('[role="menu"][data-side="bottom"]')).toBeVisible();
    const edit = page.getByRole('menuitem', { name: 'Edit' });
    await edit.hover();
    await expect(edit).toHaveAttribute('data-state', 'open');
    const sheet = page.locator('[role="menu"][data-side="bottom"][data-state="open"]');
    await expect(sheet).toHaveAttribute('data-menubar-swapped-in', '');
    expect(await page.evaluate(runningAnimations('[role="menu"][data-side="bottom"]'))).toEqual([]);
    // The slip is travelling; the hovered trigger shows no fill of its own.
    expect(await edit.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgba(0, 0, 0, 0)');

    // A first open (after closing the bar) still slides down.
    await page.keyboard.press('Escape');
    await expect(page.locator('[role="menu"][data-side="bottom"]')).toHaveCount(0);
    await page.getByRole('menuitem', { name: 'View' }).click();
    const first = page.locator('[role="menu"][data-side="bottom"][data-state="open"]');
    await expect(first).toBeVisible();
    await expect(first).not.toHaveAttribute('data-menubar-swapped-in', '');
  });

  test('Navigation Menu: panels swap without the drop and never overlap', async ({ page }) => {
    await page.goto('/?demo=NavigationMenu&theme=parchment');
    await expect(page.locator('.pa-navmenu-content[data-state="open"]')).toBeVisible();
    await page.getByRole('button', { name: 'Prints' }).hover();
    await expect(page.getByRole('button', { name: 'Prints' })).toHaveAttribute('data-state', 'open');
    const visible = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.pa-navmenu-content')).filter((el) => getComputedStyle(el).visibility !== 'hidden').length);
    expect(visible).toBe(1);
    expect(await page.evaluate(runningAnimations('.pa-navmenu-content[data-state="open"]'))).toEqual([]);
  });
});
