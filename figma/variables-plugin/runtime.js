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

// ---- Components: built from the variables and styles above, bound to the first theme ----

async function findVariable(collectionNames, name) {
  const all = await figma.variables.getLocalVariableCollectionsAsync();
  for (const cname of collectionNames) {
    const coll = all.find((c) => c.name === cname);
    if (!coll) continue;
    for (const id of coll.variableIds) {
      const v = await figma.variables.getVariableByIdAsync(id);
      if (v && v.name === name) return v;
    }
  }
  throw new Error(`Variable "${name}" not found: run Sync tokens first`);
}

const colorVar = (name) => findVariable([`${DATA.name} · Color`, `${DATA.name} · Color · ${DATA.themes[0].name}`], name);
const scaleVar = (group, name) => findVariable([`${DATA.name} · Scale`], `${group}/${name}`);

async function boundPaint(name) {
  const paint = { type: 'SOLID', color: { r: 0, g: 0, b: 0 } };
  return figma.variables.setBoundVariableForPaint(paint, 'color', await colorVar(name));
}

async function effect(s) {
  const e = { type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 1 }, offset: { x: s.x, y: s.y }, radius: s.blur, spread: s.spread, visible: true, blendMode: 'NORMAL', showShadowBehindNode: false };
  if (typeof s.color !== 'string') return Object.assign(e, { color: s.color });
  return figma.variables.setBoundVariableForEffect(e, 'color', await colorVar(s.color));
}

// Starter files allow three pages (Button, Icons, Components), so builds never create pages.
async function componentsPage() {
  const page = figma.root.children.find((p) => p.name === 'Components');
  if (!page) throw new Error('No "Components" page: rename an empty page to Components');
  await figma.setCurrentPageAsync(page);
  return page;
}

// Nodes a build creates, removed again if the build fails part-way.
const created = [];
function track(node) {
  created.push(node);
  return node;
}

function cleanUpFailedBuild() {
  for (const node of created.reverse()) if (!node.removed) node.remove();
}

// Auto-layout frame hugging both axes (figma.createAutoLayout exists only in the MCP runtime).
function autoLayout(direction, props = {}) {
  const frame = track(figma.createFrame());
  frame.layoutMode = direction;
  frame.primaryAxisSizingMode = 'AUTO';
  frame.counterAxisSizingMode = 'AUTO';
  frame.fills = [];
  return Object.assign(frame, props);
}

// A rebuild replaces the section an earlier build made, and clears variants a failed run left on the page.
function replaceExisting(page, name) {
  const old = page.findOne((n) => n.type === 'COMPONENT_SET' && n.name === name);
  if (old) {
    const section = old.parent.type === 'SECTION' && old.parent.name === name ? old.parent : old;
    section.remove();
    warnings.push(`Replaced the existing ${name}: instances of the old one are now detached`);
  }
  const strays = page.children.filter((n) => n.type === 'COMPONENT' && n.name.startsWith('Variant='));
  for (const n of strays) n.remove();
  if (strays.length) warnings.push(`Removed ${strays.length} stray variant(s) from an earlier failed run`);
}

// A section to the right of everything on the page; fitSection sizes it around its children.
function newSection(page, name) {
  const right = Math.max(0, ...page.children.map((n) => n.x + n.width));
  const section = track(figma.createSection());
  section.name = name;
  section.x = right + 80;
  section.y = 100;
  return section;
}

function fitSection(section) {
  const w = Math.max(...section.children.map((n) => n.x + n.width)) + 60;
  const h = Math.max(...section.children.map((n) => n.y + n.height)) + 60;
  section.resizeWithoutConstraints(w, h);
}

// A spacing value is a token name (bound) or a literal px number.
async function bindSpace(node, field, value) {
  if (typeof value === 'number') node[field] = value;
  else node.setBoundVariable(field, await scaleVar('spacing', value));
}

async function bindRadius(node, name) {
  const v = await scaleVar('radius', name);
  for (const k of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) node.setBoundVariable(k, v);
}

async function text(chars, spec, colorName, name) {
  const t = track(figma.createText());
  t.fontName = await loadFont(spec.family, spec.fontWeight, false);
  t.characters = chars;
  t.autoRename = false;
  t.name = name;
  t.fontSize = spec.fontSize;
  if (spec.lineHeight) t.lineHeight = { unit: 'PERCENT', value: spec.lineHeight };
  if (spec.letterSpacing) t.letterSpacing = { unit: 'PERCENT', value: spec.letterSpacing };
  t.fills = [await boundPaint(colorName)];
  return t;
}

// A wrapping text block that fills its auto-layout parent.
function fill(parent, t) {
  parent.appendChild(t);
  t.layoutSizingHorizontal = 'FILL';
  t.textAutoResize = 'HEIGHT';
  return t;
}

