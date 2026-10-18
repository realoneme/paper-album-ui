import '@/styles/extra/photo-holder.css';
import * as React from 'react';
import { cn } from '@/lib/cn';

export type PhotoHolderVariant = 'corners' | 'slits' | 'pocket' | 'tape' | 'polaroid';

export interface PhotoHolderProps extends Omit<React.ComponentPropsWithoutRef<'figure'>, 'children'> {
  /** How the print is held on the page. */
  variant?: PhotoHolderVariant;
  /** The photograph: an `<img>` or a placeholder such as `<PhotoPlaceholder tone={1} />`. */
  children: React.ReactNode;
  /** Caption below the holder (`figcaption`, `pa-caption`). */
  caption?: React.ReactNode;
  /**
   * Handwritten note: the photo's name written on the sleeve (`pocket`) or on the print's margin (`tape`,
   * `polaroid`).
   */
  note?: React.ReactNode;
  /** Tilt in degrees, clamped to −8…8. Applies to the print (the sleeve of a pocket stays straight). */
  rotate?: number;
}

const clampRotation = (deg: number) => Math.max(-8, Math.min(8, deg));

const CORNERS = ['tl', 'tr', 'br', 'bl'] as const;

/**
 * Four paper triangles with thickness: drawn as the top-left corner and rotated into place, each with a soft sheen,
 * a lighter cut edge and a shadow that falls past the cut edge onto the photo (`.pa-corner`, styled in CSS).
 */
function Corners() {
  const id = `pa-sheen-${React.useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <>
      {CORNERS.map((corner) => (
        <svg key={corner} className="pa-corner" data-corner={corner} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id={`${id}-${corner}`} x1="0" y1="0" x2="1" y2="1">
              <stop className="pa-corner-sheen-hi" offset="0%" />
              <stop className="pa-corner-sheen-mid" offset="55%" />
              <stop className="pa-corner-sheen-lo" offset="100%" />
            </linearGradient>
          </defs>
          <path className="pa-corner-paper" d="M0 0 H40 L0 40 Z" />
          <path d="M0 0 H40 L0 40 Z" fill={`url(#${id}-${corner})`} />
          <path className="pa-corner-edge" d="M40 0 L0 40" />
        </svg>
      ))}
    </>
  );
}

/**
 * A print on an album page: wood corners, corner slits, a pocket sleeve, tape, or an instant print. One holder per
 * photo. With a pointer, the pocket's print lifts out, the taped print rocks as if pressed, and the polaroid is
 * nudged askew (none of it with reduced motion).
 */
export const PhotoHolder = React.forwardRef<HTMLElement, PhotoHolderProps>(
  ({ variant = 'corners', children, caption, note, rotate, className, ...props }, ref) => {
    // The tilt is a custom property so the hover motions can build on it.
    const tilt = { '--pa-tilt': `${clampRotation(rotate ?? 0)}deg` } as React.CSSProperties;
    const cap = note ? <span className="cap">{note}</span> : null;
    let holder: React.ReactNode;
    switch (variant) {
      case 'slits':
        holder = (
          <div className="pa-holder-frame pa-corners slit pa-print pa-holder-slits" style={tilt}>
            {children}
            <Corners />
          </div>
        );
        break;
      case 'pocket':
        holder = (
          <div className="pa-holder-frame pa-pocket">
            <div className="pa-print pa-holder-pocket-print" style={tilt}>
              {children}
            </div>
            <div className="sleeve">
              <svg viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path d="M0 18 L0 9 C 50 1 100 14 150 8 C 200 2 250 13 300 6 L300 18 Z" />
              </svg>
              {/* the photo's name, written on the sleeve */}
              {note ? <span className="sleeve-note">{note}</span> : null}
            </div>
          </div>
        );
        break;
      case 'polaroid':
        holder = (
          <div className="pa-holder-frame pa-print pa-holder-polaroid" style={tilt}>
            {children}
            {note ? <span className="pa-polaroid-note">{note}</span> : null}
          </div>
        );
        break;
      case 'tape':
        holder = (
          <div className="pa-holder-frame pa-print pa-holder-tape" style={tilt}>
            {children}
            <span className="pa-tape" aria-hidden="true" />
            {cap}
          </div>
        );
        break;
      default:
        holder = (
          <div className="pa-holder-frame pa-corners pa-holder-corners" style={tilt}>
            {children}
            <Corners />
          </div>
        );
    }
    return (
      <figure ref={ref} data-variant={variant} className={cn('pa-holder', className)} {...props}>
        {holder}
        {caption ? <figcaption className="pa-caption">{caption}</figcaption> : null}
      </figure>
    );
  },
);
PhotoHolder.displayName = 'PhotoHolder';

export interface PhotoPlaceholderProps extends React.ComponentPropsWithoutRef<'span'> {
  /** One of the five placeholder gradients (`ph-1` … `ph-5`). */
  tone?: 1 | 2 | 3 | 4 | 5;
}

/** A 4:5 gradient standing in for a photograph. Decorative unless you give it `role="img"` and an `aria-label`. */
export const PhotoPlaceholder = React.forwardRef<HTMLSpanElement, PhotoPlaceholderProps>(
  ({ tone = 1, className, ...props }, ref) => (
    <span ref={ref} aria-hidden={props['aria-label'] ? undefined : true} className={cn('pa-photo', `ph-${tone}`, className)} {...props} />
  ),
);
PhotoPlaceholder.displayName = 'PhotoPlaceholder';
