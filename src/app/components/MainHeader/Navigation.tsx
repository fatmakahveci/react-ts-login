'use client';

import { useContext } from 'react';
import AuthContext, { AuthContextValue } from '../../store/auth-context';
import './Navigation.css';

const Navigation = (): JSX.Element => {
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
            <button onClick={ctx.onLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
