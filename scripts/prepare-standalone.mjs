import { cp, mkdir, stat } from 'node:fs/promises';
await mkdir('.next/standalone/.next', { recursive: true });
await cp('.next/static', '.next/standalone/.next/static', { recursive: true });
if (await stat('public').catch(() => null)) await cp('public', '.next/standalone/public', { recursive: true });
