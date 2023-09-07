import { createContext } from 'react';

export type AuthContextValue = {
    isLoggedIn: boolean;
    onLogout: () => void;
};

const AuthContext = createContext<AuthContextValue>({
    isLoggedIn: false,
    onLogout: () => {}
});
export default AuthContext;