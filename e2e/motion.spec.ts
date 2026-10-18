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

test('Tabs: a newly selected card stretches past its height and springs back, while the panel below stays put', async ({ page }) => {
  await page.goto('/?demo=Tabs&theme=parchment');
  const story = page.getByRole('tab', { name: 'Story' });
  const panelTop = () => page.locator('.pa-tabs-content:not([hidden])').evaluate((e) => Math.round(e.getBoundingClientRect().top));
  const top0 = await panelTop();
  expect(await page.evaluate(() => Array.from(document.querySelectorAll('.pa-tab')).flatMap((e) => e.getAnimations()).length)).toBe(0);
  const heights = await heightsDuring(page, '.pa-tab', 1, () => story.click(), 650);
  expect(Math.max(...heights), heights.join(',')).toBeGreaterThan(56);
  expect(heights.at(-1)).toBe(51);
  expect(await panelTop()).toBe(top0);
});

const angleOf = (m: string) => {
  const [a, b] = m.replace(/^matrix\(|\)$/g, '').split(',').map(Number);
  return (Math.atan2(b!, a!) * 180) / Math.PI;
};

test.describe('photo holders move under the pointer', () => {
  test('pocket lifts its print 30px out of the sleeve, and settles back', async ({ page }) => {
    await page.goto('/?demo=PhotoHolder&theme=parchment');
    const holder = page.locator('.pa-holder[data-variant="pocket"]');
    await expect(holder.locator('.sleeve-note')).toHaveText('Otaru harbour');
    const print = holder.locator('.pa-holder-pocket-print');
    const y = () => print.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).f);
    expect(await y()).toBeCloseTo(0, 0);
    await holder.hover();
    await page.waitForTimeout(700);
    expect(await y()).toBeCloseTo(-30, 0);
    await page.mouse.move(0, 0);
    await page.waitForTimeout(700);
    expect(await y()).toBeCloseTo(0, 0);
  });

  test('tape: the print is lifted off the page from its tape and laid back down', async ({ page }) => {
    await page.goto('/?demo=PhotoHolder&theme=parchment');
    const holder = page.locator('.pa-holder[data-variant="tape"]');
    const print = holder.locator('.pa-holder-tape');
    const state = () =>
      print.evaluate((el) => {
        const m = new DOMMatrix(getComputedStyle(el).transform);
        return { lift: Math.asin(Math.max(-1, Math.min(1, m.m23))) * (180 / Math.PI), angle: (Math.atan2(m.m12, m.m11) * 180) / Math.PI };
      });
    await holder.hover();
    const lifts: number[] = [];
    const angles: number[] = [];
    for (let i = 0; i < 12; i++) {
      const s = await state();
      lifts.push(s.lift);
      angles.push(s.angle);
      await page.waitForTimeout(60);
    }
    // It lifts (a few degrees, towards the viewer) but does not swing side to side.
    expect(Math.max(...lifts.map(Math.abs)), lifts.join(',')).toBeGreaterThan(2.5);
    expect(Math.max(...lifts.map(Math.abs)), lifts.join(',')).toBeLessThan(4.5);
    expect(Math.max(...angles) - Math.min(...angles), angles.join(',')).toBeLessThan(0.5);
    await page.waitForTimeout(500);
    const end = await state();
    expect(end.lift).toBeCloseTo(0, 1);
    expect(end.angle).toBeCloseTo(2.5, 1);
  });

  test('polaroid is nudged askew on hover and springs back', async ({ page }) => {
    await page.goto('/?demo=PhotoHolder&theme=parchment');
    const holder = page.locator('.pa-holder[data-variant="polaroid"]');
    const print = holder.locator('.pa-holder-polaroid');
    const angle = async () => angleOf(await print.evaluate((el) => getComputedStyle(el).transform));
    expect(await angle()).toBeCloseTo(-1.5, 1);
    await holder.hover();
    await page.waitForTimeout(800);
    expect(await angle()).toBeCloseTo(2, 1);
    await page.mouse.move(0, 0);
    await page.waitForTimeout(800);
    expect(await angle()).toBeCloseTo(-1.5, 1);
  });

  test('with reduced motion, nothing moves', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/?demo=PhotoHolder&theme=parchment');
    const holder = page.locator('.pa-holder[data-variant="pocket"]');
    await holder.hover();
    await page.waitForTimeout(300);
    expect(await holder.locator('.pa-holder-pocket-print').evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).f)).toBeCloseTo(0, 0);
    expect(await page.locator('.pa-holder-tape').evaluate((el) => el.getAnimations().length)).toBe(0);
  });
});

test('Carousel: the centred print turns over for its details; a neighbour is brought to the centre instead', async ({ page }) => {
  await page.goto('/?demo=Carousel&theme=parchment');
  const first = page.getByRole('button', { name: 'Otaru, dawn: show details' });
  const second = page.getByRole('button', { name: 'Harbour fog: show details' });
  const turned = (card: typeof first) =>
    card.locator('.pa-flip-inner').evaluate((el) => Math.round(Math.abs(new DOMMatrix(getComputedStyle(el).transform).m11) * 100) / 100 === 1 && new DOMMatrix(getComputedStyle(el).transform).m11 < 0);
  await first.click();
  await expect(first).toHaveAttribute('aria-pressed', 'true');
  await page.waitForTimeout(900);
  expect(await turned(first)).toBe(true);
  await expect(first.locator('.pa-flip-back')).toContainText('Fujifilm X100V');
  await second.click();
  await expect(second).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('group', { name: '2 of 3' }).first()).toHaveAttribute('aria-current', 'true');
  await expect(first).toHaveAttribute('aria-pressed', 'false');
  await page.waitForTimeout(900);
  expect(await turned(first)).toBe(false);
});
