'use client';

import { LogoutProps } from '@/shared/types/Types';
import { FC, useContext } from 'react';
import AuthContext, { AuthContextValue } from '../../store/auth-context';
import './Navigation.css';

const Navigation: FC<LogoutProps> = ({ onLogout }) => {
  const ctx = useContext<AuthContextValue>(AuthContext);

  return (
    <nav className="nav">
      <ul>
        {ctx.isLoggedIn && (
          <li>
            <a href="/">Users</a>
          </li>
        )}
        {ctx.isLoggedIn && (
          <li>
            <a href="/">Admin</a>
          </li>
        )}
        {ctx.isLoggedIn && (
          <li>
            <button onClick={onLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
