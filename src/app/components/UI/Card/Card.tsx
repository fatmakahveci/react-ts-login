'use client';

import { CardProps } from '@/shared/types/Types';
import { FC } from 'react';
import './Card.css';

const Card: FC<CardProps> = ({ cssName, children }) => {
  return (
    <div className={`card ${cssName}`}>
        {children}
    </div>
  )
}
export default Card;