import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { db } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const status = body?.status;
  if (status !== 'done' && status !== 'dismissed' && status !== 'open') {
    return NextResponse.json({ error: 'invalid status' }, { status: 400 });
  }

  const client = db();
  // Ensure the action belongs to the session user
  const owner = await client.execute({
    sql: `select p.user_id as user_id from improvement_actions a
          join audit_snapshots s on s.id = a.snapshot_id
          join products p on p.id = s.product_id
          where a.id = ?`,
    args: [id],
  });
  if (
    owner.rows.length === 0 ||
    (owner.rows[0] as unknown as { user_id: string }).user_id !== session.email
  ) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  await client.execute({
    sql: "update improvement_actions set status = ?, resolved_at = case when ? in ('done','dismissed') then unixepoch() else null end where id = ?",
    args: [status, status, id],
  });

  return NextResponse.json({ ok: true });
}
