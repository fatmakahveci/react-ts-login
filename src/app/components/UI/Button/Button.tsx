'use client';

import { ButtonProps } from '@/shared/types/Types';
import { FC } from 'react';
import './Button.css';

const Button: FC<ButtonProps> = ({ type, children, onClick, disabled }) => {
  return (
    <button
        className="button"
        type={type || 'button'}
        onClick={onClick}
        disabled={disabled}
    >
    {children}
    </button>
  )
}
export default Button;