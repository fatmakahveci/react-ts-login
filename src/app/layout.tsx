import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import './globals.css';
import { PreferencesProvider } from '@/contexts/preferences-context';
import AppShell from '@/components/layout/app-shell';

export const metadata: Metadata = { title: 'Forma — Your workspace', description: 'Your personal space for focused work. / Odaklı çalışmak için kişisel alanın.' };
export default async function RootLayout({ children }: { children: ReactNode }) {
  const store = await cookies();
  const locale = store.get('forma-locale')?.value === 'tr' ? 'tr' : 'en';
  const theme = store.get('forma-theme')?.value === 'dark' ? 'dark' : 'light';
  return <html lang={locale} data-theme={theme}><body><PreferencesProvider initialLocale={locale} initialTheme={theme}><AppShell>{children}</AppShell></PreferencesProvider></body></html>;
}
