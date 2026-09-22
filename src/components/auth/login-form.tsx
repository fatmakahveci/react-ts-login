'use client';

import AuthContext from '@/contexts/auth-context';
import { type FormEvent, useContext, useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import './login-form.css';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const auth = useContext(AuthContext);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ? '' : 'Enter a valid email address.';
  const passwordError = password.trim().length >= 7
    ? '' : 'Use at least 7 characters, excluding surrounding spaces.';

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({ email: true, password: true });
    if (emailError) return emailRef.current?.focus();
    if (passwordError) return passwordRef.current?.focus();
    auth.onLogin(email.trim(), password);
  }

  return (
    <Card cssName="login">
      <span className="eyebrow">YOUR NEXT CHAPTER</span>
      <h1 ref={headingRef} tabIndex={-1}>Welcome back.</h1>
      <p className="intro">A little focus. A fresh start. Sign in to your space.</p>
      <form onSubmit={handleSubmit} noValidate>
        <Input ref={emailRef} id="email" name="email" label="Email address" type="email"
          autoComplete="username" autoCapitalize="none" spellCheck={false} required
          placeholder="you@example.com" value={email}
          onChange={event => setEmail(event.target.value)}
          onBlur={() => setTouched(previous => ({ ...previous, email: true }))}
          error={touched.email ? emailError : undefined} />
        <Input ref={passwordRef} id="password" name="password" label="Password"
          type={showPassword ? 'text' : 'password'} autoComplete="current-password" required
          value={password} hint="At least 7 characters." onChange={event => setPassword(event.target.value)}
          onBlur={() => setTouched(previous => ({ ...previous, password: true }))}
          error={touched.password ? passwordError : undefined} />
        <button className="password-toggle" type="button" aria-controls="password"
          aria-pressed={showPassword} onClick={() => setShowPassword(previous => !previous)}>
          {showPassword ? 'Hide password' : 'Show password'}
        </button>
        <Button type="submit" className="login-submit">Sign in <span aria-hidden="true">→</span></Button>
      </form>
      <p className="demo-note">Demo workspace · Use any valid email and a sample password. No account is created and your password is never stored.</p>
    </Card>
  );
}
