import type { DemoGroup, DemoModule } from './types';

const demoModules = import.meta.glob<DemoModule>('./demos/*.demo.tsx', { eager: true });
const contentModules = import.meta.glob<string>('./content/*.md', { eager: true, query: '?raw', import: 'default' });

export const GROUP_ORDER: DemoGroup[] = ['Actions', 'Forms', 'Overlays', 'Menus', 'Feedback', 'Data display', 'Layout & navigation'];

export interface Entry {
  name: string;
  title: string;
  group: DemoGroup;
  height?: number;
  Demo: DemoModule['default'];
  doc: string;
}

const content = (file: string) => contentModules[`./content/${file}.md`] ?? '';

export const titleOf = (name: string) => name.replace(/([a-z])([A-Z])/g, '$1 $2').replace('Input O T P', 'Input OTP');

export const entries: Entry[] = Object.values(demoModules)
  .map((m) => ({
    name: m.meta.name,
    title: titleOf(m.meta.name),
    group: m.meta.group,
    height: m.meta.height,
    Demo: m.default,
    doc: content(m.meta.name).replace(/^# .*\n+/, ''),
  }))
  .sort((a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group) || a.name.localeCompare(b.name));

export const groups = GROUP_ORDER.map((g) => ({ name: g, items: entries.filter((e) => e.group === g) })).filter((g) => g.items.length);

export const overviewDoc = content('_overview');
export const mappingDoc = content('_mapping');

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
