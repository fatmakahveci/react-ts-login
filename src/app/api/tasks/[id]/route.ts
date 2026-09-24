import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/server/database';
import { failure, HttpError, readJson, requireSameOrigin, requireUser } from '@/lib/server/http';

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Context) {
  try {
    requireSameOrigin(request);
    const user = await requireUser(request);
    const { id } = await params;
    const body = await readJson(request);
    if (typeof body.completed !== 'boolean') throw new HttpError(400, 'INVALID_INPUT');
    const { rows } = await getDatabase().query('UPDATE tasks SET completed=$1 WHERE id=$2 AND user_id=$3 RETURNING id,title,completed,created_at', [body.completed, id, user.id]);
    if (!rows.length) throw new HttpError(404, 'NOT_FOUND');
    return NextResponse.json(rows[0]);
  } catch (error) { return failure(error); }
}
export async function DELETE(request: Request, { params }: Context) {
  try {
    requireSameOrigin(request);
    const user = await requireUser(request);
    const { id } = await params;
    const { rowCount } = await getDatabase().query('DELETE FROM tasks WHERE id=$1 AND user_id=$2', [id, user.id]);
    if (!rowCount) throw new HttpError(404, 'NOT_FOUND');
    return new Response(null, { status: 204 });
  } catch (error) { return failure(error); }
}
