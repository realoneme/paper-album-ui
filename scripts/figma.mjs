// Exports tokens.json for Figma: a dev plugin that writes Variables + styles, and DTCG .tokens.json files.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, loadTokens, themeIds, rawValue } from './lib.mjs';

const OUT = join(ROOT, 'figma');
const ALIAS = /^\{([A-Za-z0-9][A-Za-z0-9_.-]*)\}$/;
const GENERIC = ['serif', 'sans-serif', 'monospace', 'cursive', 'system-ui', 'ui-monospace', 'ui-serif', 'ui-sans-serif'];

/** #rgb, #rrggbb, #rrggbbaa, rgb() or rgba() to Figma's 0-1 RGBA. */
export function parseColor(v) {
  const s = v.trim();
  if (s.startsWith('#')) {
    let h = s.slice(1);
    if (h.length === 3) h = [...h].map((c) => c + c).join('');
    const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255;
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 };
  }
  const m = /^rgba?\(([^)]+)\)$/.exec(s);
  if (!m) throw new Error(`Unsupported colour "${v}"`);
  const [r, g, b, a = 1] = m[1].split(',').map(Number);
  return { r: r / 255, g: g / 255, b: b / 255, a };
}

const px = (v) => {
  const m = /^(-?[\d.]+)(px)?$/.exec(String(v).trim());
  if (!m) throw new Error(`Expected px, got "${v}"`);
  return Number(m[1]);
};

