import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import { getDatabase } from '@/lib/server/database';
import { failure, HttpError, readJson, requireSameOrigin, requireUser } from '@/lib/server/http';

export async function GET(request: Request) {
  try {
    const user = await requireUser(request);
    const { rows } = await getDatabase().query('SELECT id, title, completed, created_at FROM tasks WHERE user_id = $1 ORDER BY created_at DESC LIMIT 200', [user.id]);
    return NextResponse.json(rows, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const user = await requireUser(request);
    const body = await readJson(request);
    if (typeof body.title !== 'string' || !body.title.trim() || body.title.trim().length > 200) throw new HttpError(400, 'INVALID_INPUT');
    const { rows } = await getDatabase().query(`INSERT INTO tasks (id,user_id,title)
      SELECT $1,$2,$3 WHERE (SELECT count(*) FROM tasks WHERE user_id=$2) < 200 RETURNING id,title,completed,created_at`, [randomUUID(), user.id, body.title.trim()]);
    if (!rows.length) throw new HttpError(409, 'TASK_LIMIT');
    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) { return failure(error); }
}
