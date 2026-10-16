import * as React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import type { DemoMeta } from '../types';
import { FakePage, useStage } from './support/overlay-stage';

export const meta: DemoMeta = { name: 'AlertDialog', group: 'Overlays', height: 500 };

const TITLE = 'Delete this album?';
const CONSEQUENCE = '“Winter in Hokkaido” and its 24 photos will be removed from your site. Originals stay in your library.';

/**
 * A Radix alert dialog is always modal (focus trap, scroll lock), so the stage starts with a static
 * picture of the open dialog, drawn with the same classes. The trigger opens the real one in the stage.
 */
export default function AlertDialogDemo() {
  const [stage, setStage] = useStage();
  const [preview, setPreview] = React.useState(true);
  const onOpenChange = (open: boolean) => {
    if (open) setPreview(false);
  };
  return (
    <div className="pa-stack">
      <AlertDialog onOpenChange={onOpenChange}>
        <div className="pa-row">
          <AlertDialogTrigger asChild>
            <Button variant="destructive"><Trash2 className="pa-i" aria-hidden />Delete album</Button>
          </AlertDialogTrigger>
        </div>
        <div ref={setStage} className="pa-stage">
          <FakePage />
          {preview && (
            <div className="pa-alert-preview" aria-hidden="true" data-testid="alert-preview">
              <div className="pa-backdrop" />
              <div className="pa-pop pa-dialog">
                <div className="pa-dialog-header">
                  <h2 className="pa-dialog-title">{TITLE}</h2>
                  <p className="pa-caption pa-alert-desc">{CONSEQUENCE}</p>
                </div>
                <div className="pa-dialog-footer">
                  <Button variant="secondary" tabIndex={-1} onClick={() => setPreview(false)}>Keep album</Button>
                  <Button variant="destructive" tabIndex={-1} onClick={() => setPreview(false)}>Delete</Button>
                </div>
              </div>
            </div>
          )}
          <AlertDialogContent container={stage}>
            <AlertDialogHeader>
              <AlertDialogTitle>{TITLE}</AlertDialogTitle>
              <AlertDialogDescription>{CONSEQUENCE}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep album</AlertDialogCancel>
              <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </div>
      </AlertDialog>
    </div>
  );
}
