import '@/styles/extra/photo-holder.css';
import * as React from 'react';
import { cn } from '@/lib/cn';

export type PhotoHolderVariant = 'corners' | 'slits' | 'pocket' | 'tape';

export interface PhotoHolderProps extends Omit<React.ComponentPropsWithoutRef<'figure'>, 'children'> {
  /** How the print is held on the page. */
  variant?: PhotoHolderVariant;
  /** The photograph: an `<img>` or a placeholder such as `<PhotoPlaceholder tone={1} />`. */
  children: React.ReactNode;
  /** Caption below the holder (`figcaption`, `pa-caption`). */
  caption?: React.ReactNode;
  /** Handwritten note on the print border (`pocket` and `tape` prints only). */
  note?: React.ReactNode;
  /** Tilt in degrees, clamped to −8…8. Applies to the print (the sleeve of a pocket stays straight). */
  rotate?: number;
}

const clampRotation = (deg: number) => Math.max(-8, Math.min(8, deg));

const Corners = () => (
  <>
    <i aria-hidden="true" />
    <i aria-hidden="true" />
    <i aria-hidden="true" />
    <i aria-hidden="true" />
  </>
);

/** A print on an album page: wood corners, corner slits, a pocket sleeve, or tape. One holder per photo. */
export const PhotoHolder = React.forwardRef<HTMLElement, PhotoHolderProps>(
  ({ variant = 'corners', children, caption, note, rotate, className, ...props }, ref) => {
    const tilt = rotate ? { transform: `rotate(${clampRotation(rotate)}deg)` } : undefined;
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
            <div className={cn('pa-print', !note && 'pa-holder-pocket-print')} style={tilt}>
              {children}
              {cap}
            </div>
            <div className="sleeve" aria-hidden="true">
              <svg viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path d="M0 18 L0 9 C 50 1 100 14 150 8 C 200 2 250 13 300 6 L300 18 Z" />
              </svg>
            </div>
          </div>
        );
        break;
      case 'tape':
        holder = (
          <div className="pa-holder-frame pa-print" style={tilt}>
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
