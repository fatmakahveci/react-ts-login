'use client';

import { Context, ReactNode, createContext, useEffect, useState } from 'react';

export type AuthContextValue = {
    isLoggedIn: boolean;
    onLogout: () => void;
    onLogin: (email: string, password: string) => void;
};

const AuthContext: Context<AuthContextValue> = createContext<AuthContextValue>({
    isLoggedIn: false,
    onLogin: (email, password) => {},
    onLogout: () => {}
});

export const AuthContextProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      const storedUserLoggedInInformation = localStorage.getItem('isLoggedIn');

      if (storedUserLoggedInInformation === '1') {
        setIsLoggedIn(true);
      }
    }, []);

    const loginHandler = () => {
      localStorage.setItem('isLoggedIn', '1');
      setIsLoggedIn(true);
    };

    const logoutHandler = ()  => {
      localStorage.removeItem('isLoggedIn');
      setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: isLoggedIn,
                onLogout: logoutHandler,
                onLogin: loginHandler,
            }}>{children}
        </AuthContext.Provider>
    );
};
export default AuthContext;