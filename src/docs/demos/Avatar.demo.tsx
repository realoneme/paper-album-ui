import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from '@/components/ui/avatar';
import type { DemoMeta } from '../types';

export const meta: DemoMeta = { name: 'Avatar', group: 'Data display', height: 130 };

export default function AvatarDemo() {
  return (
    <div className="pa-row" style={{ gap: 28 }}>
      {/* `photo` shows the placeholder gradient; in an app pass a real AvatarImage src. */}
      <Avatar size="lg" className="photo" role="img" aria-label="Mira K." />
      <Avatar role="img" aria-label="Diego Ruiz">
        <AvatarFallback>DR</AvatarFallback>
      </Avatar>
      <Avatar size="sm" tone="deep" role="img" aria-label="Hana Sato">
        <AvatarFallback>HS</AvatarFallback>
      </Avatar>
      <AvatarGroup aria-label="Collaborators: Mira K., Diego Ruiz, Hana Sato and 4 more">
        <Avatar className="photo" aria-hidden />
        <Avatar aria-hidden>
          <AvatarFallback>DR</AvatarFallback>
        </Avatar>
        <Avatar tone="deep" aria-hidden>
          <AvatarFallback>HS</AvatarFallback>
        </Avatar>
        <AvatarGroupCount aria-hidden>+4</AvatarGroupCount>
      </AvatarGroup>
    </div>
  );
}
