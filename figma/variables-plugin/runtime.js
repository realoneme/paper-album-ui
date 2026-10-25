// Paper Album tokens -> Figma Variables, text styles and effect styles.
// Run again after tokens.json changes: it updates what it made before, matched by name.
// DATA is prepended by scripts/figma.mjs when it writes code.js.

const WEIGHTS = { 100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular', 500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black' };
const warnings = [];

async function collection(name) {
  const all = await figma.variables.getLocalVariableCollectionsAsync();
  return all.find((c) => c.name === name) || figma.variables.createVariableCollection(name);
}

async function variable(coll, name, type) {
  for (const id of coll.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    if (v && v.name === name) return v;
  }
  return figma.variables.createVariable(name, coll, type);
}

function modeIds(coll, names) {
  return names.map((name, i) => {
    const found = coll.modes.find((m) => m.name === name);
    if (found) return found.modeId;
    if (i === 0) { coll.renameMode(coll.modes[0].modeId, name); return coll.modes[0].modeId; }
    return coll.addMode(name);
  });
}

function describe(v, usage, cssName) {
  if (usage) v.description = usage;
  v.setVariableCodeSyntax('WEB', `var(--${cssName})`);
}

async function colors() {
  const coll = await collection(`${DATA.name} · Color`);
  try {
    await writeColors(coll, DATA.themes, modeIds(coll, DATA.themes.map((t) => t.name)));
  } catch (e) {
    // Starter plans allow one mode per collection: fall back to one collection per theme.
    if (!/modes? only/i.test(e.message)) throw e;
    if (coll.variableIds.length === 0) coll.remove();
    warnings.push('One mode per collection on this plan: made a colour collection per theme');
    for (const t of DATA.themes) {
      const single = await collection(`${DATA.name} · Color · ${t.name}`);
      await writeColors(single, [t], modeIds(single, [t.name]));
    }
  }
}

async function writeColors(coll, themes, modes) {
  const byName = {};
  for (const c of DATA.colors) {
    byName[c.name] = await variable(coll, c.name, 'COLOR');
    describe(byName[c.name], c.usage, c.name);
  }
  // Second pass so aliases can point at variables made later in the list.
  for (const c of DATA.colors) {
    themes.forEach((t, i) => {
      const v = c.values[t.id];
      byName[c.name].setValueForMode(modes[i], v.alias ? figma.variables.createVariableAlias(byName[v.alias]) : v);
    });
  }
}

async function scale() {
  const coll = await collection(`${DATA.name} · Scale`);
  const mode = coll.modes[0].modeId;
  for (const n of DATA.numbers) {
    const v = await variable(coll, `${n.group}/${n.name}`, 'FLOAT');
    describe(v, n.usage, n.name);
    v.scopes = n.scopes;
    v.setValueForMode(mode, n.value);
  }
  for (const f of DATA.fonts) {
    const v = await variable(coll, `font/${f.name}`, 'STRING');
    describe(v, f.css, f.name);
    v.scopes = ['FONT_FAMILY'];
    v.setValueForMode(mode, f.candidates[0]);
  }
}

async function loadFont(familyKey, weight, italic) {
  const font = DATA.fonts.find((f) => f.key === familyKey);
  const base = WEIGHTS[weight] || 'Regular';
  const styles = italic
    ? (base === 'Regular' ? ['Italic', 'Regular Italic'] : [`${base} Italic`, `${base.replace(/(Semi|Extra)/, '$1 ')} Italic`])
    : [base, base.replace(/(Semi|Extra)/, '$1 '), base.replace(/(Semi|Extra)B/, '$1b')];
  for (const family of font.candidates) {
    for (const style of styles) {
      try {
        const fontName = { family, style };
        await figma.loadFontAsync(fontName);
        return fontName;
      } catch (e) { /* try the next family or style name */ }
    }
  }
  warnings.push(`${font.candidates[0]} ${styles[0]} not available, used Inter`);
  const fallback = { family: 'Inter', style: 'Regular' };
  await figma.loadFontAsync(fallback);
  return fallback;
}

async function textStyles() {
  const existing = await figma.getLocalTextStylesAsync();
  for (const s of DATA.textStyles) {
    const name = `${s.group}/${s.name}`;
    const style = existing.find((x) => x.name === name) || figma.createTextStyle();
    style.name = name;
    if (s.usage) style.description = s.usage;
    style.fontName = await loadFont(s.family, s.fontWeight, s.italic);
    style.fontSize = s.fontSize;
    style.lineHeight = s.lineHeight;
    style.letterSpacing = s.letterSpacing || { unit: 'PERCENT', value: 0 };
  }
}

async function effectStyles() {
  const existing = await figma.getLocalEffectStylesAsync();
  for (const t of DATA.themes) {
    for (const s of DATA.shadows) {
      const name = `${t.name}/${s.name}`;
      const style = existing.find((x) => x.name === name) || figma.createEffectStyle();
      style.name = name;
      if (s.usage) style.description = s.usage;
      style.effects = s.values[t.id].map((e) => Object.assign(
        { type: e.inset ? 'INNER_SHADOW' : 'DROP_SHADOW', color: e.color, offset: { x: e.x, y: e.y }, radius: e.blur, spread: e.spread, visible: true, blendMode: 'NORMAL' },
        e.inset ? {} : { showShadowBehindNode: false },
      ));
    }
  }
}

async function syncTokens() {
  await colors();
  await scale();
  await textStyles();
  await effectStyles();
  return `${DATA.name}: ${DATA.colors.length} colours × ${DATA.themes.length} modes, ${DATA.textStyles.length} text styles, ${DATA.shadows.length * DATA.themes.length} shadow styles`;
}

(async () => {
  try {
    const done = await syncTokens();
    const note = warnings.length ? ` (${warnings.length} notes, see console)` : '';
    warnings.forEach((w) => console.warn(w));
    figma.closePlugin(done + note);
  } catch (e) {
    console.error(e);
    figma.closePlugin(`Failed: ${e.message}`);
  }
})();
