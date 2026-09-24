'use client';
import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { authErrorKey } from '@/lib/auth-errors';
import { useSessionActions } from '@/contexts/session-actions-context';
import { usePreferences } from '@/contexts/preferences-context';
import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import './workspace-home.css';

type Task = { id: string; title: string; completed: boolean };
export default function WorkspaceHome() {
  const { data: session, isPending, error: sessionError } = authClient.useSession();
  const { t } = usePreferences();
  const router = useRouter();
  const { signingOut } = useSessionActions();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');
  const [name, setName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!isPending && !session && !sessionError && !signingOut) router.replace('/?expired=1');
  }, [session, isPending, sessionError, router, signingOut]);
  const request = useCallback(async (path: string, options?: RequestInit) => {
    const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } });
    if (response.status === 401) { router.replace('/?expired=1'); throw new Error(t('expired')); }
    const body = response.status === 204 ? null : await response.json();
    if (!response.ok) throw new Error(body.error === 'TASK_LIMIT' ? t('taskLimit') : `${t('genericError')}${body.reference ? ` (${t('reference')}: ${body.reference})` : ''}`);
    return body;
  }, [router, t]);
  // A stable load keyed to the account prevents other users' tasks lingering after a session change.
  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();
    fetch('/api/tasks', { signal: controller.signal }).then(async response => {
      if (response.status === 401) { router.replace('/?expired=1'); return; }
      if (!response.ok) throw new Error('TASK_LOAD_FAILED');
      const result = await response.json();
      if (!controller.signal.aborted) { setTasks(result); setLoaded(true); }
    }).catch(() => { if (!controller.signal.aborted) { setError('TASK_LOAD_FAILED'); setLoaded(true); } });
    return () => controller.abort();
  }, [userId, router]);
  async function perform(action: () => Promise<void>) {
    if (busy) return;
    setBusy(true); setError(''); setNotice('');
    try { await action(); } catch (failure) { setError(failure instanceof Error && failure.message !== 'Failed to fetch' ? failure.message : t('networkError')); }
    finally { setBusy(false); }
  }
  function addTask(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    void perform(async () => {
      const task = await request('/api/tasks', { method: 'POST', body: JSON.stringify({ title }) });
      setTasks(previous => [task, ...previous]); setTitle('');
    });
  }
  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    await perform(async () => {
      const result = await authClient.updateUser({ name: name.trim() });
      if (result.error) throw new Error(t(authErrorKey(result.error)));
      setNotice(t('saved')); setName('');
    });
  }
  async function changePassword(event: FormEvent) {
    event.preventDefault();
    await perform(async () => {
      const result = await authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions: true });
      if (result.error) throw new Error(t(authErrorKey(result.error)));
      setCurrentPassword(''); setNewPassword(''); setNotice(t('passwordChanged'));
    });
  }
  if (!session) return <p role="status">{t(sessionError ? 'networkError' : 'loading')}</p>;
  const done = tasks.filter(task => task.completed).length;
  return <div className="workspace">
    <div className="workspace-heading"><span className="eyebrow">{t('workspace')} / {session.user.name}</span><h1>{t('greeting')}</h1><p>{t('dashboardIntro')}</p></div>
    <div className="stats" aria-label={t('overview')}><Card><span>{t('totalTasks')}</span><strong>{tasks.length}</strong></Card><Card><span>{t('done')}</span><strong>{done}</strong></Card><Card><span>{t('progress')}</span><strong>{tasks.length ? Math.round(done / tasks.length * 100) : 0}%</strong></Card></div>
    {error && <div role="alert" className="notice error">{error === 'TASK_LOAD_FAILED' ? t('networkError') : error}
      {error === 'TASK_LOAD_FAILED' && <Button onClick={() => void perform(async () => { setTasks(await request('/api/tasks')); })}>{t('retry')}</Button>}</div>}
    {notice && <p role="status" className="notice success">{notice}</p>}
    <div className="workspace-grid">
      <Card cssName="tasks-panel"><h2>{t('tasks')}</h2>
        <form className="task-form" onSubmit={addTask}><Input id="task-title" label={t('taskTitle')} value={title} maxLength={200} onChange={e => setTitle(e.target.value)} required /><Button type="submit" disabled={busy || !loaded || !title.trim()}>{t('addTask')}</Button></form>
        <div className="filters" aria-label={t('tasks')}>{(['all','active','done'] as const).map(value => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{t(value)}</button>)}</div>
        {!loaded ? <p role="status">{t('loading')}</p> : tasks.length === 0 ? <p className="empty-state">{t('empty')}</p> :
          <ul className="task-list">{tasks.filter(task => filter === 'all' || task.completed === (filter === 'done')).map(task => <li key={task.id}>
            <label><input type="checkbox" checked={task.completed} disabled={busy} aria-label={`${t(task.completed ? 'reopen' : 'complete')}: ${task.title}`}
              onChange={() => void perform(async () => { const updated = await request(`/api/tasks/${task.id}`, { method: 'PATCH', body: JSON.stringify({ completed: !task.completed }) }); setTasks(previous => previous.map(item => item.id === updated.id ? updated : item)); })} />
              <span className={task.completed ? 'task-done' : ''}>{task.title}</span></label>
            <button className="text-button" disabled={busy} aria-label={`${t('delete')}: ${task.title}`} onClick={() => void perform(async () => { await request(`/api/tasks/${task.id}`, { method: 'DELETE' }); setTasks(previous => previous.filter(item => item.id !== task.id)); })}>{t('delete')}</button>
          </li>)}</ul>}
      </Card>
      <div className="settings-stack">
        <Card cssName="settings-panel"><h2>{t('profile')}</h2><p className="account-email">{session.user.email}</p>
          <form onSubmit={saveProfile}><Input id="profile-name" label={t('name')} autoComplete="name" placeholder={session.user.name} value={name} maxLength={80} onChange={e => setName(e.target.value)} required /><Button type="submit" disabled={busy || !name.trim()}>{t('save')}</Button></form>
        </Card>
        <Card cssName="settings-panel"><h2>{t('security')}</h2><form onSubmit={changePassword}>
          <Input id="current-password" label={t('currentPassword')} type="password" autoComplete="current-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
          <Input id="new-password" label={t('newPassword')} type="password" autoComplete="new-password" value={newPassword} minLength={12} maxLength={128} hint={t('passwordHint')} onChange={e => setNewPassword(e.target.value)} required />
          <Button type="submit" disabled={busy || !currentPassword || newPassword.length < 12}>{t('changePassword')}</Button>
        </form><button className="text-button revoke-button" disabled={busy} onClick={() => void perform(async () => { const result = await authClient.revokeOtherSessions(); if (result.error) throw new Error(t(authErrorKey(result.error))); setNotice(t('revoked')); })}>{t('revoke')}</button></Card>
      </div>
    </div>
  </div>;
}
