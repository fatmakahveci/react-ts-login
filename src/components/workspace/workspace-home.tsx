'use client';

import AuthContext from '@/contexts/auth-context';
import { useContext, useEffect, useRef } from 'react';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import './workspace-home.css';

export default function WorkspaceHome() {
  const auth = useContext(AuthContext);
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); }, []);
  return (
    <Card cssName="home">
      <div className="success-mark" aria-hidden="true">✓</div>
      <span className="eyebrow">YOU’RE ALL SET</span>
      <h1 ref={headingRef} tabIndex={-1}>Make yourself at home.</h1>
      <p>Your demo session is active. Take a breath, find your focus, and start something good.</p>
      <div className="session-detail"><span>Workspace status</span><strong>Connected</strong></div>
      <Button onClick={auth.onLogout}>Sign out</Button>
      <p className="demo-note">This is a client-side demonstration, with no protected data or server authentication.</p>
    </Card>
  );
}
