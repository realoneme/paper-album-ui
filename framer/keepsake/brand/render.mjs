import { chromium } from '/Users/rebeccasakurai/code/paper-album-ui/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 512, height: 512 } });
await p.goto('file://' + process.cwd() + '/favicon.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
console.log(await p.evaluate(() => document.fonts.check("600 300px Fraunces")));
await p.locator('.wrap').screenshot({ path: 'favicon-512.png' });
await b.close();
