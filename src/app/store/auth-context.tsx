import { createContext } from 'react';

export type AuthContextValue = {
    isLoggedIn: boolean
};

const AuthContext = createContext<AuthContextValue>({
    isLoggedIn: false
});
export default AuthContext;