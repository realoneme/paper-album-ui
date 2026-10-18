#!/bin/sh
# shot.sh <nodeId> <out.jpg> [pagePath]
cd ~/code/paper-album-ui
echo "$1" > /tmp/pa-shot-id.txt
npx @framer/agent@latest exec -s 1 <<'FRAMER_EXEC' 2>&1 | tail -1 > /tmp/pa-shot-url.txt
const id = require('fs').readFileSync('/tmp/pa-shot-id.txt', 'utf8').trim();
const r = await framer.agent.readProject([{ type: 'screenshot', id }]);
console.log(r.results[0].image_url ?? JSON.stringify(r.results[0]).slice(0, 300));
FRAMER_EXEC
curl -s -o "$2" "$(cat /tmp/pa-shot-url.txt)"; file "$2" | cut -d, -f1,8
