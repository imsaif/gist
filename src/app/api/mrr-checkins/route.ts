import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { db, uuid } from '@/lib/db';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const mrrCents = body?.mrrCents;
  if (typeof mrrCents !== 'number' || mrrCents < 0 || !Number.isFinite(mrrCents)) {
    return NextResponse.json({ error: 'invalid mrrCents' }, { status: 400 });
  }

  const client = db();
  const productRes = await client.execute({
    sql: 'select id from products where user_id = ? and archived_at is null limit 1',
    args: [session.email],
  });
  if (productRes.rows.length === 0) {
    return NextResponse.json({ error: 'No tracked product' }, { status: 404 });
  }
  const productId = (productRes.rows[0] as unknown as { id: string }).id;

  await client.execute({
    sql: 'insert into mrr_checkins (id, product_id, mrr_cents) values (?, ?, ?)',
    args: [uuid(), productId, Math.round(mrrCents)],
  });
  await client.execute({
    sql: 'update products set mrr_current_cents = ? where id = ?',
    args: [Math.round(mrrCents), productId],
  });

  return NextResponse.json({ ok: true });
}
