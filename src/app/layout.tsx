'use client';

import React, { ReactNode } from 'react';
import './globals.css';
import { AuthContextProvider } from './store/auth-context';

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
      <html lang="en">
        <body className="body">
          <AuthContextProvider>
            {children}
          </AuthContextProvider>
        </body>
      </html>
  )
}