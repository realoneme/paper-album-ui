// Compiles src/tokens/tokens.json into src/styles/tokens.css (run before dev, build and tests).
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { SRC, loadTokens, compileTokensCss } from './lib.mjs';

mkdirSync(join(SRC, 'styles'), { recursive: true });
writeFileSync(join(SRC, 'styles', 'tokens.css'), compileTokensCss(loadTokens()));
