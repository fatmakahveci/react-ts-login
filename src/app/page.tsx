'use client';

import { useContext } from 'react';
import WorkspaceHome from '@/components/workspace/workspace-home';
import LoginForm from '@/components/auth/login-form';
import SiteHeader from '@/components/layout/site-header';
import AuthContext from '@/contexts/auth-context';

export default function App() {
  const auth = useContext(AuthContext);
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content" tabIndex={-1}>
        {!auth.isReady ? <p role="status">Preparing your workspace…</p> : auth.isLoggedIn ? <WorkspaceHome /> : <LoginForm />}
      </main>
      <footer>A simpler space to begin. <span>Built with React & TypeScript.</span></footer>
    </>
  );
}
