import '@/styles/extra/kbd.css';
import * as React from 'react';
import { cn } from '@/lib/cn';

export type KbdProps = React.HTMLAttributes<HTMLElement>;

/** A raised paper keycap for one key. */
export const Kbd = React.forwardRef<HTMLElement, KbdProps>(({ className, ...props }, ref) => (
  <kbd ref={ref} className={cn('pa-kbd', className)} {...props} />
));
Kbd.displayName = 'Kbd';

export type KbdGroupProps = React.HTMLAttributes<HTMLElement>;
/** Several keys pressed together, for example ⌘ K. */
export const KbdGroup = React.forwardRef<HTMLElement, KbdGroupProps>(({ className, ...props }, ref) => (
  <kbd ref={ref} className={cn('pa-kbd-group', className)} {...props} />
));
KbdGroup.displayName = 'KbdGroup';
