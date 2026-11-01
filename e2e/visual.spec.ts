import { test, expect, takeSnapshot } from '@chromatic-com/playwright';
import { readdirSync } from 'node:fs';

// Chromatic visual regression: one snapshot per demo per theme (59 demos × 3 themes ≈ 177 snapshots a build).
// Only this file uses the Chromatic fixture, so the other e2e specs never add to the snapshot count.
const NAMES = readdirSync('src/docs/demos').filter((f) => f.endsWith('.demo.tsx')).map((f) => f.replace('.demo.tsx', '')).sort();
const THEMES = ['parchment', 'oak', 'walnut'];

test.use({
  disableAutoSnapshot: true,
  // Archive the Google Fonts too, so Chromatic renders the real typefaces instead of a fallback.
  assetDomains: ['fonts.googleapis.com', 'fonts.gstatic.com'],
});

for (const name of NAMES) {
  for (const theme of THEMES) {
    test(`${name} in ${theme}`, async ({ page }, testInfo) => {
      await page.goto(`/?demo=${name}&theme=${theme}`);
      await expect(page.locator('.demo-stage')).toBeVisible();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      await page.evaluate(() => document.fonts.ready);
      // Let entrance animations settle; looping ones (spinners) are paused by Chromatic itself.
      await page.evaluate(() => Promise.all(document.getAnimations().filter((a) => a.effect?.getComputedTiming().iterations !== Infinity).map((a) => a.finished.catch(() => undefined))));
      await takeSnapshot(page, testInfo);
    });
  }
}
