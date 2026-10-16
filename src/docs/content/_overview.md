Paper Album UI is a photography portfolio kit built from layered paper: prints are tucked into pockets, slipped under corners and pressed into an album, and every control is a sheet that is either raised above the page or pressed into it. It follows shadcn/ui's token names and component set, so anything written for shadcn maps across one to one.

## Content fundamentals

- Write UI copy in English, sentence case: "Book a session", "Order a print", never Title Case Buttons.
- Verbs on buttons; the toast repeats the verb in the past tense ("Uploaded", "Published").
- Speak to the visitor as "you" and about the studio as "we". No exclamation marks, no emoji.
- Template copy that a buyer must replace sits in square brackets: `[Studio Name]`, `[Album title]`, `[Place, Year]`. Never ship invented reviews, prices or statistics without brackets.
- Errors say what happened and what to do: "IMG_2041.CR3 is over 80 MB." then a Retry button.

## Themes

Three themes share every token name:

- **Parchment** (default) — warm parchment ground, cream paper, deep walnut primary.
- **Oak** — a honey wood ground with lighter paper; the warmest, most tactile.
- **Walnut** — a dark table with the same light paper on it. Text on the ground flips to light (`foreground`, `ground-muted`); text on paper stays dark (`card-foreground`, `muted-foreground`).

Switch themes by setting `data-theme` on the root. Never hard-code a hex in a component.

## Color

- Page: `background`, text on it `foreground`, secondary text on it `ground-muted`.
- Paper: `card` for raised sheets, `popover` for the top sheet, `muted` for anything pressed in (inputs, tracks, wells, hover rows). Text on paper is `card-foreground`; secondary text on paper is `muted-foreground`.
- One `primary` action per view (deep wood, `primary-foreground` text, `shadow-press`). Secondary actions are paper keys: `secondary` + `shadow-key`.
- `accent` is shadcn's hover fill (same as `muted`). The brand's red highlight is `seal`: the bookmark ribbon, a featured badge, the booking button. Use it once per view.
- Four semantic colours, each with a `-soft` ground and an `on-` colour: `info` (slate blue), `success` (moss), `warning` (amber), `destructive` (sealing-wax red). Alerts and toasts stay on paper (`card`) and carry the tone only in a round icon disc; warning and destructive also hang a bookmark ribbon in the tone from the top-right edge (the album's own bookmark), never a coloured side bar; badges use the `-soft` ground with the strong colour as text.
- A status never relies on colour alone: success and destructive sit at similar lightness, so every status also carries an icon (check, triangle, info, cross) or a word ("Paid", "Failed").
- `destructive` is for delete and failure only.
- `wood` fills chips that are on, slider and progress fills and photo corners; text on it is `on-wood` (dark in parchment, light in oak and walnut).
- `border` is decorative at about 1.4:1. Do not rely on it to show a control exists: controls are recognisable by `shadow-key`, `shadow-press` or `shadow-sunken`.
- Charts use `chart-1` … `chart-5`; highlight the current item with `chart-1` and leave the rest `chart-3`.
- Photo placeholders are the photographs' own colours, not tokens. Their white margin is `print`; handwriting on it is `print-ink`.

## Paper layers (elevation)

| Layer | Token | Used for |
| --- | --- | --- |
| Pressed in | `shadow-sunken` on `muted` | Inputs, textarea, OTP slots, switch and slider tracks, pressed toggles, wells |
| Level 0 | `border` hairline | Table rows, list rows |
| Level 1 | `shadow-raised-1` on `card` | Cards, panels, items, alerts |
| Level 2 | `shadow-raised-2` on `card` | Album cards, the open book, the sidebar shell (three stacked page edges) |
| Level 3 | `shadow-raised-3` on `popover` | Menus, popovers, hover cards, dialogs, toasts |
| Keys | `shadow-key` / `shadow-press` | Secondary / primary buttons |

Sheets and drawers add three 2px page edges on the side they slide from. Diorama layers cast `shadow-layer` upward.

## Type

- Headlines in Fraunces (`display-xl`, `display`, `h1`–`h4`). Put one phrase in italic 300 for emphasis: "Photographs, *tucked in* by hand."
- Everything else in Instrument Sans: `body` for reading, `ui` for controls, `small` for labels and cells, `caption` for helper text, `label` for uppercase eyebrows with 0.2em tracking.
- Caveat (`note`, `note-sm`) only for words written by hand on photographs and album pages. Never for UI.
- Mono (`code`, `kbd`) for keys, file names and tabular numbers. Use `font-variant-numeric: tabular-nums` in tables.

## Spacing, radius, layout

- 4px scale (`space-1` … `space-24`). Cards pad `space-6`, dialogs `space-7`, pages `space-8` on desktop and never less than `space-4`.
- Radii stay small: `radius-md` for controls, `radius-lg` for sheets, `radius-full` for pills and avatars.
- Touch targets are at least 44px tall; compact table controls at least 36px.

## Texture and imagery

- Every surface may carry a paper grain: an SVG `feTurbulence` noise layer at `opacity-grain`, `mix-blend-mode: multiply`, pointer-events off.
- Photographs sit in a `print` margin (10–12px, a little more at the bottom for a caption) with `shadow-print`, rotated −8° to +8° when loose.
- Four ways to hold a photo: corners (`wood` triangles), corner slits (paper flaps the colour of the page), pockets (a wavy-cut sleeve over the lower half) and tape (`tape`). See Photo Holder.
- Edges between sections are cut paper: an SVG wave in the next layer's colour with `shadow-layer`.

## Motion

- Press: buttons sink 2px on `:active`; hover lifts 1–2px.
- Pocket: on hover the print slides up 28–34px out of its pocket (0.55s, cubic-bezier(.2,.8,.2,1)).
- Pop-up: popovers and dialogs may hinge up from their bottom edge.
- Respect `prefers-reduced-motion`: drop transforms and parallax, keep state changes instant.

## Focus and accessibility

- Focus is a solid 2px `ring` outline with a 2px offset; on paper surfaces use `ring-paper`. Both reach 3:1 on the surfaces they land on in every theme.
- Body text pairs are checked at 4.5:1 in all three themes: `foreground` and `ground-muted` on `background`; `card-foreground` and `muted-foreground` on `card`, `popover` and `muted`; `primary-foreground` on `primary`; `on-wood` on `wood`; `on-seal` on `seal`; `destructive-foreground` on `destructive`; `success`, `warning`, `info` and `destructive` as text on `card`, `muted` and their own `-soft`; `on-success`, `on-warning`, `on-info` on their solid fills.
- `border`, `glow`, `tape` are decorative and below 3:1 by design.
- Use real buttons, links and inputs; icon-only buttons carry `aria-label`.

## Iconography

- Use Lucide (shadcn's icon set): 24px grid, stroke 1.8, round caps and joins, `currentColor`. Size 16 in menus, 18 in buttons, 20–22 in alerts.
- No emoji, no filled icon sets, no icons inside headings.

## Components

Components are CSS classes in `components/bundle.css` (prefix `pa-`) so they can be rebuilt as Framer components or wrapped around shadcn's Radix primitives. Each card below shows the markup. For behaviour (focus traps, keyboard menus, positioning) keep shadcn's own React components and swap their class names for these.
