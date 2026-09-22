'use client';

import { type ReactNode, createContext, useEffect, useState } from 'react';

export type AuthContextValue = {
  isLoggedIn: boolean;
  isReady: boolean;
  onLogout: () => void;
  onLogin: (email: string, password: string) => void;
};

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  isReady: false,
  onLogin: () => {},
  onLogout: () => {},
});

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === '1');
    } catch {
      // Storage may be disabled; the demo still works in memory.
    }
    setIsReady(true);
    function syncSession(event: StorageEvent) {
      if (event.key === 'isLoggedIn' || event.key === null) {
        try {
          if (event.storageArea && event.storageArea !== localStorage) return;
          setIsLoggedIn(localStorage.getItem('isLoggedIn') === '1');
        } catch { /* Keep the current in-memory session. */ }
      }
    }
    window.addEventListener('storage', syncSession);
    return () => window.removeEventListener('storage', syncSession);
  }, []);

  function updateSession(loggedIn: boolean) {
    try {
      if (loggedIn) localStorage.setItem('isLoggedIn', '1');
      else localStorage.removeItem('isLoggedIn');
    } catch { /* Persistence is optional for this demo. */ }
    setIsLoggedIn(loggedIn);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, isReady,
      onLogin: () => updateSession(true), onLogout: () => updateSession(false) }}>
      {children}
    </AuthContext.Provider>
  );
}
export default AuthContext;
