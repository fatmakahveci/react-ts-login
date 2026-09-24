import type { Instrumentation } from 'next';
export const onRequestError: Instrumentation.onRequestError = (error, request) => {
  console.error(JSON.stringify({ level: 'error', event: 'server_error', digest: error && typeof error === 'object' && 'digest' in error ? error.digest : undefined,
    method: request.method, path: request.path.split('?')[0], type: error instanceof Error ? error.name : 'UnknownError' }));
};
