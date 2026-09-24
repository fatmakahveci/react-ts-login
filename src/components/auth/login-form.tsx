'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { type FormEvent, useRef, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { authErrorKey } from '@/lib/auth-errors';
import { usePreferences } from '@/contexts/preferences-context';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import './login-form.css';

type Mode = 'login' | 'register' | 'forgot' | 'reset' | 'verify';
export default function LoginForm({ mode = 'login' }: { mode?: Mode }) {
  const { t } = usePreferences();
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [touched, setTouched] = useState(false);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordValid = password.length >= (mode === 'login' ? 1 : 12) && password.length <= 128;
  const needsPassword = ['login', 'register', 'reset'].includes(mode);
  const title = { login: 'welcome', register: 'register', forgot: 'forgot', reset: 'reset', verify: 'checkEmail' } as const;
  const submitLabel = { login: 'signIn', register: 'signUp', forgot: 'resetLink', reset: 'resetButton', verify: 'resend' } as const;
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setTouched(true); setError('');
    if (mode === 'register' && (!name.trim() || name.trim().length > 80)) return nameRef.current?.focus();
    if (mode !== 'reset' && !emailValid) return emailRef.current?.focus();
    if (needsPassword && !passwordValid) return passwordRef.current?.focus();
    setBusy(true);
    try {
      const normalized = email.trim();
      const result = mode === 'login' ? await authClient.signIn.email({ email: normalized, password })
        : mode === 'register' ? await authClient.signUp.email({ name: name.trim(), email: normalized, password, callbackURL: '/verify-email?verified=1' })
        : mode === 'forgot' ? await authClient.requestPasswordReset({ email: normalized, redirectTo: '/reset-password' })
        : mode === 'reset' ? await authClient.resetPassword({ newPassword: password, token: search.get('token') || '' })
        : await authClient.sendVerificationEmail({ email: normalized, callbackURL: '/verify-email?verified=1' });
      if (result.error) {
        if (mode === 'register' && result.error.code?.includes('ALREADY_EXISTS')) setSuccess(t('verifySent'));
        else setError(t(authErrorKey(result.error)));
        return;
      }
      setPassword('');
      if (mode === 'login') { router.push('/workspace'); router.refresh(); }
      else setSuccess(t(mode === 'register' ? 'verifySent' : mode === 'forgot' ? 'resetSent' : mode === 'reset' ? 'resetDone' : 'verificationSent'));
    } catch { setError(t('networkError')); }
    finally { setBusy(false); }
  }
  return <Card cssName="login">
    <span className="eyebrow">FORMA / {t('account')}</span>
    <h1>{t(title[mode])}</h1><p className="intro">{t('intro')}</p>
    {search.get('expired') && <p role="status" className="notice">{t('expired')}</p>}
    {mode === 'verify' && (search.get('verified') || search.get('error')) && <p role="status" className="notice">{t(search.get('verified') === '1' && !search.get('error') ? 'verifyDone' : 'verifyError')}</p>}
    {success ? <><p role="status" className="notice success">{success}</p><Link href="/">{t('back')}</Link></> :
      <form onSubmit={submit} noValidate aria-busy={busy}>
        {mode === 'register' && <Input id="name" label={t('name')} ref={nameRef} autoComplete="name" value={name} maxLength={80}
          onChange={e => setName(e.target.value)} error={touched && !name.trim() ? t('invalidName') : undefined} required />}
        {mode !== 'reset' && <Input id="email" label={t('email')} ref={emailRef} type="email" autoComplete="username" autoCapitalize="none" spellCheck={false}
          value={email} onChange={e => setEmail(e.target.value)} error={touched && !emailValid ? t('invalidEmail') : undefined} required />}
        {needsPassword && <><Input id="password" label={t(mode === 'reset' ? 'newPassword' : 'password')} ref={passwordRef} type={show ? 'text' : 'password'}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'} maxLength={128} value={password} onChange={e => setPassword(e.target.value)}
          hint={mode !== 'login' ? t('passwordHint') : undefined} error={touched && !passwordValid ? t('invalidPassword') : undefined} required />
          <button className="password-toggle" type="button" aria-controls="password" aria-pressed={show} onClick={() => setShow(!show)}>{t(show ? 'hide' : 'show')}</button></>}
        {error && <p role="alert" className="notice error">{error}</p>}
        <Button type="submit" disabled={busy || (mode === 'reset' && !search.get('token'))} className="login-submit">{busy ? t('busy') : t(submitLabel[mode])}<span aria-hidden="true">→</span></Button>
        {mode === 'reset' && !search.get('token') && <p role="alert">{t('invalidLink')}</p>}
      </form>}
    <div className="auth-links">
      {mode === 'login' ? <><Link href="/forgot-password">{t('forgot')}</Link><p>{t('noAccount')} <Link href="/register">{t('signUp')}</Link></p><Link href="/verify-email">{t('resend')}</Link></>
        : <><Link href="/">{t('back')}</Link>{mode === 'reset' && <Link href="/forgot-password">{t('resetLink')}</Link>}</>}
    </div><p className="demo-note">{t('safety')}</p>
  </Card>;
}
