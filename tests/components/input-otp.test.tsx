import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';

function Code(props: { onComplete?: (v: string) => void; disabled?: boolean; defaultValue?: string }) {
  return (
    <InputOTP maxLength={6} aria-label="Client gallery code" containerClassName="extra" {...props}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}

describe('InputOTP', () => {
  beforeAll(() => {
    // jsdom has no layout; input-otp probes for password-manager badges with elementFromPoint.
    document.elementFromPoint ??= () => null;
  });

  it('renders six slots in two groups with a hidden separator', () => {
    const { container } = render(<Code />);
    expect(screen.getByRole('textbox', { name: 'Client gallery code' })).toHaveAttribute('maxlength', '6');
    expect(container.querySelector('.pa-otp')).toHaveClass('extra');
    expect(container.querySelectorAll('.pa-otp-group')).toHaveLength(2);
    expect(container.querySelectorAll('.pa-otp-slot')).toHaveLength(6);
    expect(container.querySelector('.pa-otp-sep')).toHaveAttribute('aria-hidden', 'true');
  });

  it('fills slots as the user types and reports completion', async () => {
    const onComplete = vi.fn();
    const { container } = render(<Code onComplete={onComplete} />);
    const input = screen.getByRole('textbox', { name: 'Client gallery code' });
    await userEvent.click(input);
    await userEvent.keyboard('482');
    const slots = container.querySelectorAll('.pa-otp-slot');
    expect(slots[0]).toHaveTextContent('4');
    expect(slots[2]).toHaveTextContent('2');
    expect(slots[3]).toHaveClass('active');
    expect(slots[3].querySelector('.pa-otp-caret')).not.toBeNull();
    await userEvent.keyboard('915');
    expect(input).toHaveValue('482915');
    expect(onComplete).toHaveBeenCalledWith('482915');
  });

  it('is disabled when asked', async () => {
    const { container } = render(<Code disabled defaultValue="48" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(container.querySelector('.pa-otp')).toHaveClass('is-disabled');
    await userEvent.type(input, '2');
    expect(input).toHaveValue('48');
  });
});
