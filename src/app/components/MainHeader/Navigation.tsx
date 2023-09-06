'use client';

import { FC } from 'react';
import { NavigationProps } from '@/shared/types/Types';
import './Navigation.css';

const Navigation: FC<NavigationProps> = ({ isLoggedIn, onLogout }) => {
  return (
    <nav className="nav">
      <ul>
        {isLoggedIn && (
          <li>
            <a href="/">Users</a>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <a href="/">Admin</a>
          </li>
        )}
        {isLoggedIn && (
          <li>
            <button onClick={onLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
