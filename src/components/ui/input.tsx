'use client';

import type { InputProps } from '@/types/ui.types';
import { forwardRef } from 'react';
import './input.css';

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, error, hint, 'aria-describedby': describedBy, ...props }, ref,
) {
  const description = [describedBy, hint && `${id}-hint`, error && `${id}-error`]
    .filter(Boolean).join(' ') || undefined;
  return (
    <div className={`control${error ? ' invalid' : ''}`}>
      <label htmlFor={id}>{label}</label>
      <input {...props} ref={ref} id={id} aria-invalid={Boolean(error)} aria-describedby={description} />
      {hint && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="field-error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
});
export default Input;
