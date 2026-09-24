'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { messages, type Locale, type MessageKey } from '@/lib/messages';

type Theme = 'light' | 'dark';
const Preferences = createContext({ locale: 'en' as Locale, theme: 'light' as Theme,
  setLocale: (() => {}) as (locale: Locale) => void, setTheme: (() => {}) as (theme: Theme) => void, t: (key: MessageKey): string => messages.en[key] });
function persist(name: string, value: string) {
  document.cookie = `${name}=${value}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
}
export function PreferencesProvider({ children, initialLocale, initialTheme }: { children: ReactNode; initialLocale: Locale; initialTheme: Theme }) {
  const [locale, updateLocale] = useState(initialLocale);
  const [theme, updateTheme] = useState(initialTheme);
  return <Preferences.Provider value={{ locale, theme,
    setLocale(value) { updateLocale(value); persist('forma-locale', value); document.documentElement.lang = value; },
    setTheme(value) { updateTheme(value); persist('forma-theme', value); document.documentElement.dataset.theme = value; },
    t: key => messages[locale][key],
  }}>{children}</Preferences.Provider>;
}
export const usePreferences = () => useContext(Preferences);
