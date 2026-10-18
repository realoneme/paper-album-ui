# Paper Album UI for Framer

Framer versions of the most-used Paper Album UI components, for the template on Framer.

## What lives where

- **Styles** (in the Framer project): 34 colour styles named `Paper/…` (light = Parchment, dark = Walnut) and 16 text styles (Fraunces headings, Instrument Sans text, Caveat notes, Micro). They are generated from `src/tokens/tokens.json`.
- **Canvas components** (built in the Framer project, editable on the canvas): Button (Primary, Secondary, Seal, Ghost, each with hover and pressed states), Badge (8 variants), Album Card, Photo Holder (Corners, Slits, Tape, Polaroid), Toast (Success, Info, Warning, Error).
- **Code components** (source in this folder, uploaded as `Paper/<Name>.tsx`): Help Tip, Accordion, Tabs, Switch, Toggle Group, Carousel, Photo Pocket (the pocket holder, with the SVG wave cut and a lift-out on hover). Colours are property controls; bind them to the `Paper/…` colour styles in Framer so they follow the theme.
- **Home page**: a showcase with one instance of everything.

## Updating a code component

1. Edit `framer/<Name>.tsx`. Framer's rules apply: one file, a default-exported named function, imports only from `react`, `react-dom`, `framer` and `framer-motion`, a `@framerSupportedLayoutWidth/Height` annotation, and a `defaultValue` for every property control.
2. Connect a session (`npx @framer/agent@latest session new <project id>`) and run `framer/upload.sh <Name> …`. It creates or updates `Paper/<Name>.tsx` in the project and prints Framer's type-check diagnostics.

`framer/apply2.sh` applies phased canvas changes (see the comment at the top of the script).
