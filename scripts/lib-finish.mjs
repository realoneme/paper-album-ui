// Last step of build:lib. Points the type declarations' @/ imports at relative paths (tsc keeps the alias as
// written), drops their stylesheet imports and copies the tokens next to the stylesheet for apps that only want the colours.
import { copyFileSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { SRC } from './lib.mjs';

const LIB = join(SRC, '..', 'lib');

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]));

for (const file of walk(LIB).filter((f) => f.endsWith('.d.ts'))) {
  const src = readFileSync(file, 'utf8');
  // the stylesheets are bundled into styles.css, so the per-component imports go
  const out = src.replace(/^import ['"][^'"]+\.css['"];\n/gm, '').replace(/(['"])@\/([^'"]+)\1/g, (_, q, path) => {
    let rel = relative(dirname(file), join(LIB, path));
    if (!rel.startsWith('.')) rel = `./${rel}`;
    return `${q}${rel}${q}`;
  });
  if (out !== src) writeFileSync(file, out);
}

copyFileSync(join(SRC, 'styles', 'tokens.css'), join(LIB, 'tokens.css'));
copyFileSync(join(SRC, 'tokens', 'tokens.json'), join(LIB, 'tokens.json'));
