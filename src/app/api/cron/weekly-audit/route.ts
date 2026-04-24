import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { createSnapshotFor } from '@/app/api/snapshots/trigger/route';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const expected = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const res = await db().execute({
    sql: 'select id, name, url, category_slug from products where archived_at is null',
  });
  const products = res.rows as unknown as {
    id: string;
    name: string;
    url: string;
    category_slug: string;
  }[];

  const results: Array<{ productId: string; snapshotId?: string; error?: string }> = [];
  for (const product of products) {
    try {
      const snapshotId = await createSnapshotFor(product);
      results.push({ productId: product.id, snapshotId });
    } catch (err) {
      results.push({
        productId: product.id,
        error: err instanceof Error ? err.message : 'unknown',
      });
    }
  }

  return NextResponse.json({ processed: products.length, results });
}
