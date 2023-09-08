'use client';

import { ButtonProps } from '@/shared/types/Types';
import { FC } from 'react';
import './Button.css';

const Button: FC<ButtonProps> = ({ children, className, onClick, type }): JSX.Element => {
  return (
    <button
        className={`button ${className}`}
        type={type || 'button'}
        onClick={onClick}
    >
    {children}
    </button>
  )
}
export default Button;