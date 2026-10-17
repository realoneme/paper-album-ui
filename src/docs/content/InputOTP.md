# Input OTP

One groove per character for codes, grouped in threes.

- React: `<InputOTP maxLength={6} value onChange onComplete pattern>` (input-otp) composed of `InputOTPGroup`, `InputOTPSlot index` and `InputOTPSeparator`. The active slot shows a 2px `primary` inset and a caret. Label it with `aria-label` or `aria-labelledby`.
- Fits its container: slots start at 46×56 and shrink together with the gaps (down to 22px wide, same proportions), so six slots fit a 320px phone.

```tsx
<InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={code} onChange={setCode} aria-label="Client gallery code">
  <InputOTPGroup>
    <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
  </InputOTPGroup>
  <InputOTPSeparator />
  <InputOTPGroup>
    <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```
