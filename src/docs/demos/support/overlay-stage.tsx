import * as React from 'react';

/**
 * Helpers for overlay demos. The docs page shows every demo at once, so each overlay starts open
 * inside its own stage and must not steal focus, trap focus or close other demos on load.
 */

/** A callback ref + element for a positioned stage that overlays portal into. */
export function useStage<T extends HTMLElement = HTMLDivElement>() {
  const [stage, setStage] = React.useState<T | null>(null);
  return [stage, setStage] as const;
}

/**
 * Open state for a demo overlay that starts open. Automatic focus is skipped until the reader
 * opens the overlay themselves, so the page does not jump to (or get trapped in) a demo on load.
 */
export function useDemoOpen(initial = true) {
  const [open, setOpen] = React.useState(initial);
  const userOpened = React.useRef(false);
  const onOpenChange = React.useCallback((next: boolean) => {
    if (next) userOpened.current = true;
    setOpen(next);
  }, []);
  const onOpenAutoFocus = React.useCallback((event: Event) => {
    if (!userOpened.current) event.preventDefault();
  }, []);
  return { open, onOpenChange, onOpenAutoFocus };
}

/**
 * Dismiss guards for non-modal demo overlays: clicks and focus elsewhere on the docs page do not close
 * them (inside the stage they behave normally), and Escape only closes the overlay when focus is inside
 * its own stage.
 */
export function stayOpen(stage: HTMLElement | null) {
  return {
    onInteractOutside: (event: Event) => {
      if (!stage || !(event.target instanceof Node) || !stage.contains(event.target)) event.preventDefault();
    },
    onEscapeKeyDown: (event: KeyboardEvent) => {
      if (!stage || !stage.contains(document.activeElement)) event.preventDefault();
    },
  };
}

/** The faded page behind a stage overlay. */
export function FakePage() {
  return (
    <div className="pa-stage-fake" aria-hidden="true">
      <span /><span /><span /><span /><span /><span />
    </div>
  );
}
