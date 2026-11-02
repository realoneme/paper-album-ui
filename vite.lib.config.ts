// Builds the npm package into lib/: one ES module per source file (so apps only load what they import) and one
// stylesheet with the tokens and every component's styles. The docs site keeps vite.config.ts and dist/.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import pkg from './package.json' with { type: 'json' };

const deps = [...Object.keys(pkg.dependencies), ...Object.keys(pkg.peerDependencies)];
const external = (id: string) => deps.some((d) => id === d || id.startsWith(`${d}/`));

// Rollup drops module-level directives, so put 'use client' back on every module whose source starts with it.
const isClient = (id: string | null) => !!id && /^\s*['"]use client['"]/.test(readFileSync(id, 'utf8'));

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    outDir: 'lib',
    emptyOutDir: true,
    sourcemap: false,
    minify: false,
    cssCodeSplit: false,
    lib: { entry: 'src/index.ts', formats: ['es'], cssFileName: 'styles' },
    rollupOptions: {
      external,
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        warn(warning);
      },
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
        banner: (chunk) => (isClient(chunk.facadeModuleId) ? "'use client';" : ''),
      },
    },
  },
});
