'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';
const SessionActions = createContext({ signingOut: false, setSigningOut: (() => {}) as (value: boolean) => void });
export function SessionActionsProvider({ children }: { children: ReactNode }) {
  const [signingOut, setSigningOut] = useState(false);
  return <SessionActions.Provider value={{ signingOut, setSigningOut }}>{children}</SessionActions.Provider>;
}
export const useSessionActions = () => useContext(SessionActions);
