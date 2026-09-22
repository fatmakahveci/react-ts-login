import { afterEach, beforeEach, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from '../src/app/page';
import { AuthContextProvider } from '@/contexts/auth-context';

beforeEach(() => localStorage.clear());
afterEach(cleanup);
const start = () => render(<AuthContextProvider><App /></AuthContextProvider>);
const submit = () => fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
const fill = (email: string, password: string) => {
  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: email } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
};

it('reports accessible validation errors and focuses the first invalid field', () => {
  start();
  submit();
  const email = screen.getByLabelText('Email address');
  expect(document.activeElement).toBe(email);
  expect(email.getAttribute('aria-invalid')).toBe('true');
  expect(email.getAttribute('aria-describedby')).toContain('email-error');
  expect(screen.getAllByRole('alert')).toHaveLength(2);
  fireEvent.change(email, { target: { value: 'demo@example.com' } });
  submit();
  expect(document.activeElement).toBe(screen.getByLabelText('Password'));
});

it('logs in immediately after valid typing, focuses the home heading and logs out', () => {
  start();
  fill('demo@example.com', 'sample-password');
  submit();
  expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Make yourself at home.' }));
  fireEvent.click(screen.getAllByRole('button', { name: 'Sign out' })[0]);
  expect(screen.getByRole('button', { name: /sign in/i })).toBeTruthy();
  expect(localStorage.getItem('isLoggedIn')).toBeNull();
});

it('does not submit stale validity after a valid password becomes invalid', () => {
  start();
  fill('demo@example.com', 'sample-password');
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'short' } });
  submit();
  expect(localStorage.getItem('isLoggedIn')).toBeNull();
  expect(document.activeElement).toBe(screen.getByLabelText('Password'));
});

it.each(['@', 'name@', 'name@example', 'name @example.com'])('rejects malformed email %s', email => {
  start();
  fill(email, 'sample-password');
  submit();
  expect(screen.getByText('Enter a valid email address.')).toBeTruthy();
  expect(localStorage.getItem('isLoggedIn')).toBeNull();
});

it('reveals and hides the password without submitting', () => {
  start();
  fill('demo@example.com', 'sample-password');
  fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
  expect(screen.getByLabelText('Password').getAttribute('type')).toBe('text');
  expect(screen.getByRole('button', { name: 'Hide password' }).getAttribute('aria-pressed')).toBe('true');
  fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
  expect(screen.getByLabelText('Password').getAttribute('type')).toBe('password');
  expect(localStorage.getItem('isLoggedIn')).toBeNull();
});

it('restores an existing demo session on initial render', () => {
  localStorage.setItem('isLoggedIn', '1');
  start();
  expect(screen.getByRole('heading', { name: 'Make yourself at home.' })).toBeTruthy();
  expect(screen.queryByLabelText('Password')).toBeNull();
});
