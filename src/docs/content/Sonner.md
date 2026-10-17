# Sonner

Toasts: short notices stacked at one edge of the screen, newest on top. The icon disc takes the semantic tone (`success` by default, `.warning`, `.info`, `.error`); warning and error toasts hang a bookmark ribbon in the tone. This also covers shadcn's older Toast.

- Consumer provides: title, one line, optional action (Undo, Retry).
- React: mount `<Toaster />` once near the root (it is `position: fixed`, so keep it out of clipped or transformed containers), then call `toast(...)`, `toast.success`, `toast.error`, `toast.warning`, `toast.info` from `@/components/ui/sonner`.
- `position`: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center` or `bottom-right` (default; it stays clear of primary actions and page headers). `toasterPositions` lists all six for pickers. Prefer `top-center` on phones-first layouts and keep one position per app.
- Tones instead of `richColors`: the Toaster is `unstyled`, so sonner's `richColors` has no effect; the tone comes from the call (`toast.success` / `.error` / `.warning` / `.info`), which adds the matching class and icon. Plain `toast()` is neutral.
- `duration`: milliseconds a toast stays (sonner default 4000). Set it for all toasts on `<Toaster duration={6000} />` or per call with `toast.error('…', { duration: 8000 })`; give errors and toasts with an action longer, and `Infinity` keeps one until dismissed. Toasts pause while hovered or focused.
- Other options: `description`, `action: { label, onClick }`, `id` (to update a toast in place). `ToastPreview` (`tone`, `title`, `description`, `action`) renders the same markup statically for docs.

```tsx
import { Toaster, toast } from '@/components/ui/sonner';

<Toaster position="top-center" duration={5000} />
toast.success('12 photos uploaded', {
  description: 'Added to “Winter in Hokkaido”.',
  action: { label: 'Undo', onClick: undoUpload },
});
toast.error('Upload failed', { description: 'IMG_2041.CR3 is over 80 MB.', duration: 8000 });
```
