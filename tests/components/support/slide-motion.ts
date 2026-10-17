import { readFileSync } from 'node:fs';
import { vi } from 'vitest';

/**
 * jsdom has no CSS animations and its getComputedStyle returns a snapshot, so Radix Presence would unmount a closing
 * sheet at once. This makes every `.pa-slide` element report the animation our slide-down.css gives it
 * (pa-slide-in while open, pa-slide-out once data-state="closed"), so Presence keeps it until `endSlide`.
 */
export function mockSlideAnimations() {
  const original = window.getComputedStyle.bind(window);
  return vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element, pseudo?: string | null) => {
    const real = original(el, pseudo);
    if (!(el instanceof HTMLElement) || !el.classList.contains('pa-slide')) return real;
    return new Proxy(real, {
      get(target, prop) {
        if (prop === 'animationName') {
          if (el.dataset.state !== 'closed') return 'pa-slide-in';
          // menubar.css: a menu closing because another one opened has `animation: none`.
          return el.hasAttribute('data-menubar-switching') ? 'none' : 'pa-slide-out';
        }
        const value = Reflect.get(target, prop, target) as unknown;
        return typeof value === 'function' ? (value as (...args: unknown[]) => unknown).bind(target) : value;
      },
    });
  });
}

/** Fires the end of the exit animation the way a browser would. */
export function endSlide(el: Element) {
  const event = new Event('animationend', { bubbles: true });
  Object.assign(event, { animationName: 'pa-slide-out' });
  el.dispatchEvent(event);
}

/** The shared motion stylesheet, for asserting the selectors components rely on. */
export const slideCss = readFileSync('src/styles/extra/slide-down.css', 'utf8');
export const readCss = (name: string) => readFileSync(`src/styles/extra/${name}.css`, 'utf8');
