# Aspect Ratio

Fixed-ratio frames that crop a photo to fill: 16:9, 3:2, 1:1, 4:5.

- Consumer provides: the image (object-fit: cover) and the ratio.
- React: `AspectRatio` (Radix) with `ratio` (`16 / 9`, `3 / 2`, `1`, `4 / 5`); an `<img>` child fills it with `object-fit: cover`.

```tsx
<AspectRatio ratio={16 / 9}>
  <img src={otaru} alt="Otaru canal at dawn" />
</AspectRatio>
```
