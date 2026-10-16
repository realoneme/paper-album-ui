import { clsx, type ClassValue } from 'clsx';

/** Join class names; falsy values are dropped. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
