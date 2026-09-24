import { expect, it, vi } from 'vitest';
import { onRequestError } from '../src/instrumentation';
it('logs route templates and references without tokens, query strings, headers, or error messages', async () => {
  const log = vi.spyOn(console, 'error').mockImplementation(() => {});
  try {
    await onRequestError(Object.assign(new Error('private diagnostic details'), { digest: 'reference-123' }), {
      method: 'GET', path: '/api/auth/reset-password/private-token?email=private@example.test',
      headers: { cookie: 'private-session-cookie' },
    }, { routerKind: 'App Router', routePath: '/api/auth/[...all]', routeType: 'route', revalidateReason: undefined });
    expect(JSON.parse(log.mock.calls[0][0])).toEqual({ level: 'error', event: 'server_error', digest: 'reference-123',
      method: 'GET', path: '/api/auth/[...all]', type: 'Error' });
  } finally { log.mockRestore(); }
});
