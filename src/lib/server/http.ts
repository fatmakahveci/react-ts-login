import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getAuth } from './auth';

export class HttpError extends Error {
  constructor(public status: number, public code: string) { super(code); }
}
export async function requireUser(request: Request) {
  const session = await getAuth().api.getSession({ headers: request.headers });
  if (!session || !session.user.emailVerified) throw new HttpError(401, 'SESSION_EXPIRED');
  return session.user;
}
export function requireSameOrigin(request: Request) {
  if (!process.env.BETTER_AUTH_URL || request.headers.get('origin') !== new URL(process.env.BETTER_AUTH_URL).origin) {
    throw new HttpError(403, 'INVALID_ORIGIN');
  }
}
export async function readJson(request: Request) {
  const text = await request.text();
  if (text.length > 8192) throw new HttpError(413, 'PAYLOAD_TOO_LARGE');
  try {
    const value: unknown = JSON.parse(text);
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid object');
    return value as Record<string, unknown>;
  }
  catch { throw new HttpError(400, 'INVALID_INPUT'); }
}
export function failure(error: unknown) {
  if (error instanceof HttpError) return NextResponse.json({ error: error.code }, { status: error.status });
  const reference = randomUUID();
  console.error(JSON.stringify({ level: 'error', event: 'request_failed', reference, type: error instanceof Error ? error.name : 'UnknownError' }));
  return NextResponse.json({ error: 'SERVER_ERROR', reference }, { status: 500 });
}
