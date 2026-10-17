import * as React from 'react';

/**
 * For a strip that scrolls sideways when it does not fit (tabs, navigation on a phone): marks the element with
 * `data-scroll-start` / `data-scroll-end` while there is more to scroll on that side, so CSS can fade that edge
 * as a hint, and scrolls the item matching `activeSelector` into view (the strip only, never the page) whenever
 * the selection changes. Returns a ref callback that also forwards to `forwarded`.
 */
export function useScrollEdges<T extends HTMLElement>(forwarded: React.ForwardedRef<T>, activeSelector?: string) {
  const [node, setNode] = React.useState<T | null>(null);
  const ref = React.useCallback(
    (el: T | null) => {
      setNode(el);
      if (typeof forwarded === 'function') forwarded(el);
      else if (forwarded) forwarded.current = el;
    },
    [forwarded],
  );

  React.useEffect(() => {
    if (!node) return;
    const update = () => {
      const max = node.scrollWidth - node.clientWidth;
      node.toggleAttribute('data-scroll-start', node.scrollLeft > 1);
      node.toggleAttribute('data-scroll-end', max - node.scrollLeft > 1);
    };
    const reveal = (smooth: boolean) => {
      const active = activeSelector ? node.querySelector<HTMLElement>(activeSelector) : null;
      if (!active || node.scrollWidth <= node.clientWidth) return;
      const box = node.getBoundingClientRect();
      const item = active.getBoundingClientRect();
      const pad = 24;
      let delta = 0;
      if (item.left < box.left + pad) delta = item.left - box.left - pad;
      else if (item.right > box.right - pad) delta = item.right - box.right + pad;
      if (!delta) return;
      const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      node.scrollBy({ left: delta, behavior: smooth && !reduce ? 'smooth' : 'auto' });
    };
    update();
    reveal(false);
    node.addEventListener('scroll', update, { passive: true });
    const resize = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    resize?.observe(node);
    const mutate =
      typeof MutationObserver === 'undefined'
        ? null
        : new MutationObserver(() => {
            update();
            reveal(true);
          });
    mutate?.observe(node, { subtree: true, attributes: true, attributeFilter: ['data-state', 'aria-selected', 'aria-current'], childList: true });
    return () => {
      node.removeEventListener('scroll', update);
      resize?.disconnect();
      mutate?.disconnect();
    };
  }, [node, activeSelector]);

  return ref;
}
