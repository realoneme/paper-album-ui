# Paper Album UI

A layered-paper React design system for photography portfolios. Every control is a sheet of paper that is either raised above the page or pressed into it; photographs are tucked into pockets, slipped under corners and pressed into an album. Token names and the component set follow [shadcn/ui](https://ui.shadcn.com), so anything written for shadcn maps across one to one.

- **Tokens** — `src/tokens/tokens.json`: 55 colour tokens in three themes (Parchment, Oak, Walnut), four semantic colours (info, success, warning, destructive), an 18-style type scale, spacing, radius and paper-layer shadows. Compiled to `src/styles/tokens.css`.
- **Components** — `src/components/ui/`: all 57 shadcn/ui components plus Photo Holder, in React 18 + TypeScript, built on the same primitives as shadcn (Radix, cmdk, sonner, vaul, react-day-picker, Embla, react-resizable-panels, TanStack Table, Recharts, Lucide).
- **Styles** — `src/styles/paper-album.css` (`pa-` classes) plus per-component files in `src/styles/extra/`.
- **Docs site** — `src/docs/`: brand book, foundations and a live demo of every component, with a theme switcher.

## Use

```tsx
import '@/styles/index.css';              // tokens + component styles (load Fraunces, Instrument Sans and Caveat from Google Fonts)
import { Button, Card, CardHeader, CardTitle } from '@/components/ui';

<html data-theme="walnut">                // parchment (default) · oak · walnut
```

## Develop

```bash
npm ci
npm run dev          # docs site at http://localhost:5173
npm test             # typecheck, lint, unit tests, production build, end-to-end tests
```

| Script | What it runs |
| --- | --- |
| `npm run typecheck` | TypeScript, strict |
| `npm run lint` | ESLint (typescript-eslint, react-hooks) |
| `npm run test:unit` | Vitest: tokens and contrast in every theme, style/token references, component inventory, component behaviour (Testing Library) |
| `npm run build` | Production build of the docs site into `dist/` |
| `npm run test:e2e` | Playwright on the built site: every component in every theme (no errors, no overflow) and an axe accessibility scan per component |

`npx playwright install chromium` is needed once before the end-to-end tests.

## Repository layout

- `reference/` — the original HTML cards and brand book the React components were ported from.
- `scripts/tokens.mjs` — compiles the tokens; runs automatically before dev, build and tests.
- `tests/` — unit and component tests. `e2e/` — browser tests.

Deployed on Vercel as a static site (`vercel.json`).
