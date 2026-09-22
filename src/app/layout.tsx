import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { AuthContextProvider } from '@/contexts/auth-context';

export const metadata: Metadata = {
  title: 'Forma — Your workspace',
  description: 'An accessible React and TypeScript sign-in demonstration.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body><AuthContextProvider>{children}</AuthContextProvider></body></html>;
}
