import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/server/database';

export async function GET() {
  try {
    await getDatabase().query('SELECT 1 FROM tasks LIMIT 1');
    return NextResponse.json({ status: 'ready' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ status: 'unavailable' }, { status: 503 });
  }
}
