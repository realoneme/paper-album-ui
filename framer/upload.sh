#!/bin/sh
# Upload framer/<Name>.tsx files to the connected Framer project (session $FRAMER_SESSION, default 1) and typecheck them.
# Usage: framer/upload.sh HelpTip Accordion ...
S=${FRAMER_SESSION:-1}
for name in "$@"; do cp "framer/$name.tsx" "/tmp/pa-framer-$name.tsx"; done
echo "$*" > /tmp/pa-framer-names.txt
npx @framer/agent@latest exec -s "$S" <<'FRAMER_EXEC'
const fs = require('fs');
const names = fs.readFileSync('/tmp/pa-framer-names.txt', 'utf8').trim().split(/\s+/).filter(Boolean);
const files = await framer.getCodeFiles();
state.codeFiles = state.codeFiles || {};
for (const name of names) {
  const code = fs.readFileSync(`/tmp/pa-framer-${name}.tsx`, 'utf8');
  const path = `Paper/${name}.tsx`;
  let file = files.find((f) => f.path === path || f.name === `${name}.tsx` || f.path.endsWith(`/${name}.tsx`));
  file = file ? await file.setFileContent(code) : await framer.createCodeFile(path, code);
  const diags = await file.typecheck();
  state.codeFiles[name] = { path: file.path, exports: file.exports.map((e) => ({ name: e.name, type: e.type, id: e.componentId ?? e.id })) };
  console.log(name, file.path, JSON.stringify(state.codeFiles[name].exports), 'diagnostics:', diags.length);
  for (const d of diags.slice(0, 10)) console.log('  ', JSON.stringify(d).slice(0, 300));
}
FRAMER_EXEC
