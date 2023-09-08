'use client';

import { InputProps } from '@/shared/types/Types';
import { FC, useEffect, useRef } from 'react';
import './Input.css';

const Input: FC<InputProps> = ({ id, isValid, label, onBlur, onChange, ref, type, value }): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={`control ${isValid === false ? 'invalid' : ''}`}>
        <label htmlFor={id}>{label}</label>
        <input
          ref={inputRef}
          id={id}
          onBlur={onBlur}
          onChange={onChange}
          type={type}
          value={value}
        />
    </div>        
  )
}
export default Input;