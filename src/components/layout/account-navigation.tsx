'use client';

import { useContext } from 'react';
import AuthContext from '@/contexts/auth-context';
import Button from '@/components/ui/button';
import './account-navigation.css';

export default function AccountNavigation() {
  const auth = useContext(AuthContext);
  return (
    <nav className="nav" aria-label="Account">
      <span className="demo-badge">Demo workspace</span>
      {auth.isLoggedIn && <Button onClick={auth.onLogout}>Sign out</Button>}
    </nav>
  );
}
