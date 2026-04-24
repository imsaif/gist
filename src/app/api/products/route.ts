import { NextResponse } from 'next/server';
import { getSession, upsertUser } from '@/lib/session';
import { db, uuid } from '@/lib/db';
import baselines from '@/data/categoryBaselines.json';

const validCategory = new Set(baselines.categories.map((c) => c.slug));

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, url, categorySlug, mrrGoalCents, mrrCurrentCents } = body ?? {};

  if (!name || typeof name !== 'string') return err('name is required');
  if (!url || typeof url !== 'string') return err('url is required');
  try {
    const u = new URL(url);
    if (!['http:', 'https:'].includes(u.protocol)) return err('url must be http(s)');
  } catch {
    return err('invalid url');
  }
  if (!categorySlug || !validCategory.has(categorySlug)) return err('invalid category');

  await upsertUser(session.email);

  const client = db();
  const existing = await client.execute({
    sql: 'select id from products where user_id = ? and archived_at is null limit 1',
    args: [session.email],
  });
  if (existing.rows.length > 0) {
    return NextResponse.json({ error: 'You already have a tracked product' }, { status: 409 });
  }

  const id = uuid();
  await client.execute({
    sql: 'insert into products (id, user_id, name, url, category_slug, mrr_goal_cents, mrr_current_cents) values (?, ?, ?, ?, ?, ?, ?)',
    args: [
      id,
      session.email,
      name.trim(),
      url.trim(),
      categorySlug,
      mrrGoalCents ?? null,
      mrrCurrentCents ?? null,
    ],
  });

  if (mrrCurrentCents != null) {
    await client.execute({
      sql: 'insert into mrr_checkins (id, product_id, mrr_cents) values (?, ?, ?)',
      args: [uuid(), id, mrrCurrentCents],
    });
  }

  return NextResponse.json({ id });
}

function err(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}
