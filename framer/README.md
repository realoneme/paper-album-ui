# Paper Album UI for Framer

Framer versions of the most-used Paper Album UI components, for the template on Framer.

## What lives where

- **Styles** (in the Framer project): 34 colour styles named `Paper/…` (light = Parchment, dark = Walnut) and 16 text styles (Fraunces headings, Instrument Sans text, Caveat notes, Micro). They are generated from `src/tokens/tokens.json`.
- **Canvas components** (built in the Framer project, editable on the canvas): Badge (8 variants), Album Card (its button is the Button code component), Toast (Success, Info, Warning, Error).
- **Code components** (source in this folder, uploaded as `Paper/<Name>.tsx`): Button (Primary, Secondary, Seal, Outline, Ghost, Destructive; three sizes, optional icon, link or click; pressed it sinks onto its edge and drops only the soft shadow, held at least 140ms so a trackpad tap shows it), Help Tip, Accordion, Tabs, Switch, Toggle Group, Carousel (click the current print to turn it over for its details), Photo Holder (Corners and Slits with paper-thick corners, Pocket with a wave-cut sleeve that names the photo and lifts it out on hover, Tape that rocks when pressed, Polaroid that is nudged askew on hover). Forms and feedback: Checkbox (the tick draws in; on, off or mixed), Radio Group (paper rows, arrow keys), Input (focus groove and halo, error text, icons, password show/hide), Textarea (grows with the text, optional character count), Select (native, so phones use their own picker), Input OTP (one real input over the slots: type, paste or autofill), Spinner (the gooey comet), Progress (fills with a light sweep, success at 100, or travels when the length is unknown), Toast (a button that drops stacking toasts into a screen corner; hover fans them out, swipe dismisses) and Calendar (one day or a range, keyboard by day, week and month). Colours are property controls; bind them to the `Paper/…` colour styles in Framer so they follow the theme.
- **Home page**: a showcase with one instance of everything; the form and feedback components have their own section.

## Updating a code component

1. Edit `framer/<Name>.tsx`. Framer's rules apply: one file, a default-exported named function, imports only from `react`, `react-dom`, `framer` and `framer-motion`, a `@framerSupportedLayoutWidth/Height` annotation, and a `defaultValue` for every property control.
2. Connect a session (`npx @framer/agent@latest session new <project id>`) and run `framer/upload.sh <Name> …`. It creates or updates `Paper/<Name>.tsx` in the project and prints Framer's type-check diagnostics.

`framer/apply2.sh` applies phased canvas changes (see the comment at the top of the script).
