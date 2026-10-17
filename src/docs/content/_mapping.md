# shadcn mapping

Every shadcn/ui CSS variable has a token of the same name, so a shadcn `globals.css` can be replaced by this system's `tokens.css`.

| shadcn variable | Token | Paper Album meaning |
| --- | --- | --- |
| `--background` / `--foreground` | `background` / `foreground` | The board or table, text on it |
| `--card` / `--card-foreground` | `card` / `card-foreground` | Raised paper |
| `--popover` / `--popover-foreground` | `popover` / `popover-foreground` | Top sheet |
| `--primary` / `--primary-foreground` | `primary` / `primary-foreground` | Deep wood action |
| `--secondary` / `--secondary-foreground` | `secondary` / `secondary-foreground` | Paper key |
| `--muted` / `--muted-foreground` | `muted` / `muted-foreground` | Pressed-in paper, secondary text on paper |
| `--accent` / `--accent-foreground` | `accent` / `accent-foreground` | Hover fill |
| `--destructive` | `destructive` (+ `destructive-foreground`, `destructive-soft`) | Error, delete |
| (none) | `success` · `warning` · `info` (+ `-soft`, `on-`; `warning-text` for warning as text, `on-warning-icon` for icons on the fill) | The other three semantic states |
| `--border` / `--input` / `--ring` | `border` / `input` / `ring` (+ `ring-paper`) | Page edge, groove, focus |
| `--chart-1` … `--chart-5` | `chart-1` … `chart-5` | Wood, mid wood, light wood, slate, seal |
| `--sidebar-*` (8) | `sidebar-*` (8) | Sidebar paper |
| `--radius` | `radius-lg` (8px); `radius-md` = `--radius - 2px` | |

Intentional additions, each with a reason:

- `ground-muted` — secondary text on the ground; walnut's ground is dark while its paper is light.
- `ring-paper` — a focus ring that holds 3:1 on light paper in walnut.
- `wood`, `on-wood`, `primary-edge`, `seal`, `on-seal` — the album's materials and its one red highlight.
- `print`, `print-ink`, `glow`, `tape`, `backdrop` — photographs and scene dressing.
- `success`, `warning`, `info` with their `-soft` and `on-` tokens, plus `destructive-soft` — shadcn ships only `destructive`; a portfolio with bookings and payments needs all four states.
- Shadows `shadow-raised-1/2/3`, `shadow-key`, `shadow-press`, `shadow-sunken`, `shadow-print`, `shadow-layer` replace shadcn's flat borders with paper thickness.
- Component addition: **Photo Holder**, the four ways a print is held on a page.

## Component inventory (shadcn/ui, all 57 + 1)

Accordion · Alert · Alert Dialog · Aspect Ratio · Avatar · Badge · Breadcrumb · Button · Button Group · Calendar · Card · Carousel · Chart · Checkbox · Collapsible · Combobox · Command · Context Menu · Data Table · Date Picker · Dialog · Drawer · Dropdown Menu · Empty · Field · Hover Card · Input · Input Group · Input OTP · Item · Kbd · Label · Menubar · Native Select · Navigation Menu · Pagination · Popover · Progress · Radio Group · Resizable · Scroll Area · Select · Separator · Sheet · Sidebar · Skeleton · Slider · Sonner · Spinner · Switch · Table · Tabs · Textarea · Toggle · Toggle Group · Tooltip · Typography — plus Photo Holder.

shadcn's older Toast is covered by Sonner, as in shadcn itself.
