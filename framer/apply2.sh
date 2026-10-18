#!/bin/sh
# Apply a phased DSL file to the connected Framer project. Phases are separated by lines "---"; each phase runs
# after the previous one, with temporary ids from earlier phases resolved to canonical ids.
# "a+b" denotes the compound id of node b inside replica variant a.
# Usage: framer/apply2.sh file.dsl   (prints diagnostics; saves the id map to /tmp/pa-framer-ids-<name>.json)
S=${FRAMER_SESSION:-1}
cp "$1" /tmp/pa-framer-apply.dsl
basename "$1" .dsl > /tmp/pa-framer-apply-name.txt
npx @framer/agent@latest exec -s "$S" <<'FRAMER_EXEC'
const fs = require('fs');
const phases = fs.readFileSync('/tmp/pa-framer-apply.dsl', 'utf8').split(/^---$/m);
const name = fs.readFileSync('/tmp/pa-framer-apply-name.txt', 'utf8').trim();
const ids = {};
const resolve = (t) => ids[t] ?? t;
for (const [i, raw] of phases.entries()) {
  const dsl = raw
    .replace(/\b([A-Za-z0-9_]+)\+([A-Za-z0-9_]+)\b/g, (_, v, n) => resolve(v) + resolve(n))
    .replace(/var\(--(variable|token)-([A-Za-z0-9_-]+)\)/g, (m, k, t) => `var(--${k}-${resolve(t)})`)
    .replace(/^(SET|CREATE_VARIANT|DEL|MOVE|DUPE)\s+([A-Za-z0-9_]+)/gm, (_, c, t) => `${c} ${resolve(t)}`)
    .replace(/\b(from|parent|component|scope)="([A-Za-z0-9_]+)"/g, (_, k, t) => `${k}="${resolve(t)}"`);
  if (!dsl.trim()) continue;
  const r = await framer.agent.applyChanges(dsl, { pagePath: '/' });
  Object.assign(ids, r.renamedIds || {});
  const { renamedIds: _, ...d } = r;
  console.log(`phase ${i + 1}`, JSON.stringify(d).slice(0, 2500));
}
state.ids = Object.assign(state.ids || {}, { [name]: ids });
fs.writeFileSync(`/tmp/pa-framer-ids-${name}.json`, JSON.stringify(ids));
console.log('ids', JSON.stringify(ids));
FRAMER_EXEC
