'use client';

import { FC } from 'react';
import { MainHeaderProps } from '@/shared/types/Types';
import './MainHeader.css';
import Navigation from './Navigation';

const MainHeader: FC<MainHeaderProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <header className='main-header'>
      <h1>A Typical Page</h1>
      <Navigation isLoggedIn={isAuthenticated} onLogout={onLogout} />
    </header>
  );
};

export default MainHeader;
