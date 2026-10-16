import '@/styles/extra/field.css';
import * as React from 'react';
import { cn } from '@/lib/cn';
import { Label, type LabelProps } from '@/components/ui/label';

interface FieldContextValue {
  controlId: string;
  descriptionId: string;
  errorId: string;
  invalid: boolean;
  hasDescription: boolean;
  hasError: boolean;
  setHasDescription: (value: boolean) => void;
  setHasError: (value: boolean) => void;
}

const FieldContext = React.createContext<FieldContextValue | null>(null);

/** The surrounding Field, if any. */
export function useField() {
  return React.useContext(FieldContext);
}

interface FieldControlProps {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
}

/**
 * Fills in `id`, `aria-describedby` and `aria-invalid` from the surrounding Field.
 * Explicit props always win. Used by Input and Textarea; call it in custom controls.
 */
export function useFieldControl<P extends FieldControlProps>(props: P): P {
  const field = useField();
  if (!field) return props;
  const describedBy = [
    props['aria-describedby'],
    field.hasDescription ? field.descriptionId : undefined,
    field.hasError ? field.errorId : undefined,
  ]
    .filter(Boolean)
    .join(' ');
  return {
    ...props,
    id: props.id ?? field.controlId,
    'aria-describedby': describedBy || undefined,
    'aria-invalid': props['aria-invalid'] ?? (field.invalid ? true : undefined),
  };
}

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Marks the control invalid (red groove). Defaults to true while a FieldError is rendered. */
  invalid?: boolean;
  /** Id for the control; generated when omitted. */
  controlId?: string;
}

/** A label, a control, and a description or error, stacked. */
export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, invalid, controlId, ...props }, ref) => {
    const baseId = React.useId();
    const [hasDescription, setHasDescription] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);
    const value = React.useMemo<FieldContextValue>(
      () => ({
        controlId: controlId ?? `${baseId}-control`,
        descriptionId: `${baseId}-description`,
        errorId: `${baseId}-error`,
        invalid: invalid ?? hasError,
        hasDescription,
        hasError,
        setHasDescription,
        setHasError,
      }),
      [baseId, controlId, invalid, hasDescription, hasError],
    );
    return (
      <FieldContext.Provider value={value}>
        <div ref={ref} className={cn('pa-field', className)} {...props} />
      </FieldContext.Provider>
    );
  },
);
Field.displayName = 'Field';

export type FieldLabelProps = LabelProps;

/** Label tied to the Field's control. */
export const FieldLabel = React.forwardRef<React.ElementRef<typeof Label>, FieldLabelProps>(
  ({ htmlFor, ...props }, ref) => {
    const field = useField();
    return <Label ref={ref} htmlFor={htmlFor ?? field?.controlId} {...props} />;
  },
);
FieldLabel.displayName = 'FieldLabel';

export type FieldDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

/** Helper text, announced with the control via `aria-describedby`. */
export const FieldDescription = React.forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  ({ className, id, ...props }, ref) => {
    const field = useField();
    const setHas = field?.setHasDescription;
    React.useEffect(() => {
      if (!setHas) return;
      setHas(true);
      return () => setHas(false);
    }, [setHas]);
    return <p ref={ref} id={id ?? field?.descriptionId} className={cn('pa-desc', className)} {...props} />;
  },
);
FieldDescription.displayName = 'FieldDescription';

export type FieldErrorProps = React.HTMLAttributes<HTMLParagraphElement>;

/** Error written as an instruction. Renders nothing without children; while shown, the control is invalid. */
export const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  ({ className, id, children, ...props }, ref) => {
    const field = useField();
    const setHas = field?.setHasError;
    const shown = children !== undefined && children !== null && children !== false && children !== '';
    React.useEffect(() => {
      if (!setHas || !shown) return;
      setHas(true);
      return () => setHas(false);
    }, [setHas, shown]);
    if (!shown) return null;
    return (
      <p ref={ref} id={id ?? field?.errorId} className={cn('pa-error-text', className)} {...props}>
        {children}
      </p>
    );
  },
);
FieldError.displayName = 'FieldError';
