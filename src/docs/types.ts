import type { ComponentType } from 'react';

export type DemoGroup = 'Actions' | 'Forms' | 'Overlays' | 'Menus' | 'Feedback' | 'Data display' | 'Layout & navigation';

/** Every src/docs/demos/<Name>.demo.tsx exports `meta` and a default demo component. */
export interface DemoMeta {
  /** PascalCase name; must match src/docs/content/<name>.md. */
  name: string;
  group: DemoGroup;
  /** Minimum height of the demo stage in px (overlays shown open need room). */
  height?: number;
}

export interface DemoModule {
  meta: DemoMeta;
  default: ComponentType;
}