async function effectStyle(name) {
  const style = (await figma.getLocalEffectStylesAsync()).find((s) => s.name === `${DATA.themes[0].name}/${name}`);
  if (!style) throw new Error(`Effect style ${name} not found: run Sync tokens first`);
  return style;
}

async function setOn(pageName, setName) {
  const page = figma.root.children.find((p) => p.name === pageName);
  if (!page) return null;
  await page.loadAsync();
  return page.findOne((n) => n.type === 'COMPONENT_SET' && n.name === setName);
}

// Lucide icon components on the Icons page, named Icon/<name>.
async function iconComponents() {
  const page = figma.root.children.find((p) => p.name === 'Icons');
  if (!page) throw new Error('No Icons page');
  await page.loadAsync();
  return page.findAllWithCriteria({ types: ['COMPONENT'] }).filter((c) => c.name.startsWith('Icon/'));
}

const keyOf = (set, prefix) => Object.keys(set.componentPropertyDefinitions).find((k) => k.startsWith(`${prefix}#`));

async function buildBadge() {
  const B = DATA.badge;
  const page = await componentsPage();
  replaceExisting(page, 'Badge');
  const icons = await iconComponents();
  const plus = icons.find((c) => c.name === 'Icon/plus') || icons[0];
  const sizes = Object.keys(B.sizes);
  const variants = Object.keys(B.variants);
  const comps = [];

  for (const size of sizes) {
    for (const variant of variants) {
      const S = B.sizes[size];
      const V = B.variants[variant];
      const c = track(figma.createComponent());
      c.name = `Variant=${variant}, Size=${size}`;
      c.layoutMode = 'HORIZONTAL';
      c.counterAxisAlignItems = 'CENTER';
      c.resize(80, S.height);
      c.counterAxisSizingMode = 'FIXED';
      c.primaryAxisSizingMode = 'AUTO';
      await bindSpace(c, 'paddingLeft', S.padX);
      await bindSpace(c, 'paddingRight', S.padX);
      await bindSpace(c, 'itemSpacing', S.gap);
      await bindRadius(c, 'radius-full');
      c.fills = V.fill ? [await boundPaint(V.fill)] : [];
      if (V.stroke) {
        c.strokes = [await boundPaint(V.stroke.color)];
        c.strokeWeight = V.stroke.weight;
        c.strokeAlign = 'INSIDE';
      }
      if (V.inner) c.effects = [{ type: 'INNER_SHADOW', color: V.inner.color, offset: { x: 0, y: V.inner.y }, radius: V.inner.blur, spread: 0, visible: true, blendMode: 'NORMAL' }];

      // Icon slot, tinted like the label; style overrides go on before the instance is hidden.
      const icon = plus.createInstance();
      icon.name = 'Leading icon';
      c.appendChild(icon);
      icon.resize(S.icon, S.icon);
      const glyph = icon.findOne((n) => n.name === 'Glyph');
      glyph.strokes = [await boundPaint(V.text)];
      glyph.strokeWeight = S.iconStroke;
      icon.visible = false;

      c.appendChild(await text(V.label, { family: 'sans', fontSize: S.fontSize, fontWeight: S.fontWeight, letterSpacing: S.letterSpacing, lineHeight: 100 }, V.text, 'Label'));
      comps.push(c);
    }
  }

  const section = newSection(page, 'Badge');
  const set = figma.combineAsVariants(comps, section);
  set.name = 'Badge';
  set.description = 'A pill for status or category; one or two words. Semantic tones (success, warning, info, destructive) get a leading icon so status is not carried by colour alone. Code: src/components/ui/badge.tsx';
  const labelKey = set.addComponentProperty('Label', 'TEXT', 'Badge');
  const showKey = set.addComponentProperty('Leading icon', 'BOOLEAN', false);
  const iconKey = set.addComponentProperty('Icon', 'INSTANCE_SWAP', plus.id, { preferredValues: icons.map((i) => ({ type: 'COMPONENT', key: i.key })) });
  for (const c of set.children) {
    c.findOne((n) => n.name === 'Label').componentPropertyReferences = { characters: labelKey };
    c.findOne((n) => n.name === 'Leading icon').componentPropertyReferences = { visible: showKey, mainComponent: iconKey };
  }

  // Grid: one row per size, one column per variant.
  const PAD = 32, COL = 120, ROW = 52;
  for (const c of set.children) {
    const [, v, s] = /Variant=([^,]+), Size=(\w+)/.exec(c.name);
    c.x = PAD + variants.indexOf(v) * COL;
    c.y = PAD + sizes.indexOf(s) * ROW + (ROW - c.height) / 2;
  }
  set.resizeWithoutConstraints(PAD * 2 + variants.length * COL - 20, PAD * 2 + sizes.length * ROW);
  set.fills = [await boundPaint('background')];
  set.x = 60;
  set.y = 60;

  // Review: each size with its real labels, and icons on a few tones. Swap only to icons other than the
  // default, since re-picking the default resets the glyph's colour override.
  const review = autoLayout('VERTICAL', { name: 'Badge — review', itemSpacing: 16, paddingTop: 32, paddingBottom: 32, paddingLeft: 32, paddingRight: 32 });
  review.fills = [await boundPaint('background')];
  section.appendChild(review);
  const withIcon = { destructive: 'Icon/trash-2', info: 'Icon/share', wood: 'Icon/camera', success: 'Icon/download' };
  for (const size of sizes) {
    const row = autoLayout('HORIZONTAL', { name: `Size=${size}`, itemSpacing: 8, counterAxisAlignItems: 'CENTER' });
    row.fills = [];
    review.appendChild(row);
    for (const variant of variants) {
      const inst = set.children.find((c) => c.name === `Variant=${variant}, Size=${size}`).createInstance();
      const props = { [labelKey]: B.variants[variant].label };
      const iconName = withIcon[variant];
      if (iconName) Object.assign(props, { [showKey]: true, [iconKey]: icons.find((i) => i.name === iconName).id });
      inst.setProperties(props);
      row.appendChild(inst);
    }
  }
  review.x = set.x + set.width + 60;
  review.y = 60;
  fitSection(section);
  figma.viewport.scrollAndZoomIntoView([section]);
  return `Badge: ${variants.length} variants × ${sizes.length} sizes`;
}

