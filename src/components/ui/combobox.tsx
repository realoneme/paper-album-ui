import '@/styles/extra/combobox.css';
import * as React from 'react';
import { Popover as PopoverPrimitive } from 'radix-ui';
import { Command as CommandPrimitive } from 'cmdk';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ComboboxOption {
  value: string;
  label: string;
  /** Secondary text on the right, e.g. a country. Also searched. */
  description?: string;
  disabled?: boolean;
  /** Extra search terms. */
  keywords?: string[];
}

export interface ComboboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'size'> {
  /** The visible label; also the input's accessible name. */
  label: string;
  /** Visually hide the label (it stays the accessible name). */
  hideLabel?: boolean;
  options: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null, option: ComboboxOption | null) => void;
  /** Initial text in the input (defaults to the selected option's label). */
  defaultSearch?: string;
  /** Shown when nothing matches. */
  emptyMessage?: React.ReactNode;
  /** Accessible name of the results list. */
  listLabel?: string;
  /** Leading icon inside the groove. */
  icon?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Class for the outer wrapper. `className` goes on the input groove. */
  wrapperClassName?: string;
}

/**
 * A searchable select: type into the groove, pick from the filtered list (cmdk + Radix Popover, non-modal).
 * Arrow keys move through results, Enter picks, Escape closes.
 */
export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      label,
      hideLabel = false,
      options,
      value: valueProp,
      defaultValue = null,
      onValueChange,
      defaultSearch,
      emptyMessage = 'No results found.',
      listLabel,
      icon,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      className,
      wrapperClassName,
      onKeyDown,
      onClick,
      ...inputProps
    },
    ref,
  ) => {
    const [innerValue, setInnerValue] = React.useState<string | null>(defaultValue);
    const value = valueProp !== undefined ? valueProp : innerValue;
    const selected = options.find((o) => o.value === value) ?? null;
    const [search, setSearch] = React.useState(defaultSearch ?? selected?.label ?? '');
    const [innerOpen, setInnerOpen] = React.useState(defaultOpen);
    const open = openProp ?? innerOpen;
    const setOpen = (next: boolean) => {
      if (openProp === undefined) setInnerOpen(next);
      onOpenChange?.(next);
    };

    const inputRef = React.useRef<HTMLInputElement>(null);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
    const [inputId, setInputId] = React.useState<string>();
    React.useLayoutEffect(() => {
      setInputId(inputRef.current?.id);
    }, []);
    // cmdk always reports aria-expanded="true"; keep it truthful.
    React.useLayoutEffect(() => {
      inputRef.current?.setAttribute('aria-expanded', String(open));
    });

    const choose = (option: ComboboxOption) => {
      if (valueProp === undefined) setInnerValue(option.value);
      onValueChange?.(option.value, option);
      setSearch(option.label);
      setOpen(false);
    };

    return (
      <CommandPrimitive label={label} loop className={cn('pa-combobox', wrapperClassName)}>
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
          {/* The input is named by cmdk's hidden label; this one is for sight and click-to-focus. */}
          <label className="pa-label" htmlFor={inputId} aria-hidden hidden={hideLabel}>
            {label}
          </label>
          <PopoverPrimitive.Anchor asChild>
            <div ref={anchorRef} className={cn('pa-igroup', className)}>
              {icon}
              <CommandPrimitive.Input
                ref={inputRef}
                value={search}
                onValueChange={(next) => {
                  setSearch(next);
                  if (!open) setOpen(true);
                }}
                onClick={(e) => {
                  onClick?.(e);
                  if (!open) setOpen(true);
                }}
                onKeyDown={(e) => {
                  onKeyDown?.(e);
                  if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                    e.preventDefault();
                    setOpen(true);
                  }
                }}
                {...inputProps}
              />
            </div>
          </PopoverPrimitive.Anchor>
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
              className="pa-pop pa-menu pa-combobox-content"
              align="start"
              sideOffset={8}
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
              onInteractOutside={(e) => {
                if (anchorRef.current?.contains(e.target as Node)) e.preventDefault();
              }}
            >
              <CommandPrimitive.List label={listLabel ?? label}>
                <CommandPrimitive.Empty className="pa-combobox-empty">{emptyMessage}</CommandPrimitive.Empty>
                {options.map((option) => {
                  const isOn = option.value === value;
                  return (
                    <CommandPrimitive.Item
                      key={option.value}
                      value={option.value}
                      keywords={[option.label, option.description ?? '', ...(option.keywords ?? [])]}
                      disabled={option.disabled}
                      onSelect={() => choose(option)}
                      className={cn('pa-mi', isOn && 'on')}
                      data-checked={isOn || undefined}
                    >
                      {option.label}
                      {option.description && <span className="sc">{option.description}</span>}
                      <Check
                        className={cn('pa-i sm pa-combobox-check', !isOn && 'off', !option.description && 'end')}
                        aria-hidden
                      />
                    </CommandPrimitive.Item>
                  );
                })}
              </CommandPrimitive.List>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
      </CommandPrimitive>
    );
  },
);
Combobox.displayName = 'Combobox';
