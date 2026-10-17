import { expect, test, type Page } from '@playwright/test';

/** Heights of the selected panels on every frame for `ms` after `act` runs. */
async function heightsDuring(page: Page, selector: string, index: number, act: () => Promise<void>, ms = 320) {
  const sampling = page.evaluate(
    async ({ selector, index, ms }) => {
      const out: number[] = [];
      const t0 = performance.now();
      while (performance.now() - t0 < ms) {
        await new Promise((r) => requestAnimationFrame(r));
        const el = document.querySelectorAll(selector)[index];
        out.push(el ? Math.round(el.getBoundingClientRect().height) : 0);
      }
      return out;
    },
    { selector, index, ms },
  );
  await act();
  return sampling;
}

const inBetween = (hs: number[]) => {
  const lo = Math.min(...hs);
  const hi = Math.max(...hs);
  return hs.filter((h) => h > lo + 2 && h < hi - 2).length;
};

test.describe('panels fold open and shut', () => {
  test('Accordion unfolds a panel to its height and folds it away again, leaving the others open, without animating on load', async ({ page }) => {
    await page.goto('/?demo=Accordion&theme=parchment');
    expect(await page.evaluate(() => Array.from(document.querySelectorAll('.pa-acc-content')).flatMap((e) => e.getAnimations()).length)).toBe(0);
    const second = page.locator('.pa-acc-trigger').nth(1);
    await expect(second).toHaveAttribute('aria-expanded', 'false');
    const opening = await heightsDuring(page, '.pa-acc-content', 1, () => second.click());
    expect(inBetween(opening), `heights while opening: ${opening.join(',')}`).toBeGreaterThan(2);
    await expect(page.locator('.pa-acc-trigger').first()).toHaveAttribute('aria-expanded', 'true');
    const closing = await heightsDuring(page, '.pa-acc-content', 1, () => second.click());
    expect(inBetween(closing), `heights while closing: ${closing.join(',')}`).toBeGreaterThan(2);
  });

  test('Collapsible folds the same way', async ({ page }) => {
    await page.goto('/?demo=Collapsible&theme=parchment');
    const trigger = page.locator('.pa-acc-trigger').first();
    const first = await heightsDuring(page, '.pa-collapsible-content', 0, () => trigger.click());
    expect(inBetween(first), `heights: ${first.join(',')}`).toBeGreaterThan(2);
    const second = await heightsDuring(page, '.pa-collapsible-content', 0, () => trigger.click());
    expect(inBetween(second), `heights: ${second.join(',')}`).toBeGreaterThan(2);
  });
});

test('Collapsible: only the chevron turns; the leading label icon stays put', async ({ page }) => {
  await page.goto('/?demo=Collapsible&theme=parchment');
  const trigger = page.locator('.pa-acc-trigger').first();
  const transforms = () =>
    trigger.evaluate((el) => ({
      label: getComputedStyle(el.querySelector('.pa-collapsible-label svg')!).transform,
      chevron: getComputedStyle(el.querySelector(':scope > svg')!).transform,
      running: Array.from(el.querySelectorAll('.pa-collapsible-label svg')).flatMap((s) => s.getAnimations()).length,
    }));
  for (let i = 0; i < 2; i++) {
    await trigger.click();
    const during = await transforms();
    expect(during.running).toBe(0);
    expect(during.label).toBe('none');
    await page.waitForTimeout(300);
    const after = await transforms();
    expect(after.label).toBe('none');
    expect(after.chevron).toBe((await trigger.getAttribute('aria-expanded')) === 'true' ? 'matrix(-1, 0, 0, -1, 0, 0)' : 'none');
  }
});
