# Sonner

Toasts: short notices stacked in a corner, newest on top. The icon disc takes the semantic tone (`success` by default, `.warning`, `.info`, `.error`); warning and error toasts hang a bookmark ribbon in the tone. This also covers shadcn's older Toast.

- Consumer provides: title, one line, optional action (Undo, Retry).
- React: mount `<Toaster />` once (bottom right, sonner `unstyled` + pa-toast class names), then call `toast(...)`, `toast.success`, `toast.error`, `toast.warning`, `toast.info` from `@/components/ui/sonner`. Options: `description`, `action: { label, onClick }`, `duration`. `ToastPreview` (`tone`, `title`, `description`, `action`) renders the same markup statically for docs.

```tsx
import { Toaster, toast } from '@/components/ui/sonner';

<Toaster />
toast.success('12 photos uploaded', {
  description: 'Added to “Winter in Hokkaido”.',
  action: { label: 'Undo', onClick: undoUpload },
});
toast.error('Upload failed', { description: 'IMG_2041.CR3 is over 80 MB.' });
```
