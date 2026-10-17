import '@/styles/extra/textarea.css';
import * as React from 'react';
import { cn } from '@/lib/cn';
import { useFieldControl } from '@/components/ui/field';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Grow and shrink with the content instead of a fixed height. Default false. */
  autoResize?: boolean;
  /** With `autoResize`: the smallest height, in rows (defaults to the 96px groove). */
  minRows?: number;
  /** With `autoResize`: the tallest height, in rows; past it the textarea scrolls. */
  maxRows?: number;
}

const supportsFieldSizing = () =>
  typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('field-sizing', 'content');

const px = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

/** Height in px (border-box) of `rows` lines of text in `el`. */
function rowsToHeight(el: HTMLTextAreaElement, rows: number) {
  const cs = window.getComputedStyle(el);
  const fontSize = px(cs.fontSize) || 15;
  const lineHeight = px(cs.lineHeight) || fontSize * 1.5;
  const chrome = px(cs.paddingTop) + px(cs.paddingBottom) + px(cs.borderTopWidth) + px(cs.borderBottomWidth);
  return rows * lineHeight + chrome;
}

/**
 * A multi-line groove, 96px minimum height, resizes vertically. With `autoResize` it follows
 * its content (clamped by `minRows` / `maxRows`) and scrolls only past `maxRows`.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, minRows, maxRows, onChange, style, ...props }, ref) => {
    const controlProps = useFieldControl(props);
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const resize = React.useCallback(() => {
      const el = innerRef.current;
      if (!el || !autoResize) return;
      const min = minRows ? rowsToHeight(el, minRows) : 0;
      const max = maxRows ? rowsToHeight(el, maxRows) : Infinity;
      if (minRows) el.style.minHeight = `${min}px`;
      if (maxRows) el.style.maxHeight = `${max}px`;
      if (supportsFieldSizing()) return; // CSS `field-sizing: content` does the measuring.
      const cs = window.getComputedStyle(el);
      const borders = px(cs.borderTopWidth) + px(cs.borderBottomWidth);
      el.style.height = 'auto'; // collapse first so the textarea can shrink
      const content = el.scrollHeight + borders;
      el.style.height = `${Math.min(Math.max(content, min), max)}px`;
      el.style.overflowY = content > max ? 'auto' : 'hidden';
    }, [autoResize, minRows, maxRows]);

    // Controlled values (and prop changes) resize before paint.
    React.useLayoutEffect(() => {
      resize();
    }, [resize, props.value]);

    // A width change re-wraps the text, so re-measure; height-only changes are ignored.
    React.useEffect(() => {
      const el = innerRef.current;
      if (!autoResize || !el || typeof ResizeObserver === 'undefined') return;
      let width = el.offsetWidth;
      const ro = new ResizeObserver(() => {
        if (el.offsetWidth === width) return;
        width = el.offsetWidth;
        resize();
      });
      ro.observe(el);
      return () => ro.disconnect();
    }, [autoResize, resize]);

    return (
      <textarea
        ref={setRefs}
        className={cn('pa-textarea', autoResize && 'pa-textarea-auto', className)}
        style={style}
        onChange={(e) => {
          onChange?.(e);
          resize(); // uncontrolled typing
        }}
        {...controlProps}
      />
    );
  },
);
Textarea.displayName = 'Textarea';