/** CSS box-shadow list to Figma effects (first CSS shadow stays first). */
export function parseShadow(v) {
  return v.split(/,(?![^(]*\))/).map((part) => {
    let rest = part.trim();
    const inset = rest.startsWith('inset ');
    if (inset) rest = rest.slice(6);
    const colorMatch = /(#[0-9a-fA-F]+|rgba?\([^)]+\))$/.exec(rest);
    if (!colorMatch) throw new Error(`Shadow without colour: "${part}"`);
    const [x = 0, y = 0, blur = 0, spread = 0] = rest.slice(0, colorMatch.index).trim().split(/\s+/).map(px);
    return { inset, x, y, blur, spread, color: parseColor(colorMatch[1]) };
  });
}

// Component specs for the plugin's Build commands. Colours and spacing are token names the plugin binds;
// a number is a literal px value, and a shadow colour is either a token name or a parsed rgba.

// Lucide strokes are in viewBox units (24), so a stroke-width renders at width * size / 24 px.
export const iconStroke = (width, size) => Math.round((width * size / 24) * 100) / 100;

// Badge, mirroring .pa-badge in src/styles/paper-album.css and src/styles/extra/badge.css.
export const BADGE = {
  sizes: {
    default: { height: 28, padX: 'space-3', gap: 6, fontSize: 13, fontWeight: 600, icon: 16, iconStroke: iconStroke(1.8, 16) },
    sm: { height: 22, padX: 'space-2', gap: 'space-1', fontSize: 10, fontWeight: 400, icon: 10, iconStroke: iconStroke(2.2, 10) },
    xs: { height: 18, padX: 6, gap: 3, fontSize: 10, fontWeight: 400, letterSpacing: 1, icon: 10, iconStroke: iconStroke(2.2, 10) },
  },
  variants: {
    default: { fill: 'primary', text: 'primary-foreground', label: 'Featured' },
    secondary: { fill: 'muted', text: 'card-foreground', label: 'Draft', inner: { y: 1, blur: 2, color: parseColor('rgba(40, 24, 10, 0.2)') } },
    outline: { text: 'foreground', stroke: { color: 'ground-muted', weight: 1.5 }, label: 'Film' },
    destructive: { fill: 'destructive', text: 'destructive-foreground', label: 'Overdue' },
    seal: { fill: 'seal', text: 'on-seal', label: 'New' },
    wood: { fill: 'wood', text: 'on-wood', label: 'Album' },
    success: { fill: 'success-soft', text: 'success', label: 'Paid' },
    warning: { fill: 'warning-soft', text: 'warning-text', label: 'In review' },
    info: { fill: 'info-soft', text: 'info', label: 'Shared' },
  },
};

// Card, mirroring .pa-card* in src/styles/paper-album.css.
export const CARD = {
  width: 360,
  radius: 'radius-lg',
  variants: { default: 'shadow-raised-1', stack: 'shadow-raised-2' },
  title: { family: 'display', fontSize: 26, fontWeight: 400, lineHeight: 115, color: 'card-foreground' },
  description: { family: 'sans', fontSize: 14, fontWeight: 400, lineHeight: 160, color: 'muted-foreground' },
  body: { family: 'sans', fontSize: 15, fontWeight: 400, lineHeight: 160, color: 'card-foreground' },
  // CSS spaces header, content and footer with the content's 16px padding; here it is the card's gap, which
  // looks the same and keeps the header and footer apart when Show content is off.
  gap: 'space-4',
  header: { top: 'space-6', x: 'space-6', gap: 6 },
  content: { x: 'space-6' },
  footer: { x: 'space-6', bottom: 'space-6', gap: 'space-3', buttonSize: 'sm' },
};

// Strokes fixed by the Repair command (the first Figma pass drew them in px instead of viewBox units).
export const STROKES = {
  icon: iconStroke(1.8, 18), // svg.pa-i, 18px
  checkbox: iconStroke(3, 14), // .pa-check .box svg, 14px
};

const families = (css) => css.split(',').map((f) => f.trim().replace(/^"|"$/g, '')).filter((f) => !GENERIC.includes(f));

/** Everything the plugin needs, already parsed, so the plugin only writes. */
export function figmaData(t) {
  const themes = themeIds(t);
  const first = themes[0];
  const themed = (tok, parse) => Object.fromEntries(themes.map((th) => {
    const v = rawValue(tok, th, first);
    const m = ALIAS.exec(v);
    return [th, m ? { alias: m[1] } : parse(v)];
  }));
  return {
    name: t.name,
    themes: t.color.themes,
    colors: t.color.tokens.map((tok) => ({ name: tok.name, usage: tok.usage, values: themed(tok, parseColor) })),
    numbers: [
      ...t.spacing.tokens.map((tok) => ({ group: 'spacing', name: tok.name, usage: tok.usage, value: px(tok.value), scopes: ['GAP', 'WIDTH_HEIGHT'] })),
      ...t.radius.tokens.map((tok) => ({ group: 'radius', name: tok.name, usage: tok.usage, value: px(tok.value), scopes: ['CORNER_RADIUS'] })),
      // Figma reads opacity variables as percentages.
      ...t.opacity.tokens.map((tok) => ({ group: 'opacity', name: tok.name, usage: tok.usage, value: Math.round(Number(tok.value) * 100), scopes: ['OPACITY'] })),
    ],
    fonts: Object.entries(t.type.families).map(([key, css]) => ({ name: `font-${key}`, key, css, candidates: families(css) })),
    shadows: t.shadow.tokens.map((tok) => ({ name: tok.name, usage: tok.usage, values: themed(tok, parseShadow) })),
    textStyles: t.type.groups.flatMap((g) => g.styles.map((s) => ({
      group: g.name,
      name: s.name,
      usage: s.usage,
      family: g.family,
      fontSize: px(s.fontSize),
      lineHeight: typeof s.lineHeight === 'number'
        ? { unit: 'PERCENT', value: Math.round(s.lineHeight * 1000) / 10 }
        : { unit: 'PIXELS', value: px(s.lineHeight) },
      letterSpacing: s.letterSpacing ? { unit: 'PERCENT', value: Math.round(parseFloat(s.letterSpacing) * 1000) / 10 } : null,
      fontWeight: s.fontWeight,
      italic: s.fontStyle === 'italic',
    }))),
    badge: BADGE,
    card: CARD,
    strokes: STROKES,
  };
}

// DTCG (Design Tokens Community Group) files: one colour/shadow file per theme, the rest theme-free.
const round = (n) => Math.round(n * 10000) / 10000;
const dtcgColor = ({ r, g, b, a }) => {
  const hex = '#' + [r, g, b].map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('');
  return { colorSpace: 'srgb', components: [round(r), round(g), round(b)], alpha: round(a), hex };
};
const dim = (value) => ({ value, unit: 'px' });

export function dtcgFiles(t, data) {
  const files = {};
  for (const { id } of data.themes) {
    files[`color.${id}.tokens.json`] = Object.fromEntries(data.colors.map((c) => {
      const v = c.values[id];
      return [c.name, { $type: 'color', $value: v.alias ? `{${v.alias}}` : dtcgColor(v), $description: c.usage }];
    }));
    files[`shadow.${id}.tokens.json`] = Object.fromEntries(data.shadows.map((s) => {
      const v = s.values[id];
      return [s.name, {
        $type: 'shadow',
        $description: s.usage,
        $value: v.map((e) => ({ color: dtcgColor(e.color), offsetX: dim(e.x), offsetY: dim(e.y), blur: dim(e.blur), spread: dim(e.spread), inset: e.inset })),
      }];
    }));
  }
  const group = (g) => Object.fromEntries(data.numbers.filter((n) => n.group === g).map((n) => [n.name, n]));
  files['scale.tokens.json'] = {
    spacing: Object.fromEntries(Object.values(group('spacing')).map((n) => [n.name, { $type: 'dimension', $value: dim(n.value), $description: n.usage }])),
    radius: Object.fromEntries(Object.values(group('radius')).map((n) => [n.name, { $type: 'dimension', $value: dim(n.value), $description: n.usage }])),
    opacity: Object.fromEntries(t.opacity.tokens.map((tok) => [tok.name, { $type: 'number', $value: Number(tok.value), $description: tok.usage }])),
    font: Object.fromEntries(data.fonts.map((f) => [f.key, { $type: 'fontFamily', $value: f.candidates }])),
  };
  files['typography.tokens.json'] = Object.fromEntries(data.textStyles.map((s) => [s.name, {
    $type: 'typography',
    $description: s.usage,
    $value: {
      fontFamily: `{font.${s.family}}`,
      fontSize: dim(s.fontSize),
      fontWeight: s.fontWeight,
      lineHeight: s.lineHeight.unit === 'PERCENT' ? s.lineHeight.value / 100 : round(s.lineHeight.value / s.fontSize),
      letterSpacing: { value: s.letterSpacing ? s.letterSpacing.value / 100 : 0, unit: 'em' },
    },
  }]));
  return files;
}

const t = loadTokens();
const data = figmaData(t);

mkdirSync(join(OUT, 'tokens'), { recursive: true });
for (const [file, json] of Object.entries(dtcgFiles(t, data))) {
  writeFileSync(join(OUT, 'tokens', file), JSON.stringify(json, null, 2) + '\n');
}

const plugin = join(OUT, 'variables-plugin');
const runtime = readFileSync(join(plugin, 'runtime.js'), 'utf8');
writeFileSync(join(plugin, 'code.js'), `// Generated by scripts/figma.mjs from tokens.json — do not edit.\nconst DATA = ${JSON.stringify(data)};\n\n${runtime}`);

console.log(`figma/: ${data.colors.length} colours x ${data.themes.length} modes, ${data.numbers.length + data.fonts.length} scale variables, ${data.textStyles.length} text styles, ${data.shadows.length} shadows x ${data.themes.length}`);
