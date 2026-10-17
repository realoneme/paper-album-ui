import { expect, test } from '@playwright/test';

// Regression: a stack with warning / error toasts, hovered open. The bookmark ribbon must stay a small ribbon
// (Sonner owns the toast's own ::before/::after) and every toast must keep Sonner's absolute stacking.
test('hovering a stack with warning and error toasts keeps ribbons and stacking intact', async ({ page }) => {
  await page.goto('/?demo=Sonner&theme=parchment');
  for (const label of ['Show warning', 'Show error', 'Show info']) {
    await page.getByRole('button', { name: label }).click();
  }
  const toasts = page.locator('[data-sonner-toast]');
  await expect(toasts).toHaveCount(3);
  await toasts.first().hover();
  await expect(toasts.first()).toHaveAttribute('data-expanded', 'true');
  await page.waitForTimeout(500);

  const info = await toasts.evaluateAll((els) =>
    els.map((el) => {
      const ribbon = el.querySelector('.pa-toast-icon');
      const after = ribbon ? getComputedStyle(ribbon, '::after') : null;
      const box = el.getBoundingClientRect();
      return {
        type: el.getAttribute('data-type'),
        position: getComputedStyle(el).position,
        top: box.top,
        bottom: box.bottom,
        ribbonWidth: after && after.content !== 'none' ? parseFloat(after.width) : 0,
        ribbonHeight: after && after.content !== 'none' ? parseFloat(after.height) : 0,
      };
    }),
  );

  for (const t of info) expect(t.position).toBe('absolute');
  for (const t of info.filter((t) => t.type === 'warning' || t.type === 'error')) {
    expect(t.ribbonWidth).toBe(14);
    expect(t.ribbonHeight).toBeLessThanOrEqual(30);
  }
  // Expanded toasts do not overlap one another.
  const sorted = [...info].sort((a, b) => a.top - b.top);
  for (let i = 1; i < sorted.length; i++) expect(sorted[i].top).toBeGreaterThanOrEqual(sorted[i - 1].bottom - 1);
});

test('warning icon discs use the white icon colour, like the other tones', async ({ page }) => {
  await page.goto('/?demo=Alert&theme=parchment');
  const color = await page.locator('.pa-alert.warning .pa-alert-icon').first().evaluate((el) => getComputedStyle(el).color);
  expect(color).toBe('rgb(255, 255, 255)');
});
