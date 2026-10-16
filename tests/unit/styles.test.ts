import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { tokens } from '@/tokens/resolve';

const read = (p: string) => readFileSync(p, 'utf8');
const list = (dir: string, ext: RegExp) => (existsSync(dir) ? readdirSync(dir).filter((f) => ext.test(f)).map((f) => join(dir, f)) : []);

type Fam = { tokens?: { name: string }[] };
const defined = new Set<string>();
for (const [k, v] of Object.entries(tokens as unknown as Record<string, Fam>)) if (k !== 'type') for (const t of v?.tokens ?? []) defined.add(t.name);
for (const k of Object.keys(tokens.type.families)) defined.add(`font-${k}`);

const css = [ 'src/styles/paper-album.css', 'src/docs/docs.css', ...list('src/styles/extra', /\.css$/) ];
const code = [ ...list('src/components/ui', /\.tsx?$/), ...list('src/docs/demos', /\.tsx$/), ...list('src/docs', /\.tsx$/) ];
const files = [...css, ...code];

// Custom properties declared anywhere in our own styles or inline styles (e.g. --tone, --z) count as defined.
const declared = new Set<string>();
for (const f of files) for (const m of read(f).matchAll(/(?:^|[;{\s"'`(,])['"]?--([A-Za-z0-9_.-]+)['"]?\s*:/g)) declared.add(m[1]);

// Variables the libraries set at runtime: Radix (--radix-*) and sonner (--width, --offset, --gap …).
const RUNTIME = /^(radix-[a-z-]+|width|offset|gap|front-toast-height|initial-height|toasts-before|z-index|lift|lift-amount)$/;

const used = (text: string) => [...text.matchAll(/var\(--([A-Za-z0-9_.-]+)(\$\{)?/g)].filter((m) => !m[2]).map((m) => m[1]);

describe('styles reference only defined tokens', () => {
  it.each(files)('%s', (f) => {
    const missing = [...new Set(used(read(f)))].filter((n) => !defined.has(n) && !declared.has(n) && !RUNTIME.test(n));
    expect(missing).toEqual([]);
  });
});

describe('no hard-coded colours in components', () => {
  const PHOTO = /^\s*\.ph-\d|^\s*\.pa-avatar\.photo/;
  it.each([...list('src/components/ui', /\.tsx?$/), ...list('src/styles/extra', /\.css$/), 'src/styles/paper-album.css'])('%s', (f) => {
    const offenders = read(f).split('\n').filter((l) => /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![0-9a-zA-Z-])/.test(l)).filter((l) => !PHOTO.test(l));
    expect(offenders).toEqual([]);
  });
});

describe('content rules', () => {
  it('shortcut glyphs appear only in the Kbd demo', () => {
    const withGlyphs = list('src/docs/demos', /\.tsx$/).filter((f) => /[⌘⇧]/.test(read(f)));
    expect(withGlyphs.every((f) => f.endsWith('Kbd.demo.tsx'))).toBe(true);
  });
  it('alerts and toasts never use coloured side bars', () => {
    for (const f of [...css, ...code]) expect(read(f), f).not.toMatch(/inset 4px 0 0/);
  });
});
