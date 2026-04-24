import { db } from '@/lib/db';

/**
 * Given a mention_rate sample, return the percentile (0..100) of this product's
 * rate against the latest snapshot of every other product in the same category.
 * Anonymous aggregate — no product identities exposed.
 */
export async function computeCategoryPercentile(
  categorySlug: string,
  rate: number
): Promise<number | null> {
  const res = await db().execute({
    sql: `select s.mention_rate as rate
          from audit_snapshots s
          join products p on p.id = s.product_id
          where p.category_slug = ? and p.archived_at is null and s.mention_rate is not null
          and s.run_at = (
            select max(run_at) from audit_snapshots where product_id = p.id
          )`,
    args: [categorySlug],
  });
  const rows = res.rows as unknown as { rate: number | null }[];
  const others = rows.map((r) => r.rate).filter((r): r is number => typeof r === 'number');
  if (others.length === 0) return null;
  const atOrBelow = others.filter((r) => r <= rate).length;
  return (atOrBelow / others.length) * 100;
}
