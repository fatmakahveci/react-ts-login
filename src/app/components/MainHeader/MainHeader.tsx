'use client';

import { LogoutProps } from '@/shared/types/Types';
import { FC } from 'react';
import './MainHeader.css';
import Navigation from './Navigation';

const MainHeader: FC<LogoutProps> = ({ onLogout }) => {
  return (
    <header className='main-header'>
      <h1>A Typical Page</h1>
      <Navigation onLogout={onLogout} />
    </header>
  );
};

export default MainHeader;
