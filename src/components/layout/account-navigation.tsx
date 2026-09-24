'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useSessionActions } from '@/contexts/session-actions-context';
import { authClient } from '@/lib/auth-client';
import { usePreferences } from '@/contexts/preferences-context';
import Button from '@/components/ui/button';
import './account-navigation.css';

export default function AccountNavigation() {
  const { data } = authClient.useSession();
  const { locale, setLocale, theme, setTheme, t } = usePreferences();
  const { setSigningOut } = useSessionActions();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  async function signOut() {
    setBusy(true); setSigningOut(true); setError(false);
    try {
      const result = await authClient.signOut();
      if (result.error) { setError(true); setSigningOut(false); }
      // Reload to clear cached protected data and reset the sign-out state.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      else window.location.assign('/');
    } catch { setError(true); setSigningOut(false); }
    finally { setBusy(false); }
  }
  return <nav className="nav" aria-label={t('account')}>
    <select aria-label={t('language')} value={locale} onChange={e => setLocale(e.target.value as 'en' | 'tr')}>
      <option value="en">English</option><option value="tr">Türkçe</option>
    </select>
    <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={t(theme === 'light' ? 'dark' : 'light')}>
      <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
    </button>
    {data && <><Link href="/workspace">{t('workspace')}</Link><Button disabled={busy} onClick={signOut}>{busy ? t('busy') : t('signOut')}</Button></>}
    {error && <span role="alert">{t('networkError')}</span>}
  </nav>;
}
