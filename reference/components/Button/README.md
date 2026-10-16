# Button

Paper keys for actions: `default` (deep wood, once per view), `secondary`, `outline`, `ghost`, `link`, `destructive`, and the brand `seal` for the booking call to action.

- Props: `variant`, `size` (`sm` 36px, default 44px, `lg` 56px, `icon` 44×44), `disabled`, children (label first, optional Lucide icon at 18px).
- Classes: `pa-btn` + `pa-btn-<variant>` + optional `pa-btn-sm|lg|icon`.
- Do: verb-first sentence case ("Order a print"). One `default` per view. Icon-only buttons need `aria-label`.
- Don't: put `seal` and `default` side by side; use `link` for actions that change data.