async function buildCard() {
  const C = DATA.card;
  const page = await componentsPage();
  replaceExisting(page, 'Card');
  const buttons = await setOn('Button', 'Button');
  if (!buttons) warnings.push('Button set not found: the footer is left empty');
  const buttonLabel = buttons && keyOf(buttons, 'Label');
  const button = (variant, label) => {
    const inst = buttons.children.find((c) => c.name === `Variant=${variant}, Size=${C.footer.buttonSize}, State=Default`).createInstance();
    inst.setProperties({ [buttonLabel]: label });
    return inst;
  };

  const comps = [];
  for (const [variant, shadow] of Object.entries(C.variants)) {
    const c = track(figma.createComponent());
    c.name = `Variant=${variant}`;
    c.layoutMode = 'VERTICAL';
    c.resize(C.width, 200);
    c.counterAxisSizingMode = 'FIXED';
    c.primaryAxisSizingMode = 'AUTO';
    c.clipsContent = true;
    await bindSpace(c, 'itemSpacing', C.gap);
    c.fills = [await boundPaint('card')];
    await bindRadius(c, C.radius);
    await c.setEffectStyleIdAsync((await effectStyle(shadow)).id);

    const header = autoLayout('VERTICAL', { name: 'Header' });
    header.fills = [];
    c.appendChild(header);
    header.layoutSizingHorizontal = 'FILL';
    await bindSpace(header, 'paddingTop', C.header.top);
    await bindSpace(header, 'paddingLeft', C.header.x);
    await bindSpace(header, 'paddingRight', C.header.x);
    await bindSpace(header, 'itemSpacing', C.header.gap);
    fill(header, await text('Winter in Hokkaido', C.title, C.title.color, 'Title'));
    fill(header, await text('Snow light, harbour mornings and a very cold ferry.', C.description, C.description.color, 'Description'));

    const content = autoLayout('VERTICAL', { name: 'Content' });
    content.fills = [];
    c.appendChild(content);
    content.layoutSizingHorizontal = 'FILL';
    for (const side of ['paddingLeft', 'paddingRight']) await bindSpace(content, side, C.content.x);
    fill(content, await text('Forty-two photographs from a week on the north coast, printed on cotton rag.', C.body, C.body.color, 'Body'));

    const footer = autoLayout('HORIZONTAL', { name: 'Footer' });
    footer.fills = [];
    c.appendChild(footer);
    footer.layoutSizingHorizontal = 'FILL';
    for (const side of ['paddingLeft', 'paddingRight']) await bindSpace(footer, side, C.footer.x);
    await bindSpace(footer, 'paddingBottom', C.footer.bottom);
    await bindSpace(footer, 'itemSpacing', C.footer.gap);
    if (buttons) {
      footer.appendChild(button('default', 'Open album'));
      footer.appendChild(button('secondary', 'Share'));
    }
    comps.push(c);
  }

  const section = newSection(page, 'Card');
  const set = figma.combineAsVariants(comps, section);
  set.name = 'Card';
  set.description = 'A raised sheet with header, content and footer. `stack` adds page thickness for album cards. Footer actions use sm buttons. Code: src/components/ui/card.tsx';
  const titleKey = set.addComponentProperty('Title', 'TEXT', 'Winter in Hokkaido');
  const descKey = set.addComponentProperty('Description', 'TEXT', 'Snow light, harbour mornings and a very cold ferry.');
  const showDesc = set.addComponentProperty('Show description', 'BOOLEAN', true);
  const showContent = set.addComponentProperty('Show content', 'BOOLEAN', true);
  const showFooter = set.addComponentProperty('Show footer', 'BOOLEAN', true);
  for (const c of set.children) {
    c.findOne((n) => n.name === 'Title').componentPropertyReferences = { characters: titleKey };
    c.findOne((n) => n.name === 'Description').componentPropertyReferences = { characters: descKey, visible: showDesc };
    c.findOne((n) => n.name === 'Content').componentPropertyReferences = { visible: showContent };
    c.findOne((n) => n.name === 'Footer').componentPropertyReferences = { visible: showFooter };
  }

  const PAD = 40;
  set.children.forEach((c, i) => { c.x = PAD + i * (C.width + PAD); c.y = PAD; });
  set.resizeWithoutConstraints(PAD + set.children.length * (C.width + PAD), PAD * 2 + Math.max(...set.children.map((c) => c.height)));
  set.fills = [await boundPaint('background')];
  set.x = 60;
  set.y = 60;

  // Review: an album card and a session card, on the page ground.
  const review = autoLayout('HORIZONTAL', { name: 'Card — review', itemSpacing: 32, paddingTop: 40, paddingBottom: 40, paddingLeft: 40, paddingRight: 40 });
  review.fills = [await boundPaint('background')];
  section.appendChild(review);
  const album = set.children.find((c) => c.name === 'Variant=stack').createInstance();
  album.setProperties({ [titleKey]: 'Spring weddings', [descKey]: 'Twelve couples, one very muddy orchard.' });
  const session = set.children.find((c) => c.name === 'Variant=default').createInstance();
  session.setProperties({ [titleKey]: 'Family session', [descKey]: 'Ninety minutes outdoors, golden hour.', [showContent]: false });
  review.appendChild(album);
  review.appendChild(session);
  review.x = set.x + set.width + 60;
  review.y = 60;
  fitSection(section);
  figma.viewport.scrollAndZoomIntoView([section]);
  return 'Card: default and stack';
}

