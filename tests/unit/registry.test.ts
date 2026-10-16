import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';

export const SHADCN = [
  'Accordion', 'Alert', 'AlertDialog', 'AspectRatio', 'Avatar', 'Badge', 'Breadcrumb', 'Button', 'ButtonGroup',
  'Calendar', 'Card', 'Carousel', 'Chart', 'Checkbox', 'Collapsible', 'Combobox', 'Command', 'ContextMenu',
  'DataTable', 'DatePicker', 'Dialog', 'Drawer', 'DropdownMenu', 'Empty', 'Field', 'HoverCard', 'Input',
  'InputGroup', 'InputOTP', 'Item', 'Kbd', 'Label', 'Menubar', 'NativeSelect', 'NavigationMenu', 'Pagination',
  'Popover', 'Progress', 'RadioGroup', 'Resizable', 'ScrollArea', 'Select', 'Separator', 'Sheet', 'Sidebar',
  'Skeleton', 'Slider', 'Sonner', 'Spinner', 'Switch', 'Table', 'Tabs', 'Textarea', 'Toggle', 'ToggleGroup',
  'Tooltip', 'Typography',
];
const ALL = [...SHADCN, 'PhotoHolder'];
const kebab = (n: string) => n.replace(/OTP$/, 'Otp').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

describe('component inventory', () => {
  it('lists all 57 shadcn/ui components', () => expect(SHADCN).toHaveLength(57));

  it.each(ALL)('%s has a component, a demo, a guideline and a test', (name) => {
    const k = kebab(name);
    expect(existsSync(`src/components/ui/${k}.tsx`), `src/components/ui/${k}.tsx`).toBe(true);
    expect(existsSync(`src/docs/demos/${name}.demo.tsx`), `demo`).toBe(true);
    expect(existsSync(`tests/components/${k}.test.tsx`), `tests/components/${k}.test.tsx`).toBe(true);
    const md = readFileSync(`src/docs/content/${name}.md`, 'utf8');
    expect(md.startsWith('# ')).toBe(true);
    expect(md, 'guideline shows React usage').toMatch(/```tsx/);
    const demo = readFileSync(`src/docs/demos/${name}.demo.tsx`, 'utf8');
    expect(demo).toMatch(new RegExp(`name: '${name}'`));
  });

  it.each(ALL)('%s is exported from the package entry', (name) => {
    const index = readFileSync('src/components/ui/index.ts', 'utf8');
    expect(index).toContain(`'./${kebab(name)}'`);
  });
});
