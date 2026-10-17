import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import userEvent from '@testing-library/user-event';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

describe('Textarea', () => {
  it('renders a labelled multi-line groove with merged classes', () => {
    render(
      <Field>
        <FieldLabel>Message</FieldLabel>
        <Textarea rows={3} className="extra" placeholder="[Tell us about your session]" />
      </Field>,
    );
    const ta = screen.getByRole('textbox', { name: 'Message' });
    expect(ta.tagName).toBe('TEXTAREA');
    expect(ta).toHaveClass('pa-textarea', 'extra');
    expect(ta).toHaveAttribute('rows', '3');
  });

  it('accepts multi-line typing', async () => {
    render(<Textarea aria-label="Message" />);
    await userEvent.type(screen.getByRole('textbox'), 'Golden hour{Enter}by the lake');
    expect(screen.getByRole('textbox')).toHaveValue('Golden hour\nby the lake');
  });

  it('picks up the field error and supports disabled', () => {
    render(
      <Field>
        <FieldLabel>Notes</FieldLabel>
        <Textarea disabled />
        <FieldError>Add a few words about the session.</FieldError>
      </Field>,
    );
    const ta = screen.getByRole('textbox', { name: 'Notes' });
    expect(ta).toBeDisabled();
    expect(ta).toHaveAttribute('aria-invalid', 'true');
    expect(ta).toHaveAccessibleDescription('Add a few words about the session.');
  });

  describe('autoResize', () => {
    // jsdom has no layout: scrollHeight follows the number of lines (22px each + 24px padding).
    const LINE = 22;
    const PAD = 12;
    let lines = 1;
    const mockLayout = () => {
      vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(() => lines * LINE + PAD * 2);
      const real = window.getComputedStyle.bind(window);
      vi.spyOn(window, 'getComputedStyle').mockImplementation((el: Element) => {
        const cs = real(el);
        if (!(el instanceof HTMLTextAreaElement)) return cs;
        return Object.assign(Object.create(cs) as CSSStyleDeclaration, {
          lineHeight: `${LINE}px`, fontSize: '15px', paddingTop: `${PAD}px`, paddingBottom: `${PAD}px`,
          borderTopWidth: '0px', borderBottomWidth: '0px',
        });
      });
    };
    afterEach(() => {
      vi.restoreAllMocks();
      lines = 1;
    });

    it('is off by default (no inline height, no auto class)', () => {
      mockLayout();
      render(<Textarea aria-label="Message" />);
      const ta = screen.getByRole('textbox');
      expect(ta).not.toHaveClass('pa-textarea-auto');
      expect(ta.style.height).toBe('');
      expect(ta).not.toHaveAttribute('autoresize');
    });

    it('grows and shrinks with uncontrolled typing, clamped by minRows', () => {
      mockLayout();
      render(<Textarea aria-label="Caption" autoResize minRows={2} />);
      const ta = screen.getByRole('textbox');
      expect(ta).toHaveClass('pa-textarea', 'pa-textarea-auto');
      expect(ta.style.minHeight).toBe(`${2 * LINE + 2 * PAD}px`);
      expect(ta.style.height).toBe(`${2 * LINE + 2 * PAD}px`);
      lines = 4;
      fireEvent.change(ta, { target: { value: 'a\nb\nc\nd' } });
      expect(ta.style.height).toBe(`${4 * LINE + 2 * PAD}px`);
      expect(ta.style.overflowY).toBe('hidden');
      lines = 1;
      fireEvent.change(ta, { target: { value: 'a' } });
      expect(ta.style.height).toBe(`${2 * LINE + 2 * PAD}px`);
    });

    it('follows a controlled value and scrolls past maxRows', () => {
      mockLayout();
      function Controlled() {
        const [v, setV] = useState('');
        return <Textarea aria-label="Caption" autoResize maxRows={3} value={v} onChange={(e) => setV(e.target.value)} />;
      }
      render(<Controlled />);
      const ta = screen.getByRole('textbox');
      lines = 2;
      fireEvent.change(ta, { target: { value: 'a\nb' } });
      expect(ta).toHaveValue('a\nb');
      expect(ta.style.height).toBe(`${2 * LINE + 2 * PAD}px`);
      lines = 8;
      fireEvent.change(ta, { target: { value: 'a\nb\nc\nd\ne\nf\ng\nh' } });
      expect(ta.style.height).toBe(`${3 * LINE + 2 * PAD}px`);
      expect(ta.style.maxHeight).toBe(`${3 * LINE + 2 * PAD}px`);
      expect(ta.style.overflowY).toBe('auto');
    });

    it('resizes when the controlled value changes from outside', () => {
      mockLayout();
      const { rerender } = render(<Textarea aria-label="Caption" autoResize value="" onChange={() => {}} />);
      const ta = screen.getByRole('textbox');
      lines = 5;
      rerender(<Textarea aria-label="Caption" autoResize value={'1\n2\n3\n4\n5'} onChange={() => {}} />);
      expect(ta.style.height).toBe(`${5 * LINE + 2 * PAD}px`);
    });

    it('still forwards object and callback refs', () => {
      mockLayout();
      const objRef = { current: null as HTMLTextAreaElement | null };
      let cbNode: HTMLTextAreaElement | null = null;
      const { unmount } = render(<Textarea aria-label="A" ref={objRef} autoResize />);
      expect(objRef.current).toBe(screen.getByRole('textbox'));
      unmount();
      render(<Textarea aria-label="B" ref={(n) => { cbNode = n; }} autoResize />);
      expect(cbNode).toBe(screen.getByRole('textbox'));
    });

    it('calls the consumer onChange', () => {
      const onChange = vi.fn();
      render(<Textarea aria-label="Caption" autoResize onChange={onChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hi' } });
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });
});