// Fixes from the first Figma pass: lucide strokes drawn in px instead of viewBox units, and the Field
// variants whose control showed the invalid ring.
async function repair() {
  const S = DATA.strokes;
  const done = [];

  const icons = await iconComponents();
  for (const icon of icons) {
    const glyph = icon.findOne((n) => n.name === 'Glyph');
    if (glyph) glyph.strokeWeight = S.icon;
  }
  done.push(`${icons.length} icons → ${S.icon}px`);

  const page = await componentsPage();
  const checkbox = page.findOne((n) => n.type === 'COMPONENT_SET' && n.name === 'Checkbox');
  if (checkbox) {
    const marks = checkbox.findAll((n) => n.type === 'VECTOR' && (n.parent.name === 'Tick' || n.parent.name === 'Dash'));
    for (const v of marks) v.strokeWeight = S.checkbox;
    done.push(`${marks.length} checkbox marks → ${S.checkbox}px`);
  }

  const field = page.findOne((n) => n.type === 'COMPONENT_SET' && n.name === 'Field');
  const input = page.findOne((n) => n.type === 'COMPONENT_SET' && n.name === 'Input');
  if (field && input) {
    const textKey = keyOf(input, 'Text');
    for (const c of field.children) {
      if (c.name === 'Message=Error') continue;
      const ctrl = c.findOne((n) => n.name === 'Control');
      ctrl.resetOverrides();
      ctrl.setProperties({ [textKey]: 'you@example.com' });
      if (ctrl.strokes.length) warnings.push(`${c.name}: control still has a stroke`);
    }
    done.push('Field controls reset');
  }
  return `Repaired: ${done.join(', ')}`;
}

async function syncTokens() {
  await colors();
  await scale();
  await textStyles();
  await effectStyles();
  return `${DATA.name}: ${DATA.colors.length} colours × ${DATA.themes.length} modes, ${DATA.textStyles.length} text styles, ${DATA.shadows.length * DATA.themes.length} shadow styles`;
}

const COMMANDS = { tokens: syncTokens, badge: buildBadge, card: buildCard, repair };

(async () => {
  try {
    // Hidden icon slots must stay reachable when setting their overrides.
    figma.skipInvisibleInstanceChildren = false;
    const done = await (COMMANDS[figma.command] || syncTokens)();
    const note = warnings.length ? ` (${warnings.length} notes, see console)` : '';
    warnings.forEach((w) => console.warn(w));
    figma.closePlugin(done + note);
  } catch (e) {
    console.error(e);
    cleanUpFailedBuild();
    figma.closePlugin(`Failed: ${e.message}`);
  }
})();
