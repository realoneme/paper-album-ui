import '@/styles/extra/typography.css';
import * as React from 'react';
import { cn } from '@/lib/cn';

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;
export type TypographyH1Props = HeadingProps;
export type TypographyH2Props = HeadingProps;
export type TypographyH3Props = HeadingProps;
export type TypographyH4Props = HeadingProps;

/** Fraunces 48px. Wrap one phrase in <em> for the italic accent. */
export const TypographyH1 = React.forwardRef<HTMLHeadingElement, TypographyH1Props>(({ className, ...props }, ref) => (
  <h1 ref={ref} className={cn('pa-h1', className)} {...props} />
));
TypographyH1.displayName = 'TypographyH1';

export const TypographyH2 = React.forwardRef<HTMLHeadingElement, TypographyH2Props>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn('pa-h2', className)} {...props} />
));
TypographyH2.displayName = 'TypographyH2';

export const TypographyH3 = React.forwardRef<HTMLHeadingElement, TypographyH3Props>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('pa-h3', className)} {...props} />
));
TypographyH3.displayName = 'TypographyH3';

export const TypographyH4 = React.forwardRef<HTMLHeadingElement, TypographyH4Props>(({ className, ...props }, ref) => (
  <h4 ref={ref} className={cn('pa-h4', className)} {...props} />
));
TypographyH4.displayName = 'TypographyH4';

type ParagraphProps = React.HTMLAttributes<HTMLParagraphElement>;
export type TypographyLeadProps = ParagraphProps;
export type TypographyPProps = ParagraphProps;
export type TypographyMutedProps = ParagraphProps;

/** The standfirst under a heading. */
export const TypographyLead = React.forwardRef<HTMLParagraphElement, TypographyLeadProps>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('pa-lead', className)} {...props} />
));
TypographyLead.displayName = 'TypographyLead';

export const TypographyP = React.forwardRef<HTMLParagraphElement, TypographyPProps>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('pa-p', className)} {...props} />
));
TypographyP.displayName = 'TypographyP';

/** Small secondary text on paper. */
export const TypographyMuted = React.forwardRef<HTMLParagraphElement, TypographyMutedProps>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('pa-caption', className)} {...props} />
));
TypographyMuted.displayName = 'TypographyMuted';

export type TypographyBlockquoteProps = React.BlockquoteHTMLAttributes<HTMLQuoteElement>;
/** Italic Fraunces with a wood rule. */
export const TypographyBlockquote = React.forwardRef<HTMLQuoteElement, TypographyBlockquoteProps>(({ className, ...props }, ref) => (
  <blockquote ref={ref} className={cn('pa-quote', className)} {...props} />
));
TypographyBlockquote.displayName = 'TypographyBlockquote';

export type TypographyInlineCodeProps = React.HTMLAttributes<HTMLElement>;
/** Mono text on a muted chip. */
export const TypographyInlineCode = React.forwardRef<HTMLElement, TypographyInlineCodeProps>(({ className, ...props }, ref) => (
  <code ref={ref} className={cn('pa-code', className)} {...props} />
));
TypographyInlineCode.displayName = 'TypographyInlineCode';

export type TypographyListProps = React.HTMLAttributes<HTMLUListElement>;
export const TypographyList = React.forwardRef<HTMLUListElement, TypographyListProps>(({ className, ...props }, ref) => (
  <ul ref={ref} className={cn('pa-list', className)} {...props} />
));
TypographyList.displayName = 'TypographyList';

export type TypographyNoteProps = React.HTMLAttributes<HTMLSpanElement>;
/** A handwritten Caveat note, as on the back of a print. */
export const TypographyNote = React.forwardRef<HTMLSpanElement, TypographyNoteProps>(({ className, ...props }, ref) => (
  <span ref={ref} className={cn('pa-note', className)} {...props} />
));
TypographyNote.displayName = 'TypographyNote';
