'use client';

import { CardProps } from '@/shared/types/Types';
import React, { FC } from 'react';
import './Card.css';

const Card: FC<CardProps> = ({ cssName, children }): JSX.Element => {
  return (
    <div className={`card ${cssName}`}>
        {children}
    </div>
  )
}
export default Card;