'use client';
import { SessionActionsProvider } from '@/contexts/session-actions-context';
import type { ReactNode } from 'react';
import SiteHeader from './site-header';
import { usePreferences } from '@/contexts/preferences-context';
export default function AppShell({ children }: { children: ReactNode }) {
  const { t } = usePreferences();
  return <SessionActionsProvider><a className="skip-link" href="#main-content">{t('skip')}</a><SiteHeader />
    <main id="main-content" tabIndex={-1}>{children}</main><footer>{t('footer')}<span>{t('privacy')}</span></footer></SessionActionsProvider>;
}
