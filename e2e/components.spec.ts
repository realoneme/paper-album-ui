import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync } from 'node:fs';

const NAMES = readdirSync('src/docs/demos').filter((f) => f.endsWith('.demo.tsx')).map((f) => f.replace('.demo.tsx', '')).sort();
const THEMES = ['parchment', 'oak', 'walnut'];

// Google Fonts may be slow or offline on CI; everything else must load cleanly.
const external = (url: string) => /fonts\.(googleapis|gstatic)\.com/.test(url);

function watch(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error' && !external(m.text())) errors.push(`console: ${m.text()}`); });
  page.on('requestfailed', (r) => { if (!external(r.url())) errors.push(`requestfailed: ${r.url()}`); });
  return errors;
}

// Upstream library markup that axe flags but that we cannot change; scoped to the one component each.
const KNOWN: Record<string, { disableRules?: string[]; exclude?: string[]; why: string }> = {
  // cmdk wraps options in a sizer <div> inside role="listbox"; shadcn's Command has the same markup.
  Command: { disableRules: ['aria-required-children'], why: 'cmdk list sizer element' },
  // Radix NavigationMenu renders an aria-hidden focus proxy next to an open trigger to manage tab order.
  NavigationMenu: { exclude: ['nav li > span[aria-hidden="true"]'], why: 'Radix focus proxy' },
};

for (const name of NAMES) {
  for (const theme of THEMES) {
    test(`${name} renders in ${theme}`, async ({ page }) => {
      const errors = watch(page);
      await page.goto(`/?demo=${name}&theme=${theme}`);
      const stage = page.locator('.demo-stage');
      await expect(stage).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const box = await stage.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThan(40);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, 'horizontal overflow').toBeLessThanOrEqual(1);
      expect(errors).toEqual([]);
    });
  }

  test(`${name} has no serious accessibility violations`, async ({ page }) => {
    await page.goto(`/?demo=${name}&theme=parchment`);
    await expect(page.locator('.demo-stage')).toBeVisible();
    // @axe-core/playwright is typed against its own playwright-core copy; the runtime Page is compatible.
    let axe = new AxeBuilder({ page: page as unknown as ConstructorParameters<typeof AxeBuilder>[0]['page'] })
      .include('.demo-stage')
      .disableRules(['region', ...(KNOWN[name]?.disableRules ?? [])]);
    for (const sel of KNOWN[name]?.exclude ?? []) axe = axe.exclude(sel);
    const results = await axe.analyze();
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
    expect(serious).toEqual([]);
  });
}

test('documentation site renders every component and switches theme', async ({ page }) => {
  const errors = watch(page);
  await page.goto('/');
  await expect(page).toHaveTitle('Paper Album UI');
  await expect(page.locator('article.comp')).toHaveCount(NAMES.length);
  await page.getByRole('button', { name: 'Walnut' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'walnut');
  expect(errors).toEqual([]);
});

test('documentation site fits a phone screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
