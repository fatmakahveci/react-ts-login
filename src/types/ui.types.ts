import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
export type CardProps = { cssName?: string; children: ReactNode };
export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};
