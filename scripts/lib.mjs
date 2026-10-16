// Shared helpers for the build and the tests: reading tokens, compiling CSS, contrast, components.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const SRC = join(ROOT, 'src');
export const TOKENS_JSON = join(SRC, 'tokens', 'tokens.json');
export const REFERENCE = join(ROOT, 'reference');

export const SHADCN_COMPONENTS = [
  'Accordion', 'Alert', 'AlertDialog', 'AspectRatio', 'Avatar', 'Badge', 'Breadcrumb', 'Button', 'ButtonGroup',
  'Calendar', 'Card', 'Carousel', 'Chart', 'Checkbox', 'Collapsible', 'Combobox', 'Command', 'ContextMenu',
  'DataTable', 'DatePicker', 'Dialog', 'Drawer', 'DropdownMenu', 'Empty', 'Field', 'HoverCard', 'Input',
  'InputGroup', 'InputOTP', 'Item', 'Kbd', 'Label', 'Menubar', 'NativeSelect', 'NavigationMenu', 'Pagination',
  'Popover', 'Progress', 'RadioGroup', 'Resizable', 'ScrollArea', 'Select', 'Separator', 'Sheet', 'Sidebar',
  'Skeleton', 'Slider', 'Sonner', 'Spinner', 'Switch', 'Table', 'Tabs', 'Textarea', 'Toggle', 'ToggleGroup',
  'Tooltip', 'Typography',
];
export const ADDITIONS = ['PhotoHolder'];

export function loadTokens() {
  return JSON.parse(readFileSync(TOKENS_JSON, 'utf8'));
}

export const themeIds = (t) => t.color.themes.map((x) => x.id);

const ALIAS = /^\{([A-Za-z0-9][A-Za-z0-9_.-]*)\}$/;

/** Raw value of a colour or shadow token for one theme (falls back to the first theme). */
export function rawValue(token, theme, first) {
  const v = token.value;
  if (typeof v === 'string') return v;
  return v[theme] ?? v[first];
}

/** Resolve a colour token to a concrete value for a theme, following aliases. */
export function resolveColor(t, name, theme, seen = []) {
  const first = themeIds(t)[0];
  const tok = t.color.tokens.find((x) => x.name === name);
  if (!tok) throw new Error(`Unknown colour token "${name}"`);
  if (seen.includes(name)) throw new Error(`Alias cycle: ${[...seen, name].join(' -> ')}`);
  const v = rawValue(tok, theme, first);
  const m = ALIAS.exec(v);
  return m ? resolveColor(t, m[1], theme, [...seen, name]) : v;
}

const cssValue = (v) => {
  const m = ALIAS.exec(v);
  return m ? `var(--${m[1]})` : v;
};

/** tokens.css: first theme on :root, one block per further theme (overrides plus every alias). */
export function compileTokensCss(t) {
  const themes = themeIds(t);
  const first = themes[0];
  const themed = [...t.color.tokens, ...(t.shadow?.tokens ?? [])];
  const block = (sel, theme, isFirst) => {
    const lines = [];
    for (const tok of themed) {
      const v = tok.value;
      if (typeof v === 'string') { if (isFirst) lines.push(`  --${tok.name}: ${cssValue(v)};`); continue; }
      const val = v[theme] ?? v[first];
      if (!isFirst && val === v[first] && !ALIAS.test(val)) continue;
      lines.push(`  --${tok.name}: ${cssValue(val)};`);
    }
    return `${sel} {\n${lines.join('\n')}\n}`;
  };
  const out = [`/* ${t.name} — generated from tokens.json */`, block(`:root, [data-theme="${first}"]`, first, true)];
  for (const th of themes.slice(1)) out.push(block(`[data-theme="${th}"]`, th, false));
  const root = [];
  for (const fam of Object.keys(t)) {
    if (['name', 'version', 'color', 'type', 'shadow'].includes(fam) || !t[fam]?.tokens) continue;
    for (const tok of t[fam].tokens) root.push(`  --${tok.name}: ${tok.value};`);
  }
  for (const [k, v] of Object.entries(t.type.families)) root.push(`  --font-${k}: ${v};`);
  out.push(`:root {\n${root.join('\n')}\n}`);
  return out.join('\n') + '\n';
}

/** Every custom property name the tokens define. */
export function definedVars(t) {
  const names = new Set();
  for (const fam of Object.keys(t)) {
    if (fam === 'type') continue;
    for (const tok of t[fam]?.tokens ?? []) names.add(tok.name);
  }
  for (const k of Object.keys(t.type.families)) names.add(`font-${k}`);
  return names;
}

// WCAG 2 relative luminance and contrast ratio, for #rrggbb values.
export function luminance(hex) {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Component guideline folders under reference/components (README + original HTML card). */
export function listComponents() {
  const dir = join(REFERENCE, 'components');
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const folder = join(dir, d.name);
      const previewPath = join(folder, 'preview.html');
      const readmePath = join(folder, 'README.md');
      const preview = existsSync(previewPath) ? readFileSync(previewPath, 'utf8') : null;
      const readme = existsSync(readmePath) ? readFileSync(readmePath, 'utf8') : null;
      const marker = preview ? /^<!--\s*@dsCard([^>]*)-->/.exec(preview) : null;
      const group = marker ? (/group="([^"]*)"/.exec(marker[1]) || [])[1] : undefined;
      const height = marker ? Number((/height=(\d+)/.exec(marker[1]) || [])[1] || 120) : undefined;
      return { name: d.name, folder, preview, readme, marker: !!marker, group, height };
    });
}

export function previewBody(html) {
  const m = /<body>([\s\S]*)<\/body>/.exec(html);
  return m ? m[1].trim() : '';
}
export function previewHeadStyles(html) {
  const head = html.split('<body>')[0];
  return [...head.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n');
}

export function titleOf(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1 $2').replace('Input O T P', 'Input OTP');
}
