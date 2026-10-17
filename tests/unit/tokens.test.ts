import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { THEMES, resolveColor, tokens, type Theme } from '@/tokens/resolve';
import { contrast } from './contrast';

const themes = THEMES.map((t) => t.id);
const NAME = /^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/;
const COLOR = /^(#[0-9a-f]{3}|#[0-9a-f]{6}|#[0-9a-f]{8}|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*(0|1|0?\.\d+)\s*)?\)|\{[A-Za-z0-9][A-Za-z0-9_.-]*\})$/;
type Fam = { tokens?: { name: string; usage?: string }[] };
const families = Object.entries(tokens as unknown as Record<string, Fam>).filter(([k, v]) => k !== 'type' && Array.isArray(v?.tokens));

describe('tokens.json', () => {
  it('has three themes with parchment first', () => {
    expect(themes).toEqual(['parchment', 'oak', 'walnut']);
  });

  it('uses each valid name once across families, each with a usage note', () => {
    const seen = new Map<string, string>();
    for (const [fam, f] of families) {
      for (const tok of f.tokens!) {
        expect(tok.name).toMatch(NAME);
        expect(seen.has(tok.name), `"${tok.name}" in ${seen.get(tok.name)} and ${fam}`).toBe(false);
        seen.set(tok.name, fam);
        expect((tok.usage ?? '').length, `${tok.name} usage`).toBeGreaterThan(3);
      }
    }
  });

  it('has valid colour values in every theme and resolvable aliases', () => {
    for (const tok of tokens.color.tokens) {
      for (const th of themes) {
        const v = tok.value as string | Record<string, string>;
        const raw = typeof v === 'string' ? v : (v[th] ?? v[themes[0]]);
        expect(raw, `${tok.name}/${th}`).toMatch(COLOR);
        expect(() => resolveColor(tok.name, th)).not.toThrow();
      }
    }
  });

  it('covers every shadcn/ui variable and the four semantic colours', () => {
    const names = new Set(tokens.color.tokens.map((t) => t.name));
    const required = ['background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground', 'primary', 'primary-foreground',
      'secondary', 'secondary-foreground', 'muted', 'muted-foreground', 'accent', 'accent-foreground', 'destructive', 'border', 'input', 'ring',
      'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5', 'sidebar', 'sidebar-foreground', 'sidebar-primary', 'sidebar-primary-foreground',
      'sidebar-accent', 'sidebar-accent-foreground', 'sidebar-border', 'sidebar-ring',
      'info', 'info-soft', 'on-info', 'success', 'success-soft', 'on-success', 'warning', 'warning-soft', 'warning-text', 'on-warning', 'destructive-soft', 'destructive-foreground'];
    expect(required.filter((n) => !names.has(n))).toEqual([]);
  });

  it('defines the type scale', () => {
    for (const k of ['display', 'sans', 'hand', 'mono']) expect(tokens.type.families).toHaveProperty(k);
    const styles = tokens.type.groups.flatMap((g) => g.styles.map((s) => s.name));
    for (const s of ['display-xl', 'display', 'h1', 'h2', 'h3', 'h4', 'lead', 'large', 'body', 'small', 'caption', 'label', 'code', 'blockquote']) expect(styles).toContain(s);
  });
});

const PAIRS: [string, string, number][] = [
  ['foreground', 'background', 4.5], ['ground-muted', 'background', 4.5],
  ['card-foreground', 'card', 4.5], ['card-foreground', 'muted', 4.5], ['card-foreground', 'popover', 4.5],
  ['muted-foreground', 'card', 4.5], ['muted-foreground', 'muted', 4.5],
  ['primary-foreground', 'primary', 4.5], ['secondary-foreground', 'secondary', 4.5], ['accent-foreground', 'accent', 4.5],
  ['on-wood', 'wood', 4.5], ['on-seal', 'seal', 4.5], ['print-ink', 'print', 4.5], ['destructive-foreground', 'destructive', 4.5],
  ['sidebar-foreground', 'sidebar', 4.5], ['sidebar-primary-foreground', 'sidebar-primary', 4.5], ['sidebar-accent-foreground', 'sidebar-accent', 4.5],
  ...(['info', 'success', 'warning', 'destructive'] as const).flatMap((s): [string, string, number][] => {
    // Warning is a bright orange for marks; its text colour is the separate deep warning-text.
    const text = s === 'warning' ? 'warning-text' : s;
    return [
      [text, 'card', 4.5], [text, 'muted', 4.5], [text, `${s}-soft`, 4.5], ['card-foreground', `${s}-soft`, 4.5],
      [s === 'destructive' ? 'destructive-foreground' : `on-${s}`, s, 4.5],
    ];
  }),
  ['ring', 'background', 3], ['ring-paper', 'card', 3], ['ring-paper', 'muted', 3], ['primary', 'card', 3],
];

describe.each(themes)('contrast in %s', (th) => {
  it.each(PAIRS)('%s on %s ≥ %d:1', (fg, bg, min) => {
    expect(contrast(resolveColor(fg, th as Theme), resolveColor(bg, th as Theme))).toBeGreaterThanOrEqual(min);
  });
});

describe('compiled tokens.css', () => {
  const css = readFileSync('src/styles/tokens.css', 'utf8');
  it('declares the first theme on :root', () => {
    expect(css).toContain(':root, [data-theme="parchment"]');
  });
  it.each(['oak', 'walnut'])('redeclares aliases inside the %s block', (th) => {
    const block = css.split(`[data-theme="${th}"]`)[1].split('}')[0];
    for (const alias of ['--popover: var(--card)', '--accent: var(--muted)', '--input: var(--muted)']) expect(block).toContain(alias);
  });
});
