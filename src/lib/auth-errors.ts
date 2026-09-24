import type { MessageKey } from './messages';
export function authErrorKey(error: { code?: string; status?: number }): MessageKey {
  if (error.status === 429) return 'rateLimit';
  if (error.code === 'EMAIL_NOT_VERIFIED') return 'unverified';
  if (['INVALID_EMAIL_OR_PASSWORD', 'INVALID_PASSWORD', 'USER_NOT_FOUND'].includes(error.code || '')) return 'invalidCredentials';
  if (['INVALID_TOKEN', 'TOKEN_EXPIRED'].includes(error.code || '')) return 'invalidLink';
  if (error.status === 401) return 'expired';
  return 'genericError';
}
