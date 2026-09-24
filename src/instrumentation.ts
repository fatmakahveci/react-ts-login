import type { Instrumentation } from 'next';
export const onRequestError: Instrumentation.onRequestError = (error, request, context) => {
  console.error(JSON.stringify({ level: 'error', event: 'server_error', digest: error && typeof error === 'object' && 'digest' in error ? error.digest : undefined,
    method: request.method, path: context.routePath, type: error instanceof Error ? error.name : 'UnknownError' }));
};
