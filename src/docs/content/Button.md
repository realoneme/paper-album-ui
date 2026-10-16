# Button

Paper keys for actions: `default` (deep wood, once per view), `secondary`, `outline`, `ghost`, `link`, `destructive`, and the brand `seal` for the booking call to action.

- Props: `variant`, `size` (`sm` 36px, default 44px, `lg` 56px, `icon` 44×44), `disabled`, children (label first, optional Lucide icon at 18px).
- React: `<Button variant size asChild>` — `variant`: `default` · `secondary` · `outline` · `ghost` · `link` · `destructive` · `seal`; `size`: `default` · `sm` · `lg` · `icon`; `asChild` renders a link (or any child) with button styling. `buttonVariants()` returns the classes for custom elements.
- Do: verb-first sentence case ("Order a print"). One `default` per view. Icon-only buttons need `aria-label`.
- Don't: put `seal` and `default` side by side; use `link` for actions that change data.

```tsx
import { Button } from '@/components/ui/button';

<Button>View albums</Button>
<Button variant="seal" size="lg">Book a session</Button>
<Button variant="secondary" size="icon" aria-label="Next photo"><ChevronRight className="pa-i" aria-hidden /></Button>
<Button asChild variant="link"><a href="/journal">Read the journal</a></Button>
```
