import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { db, uuid } from '@/lib/db';
import { runAudit } from '@/lib/audit/runAudit';
import { runMentionSample } from '@/lib/mentions/runMentionSample';
import { computeCategoryPercentile } from '@/lib/stats/percentile';
import baselines from '@/data/categoryBaselines.json';
import type { Gap } from '@/types/audit';

export const maxDuration = 60;

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const client = db();
  const productRes = await client.execute({
    sql: 'select id, name, url, category_slug from products where user_id = ? and archived_at is null limit 1',
    args: [session.email],
  });
  if (productRes.rows.length === 0) {
    return NextResponse.json({ error: 'No tracked product' }, { status: 404 });
  }
  const product = productRes.rows[0] as unknown as {
    id: string;
    name: string;
    url: string;
    category_slug: string;
  };

  const snapshotId = await createSnapshotFor(product);
  return NextResponse.json({ snapshotId });
}

export async function createSnapshotFor(product: {
  id: string;
  name: string;
  url: string;
  category_slug: string;
}): Promise<string> {
  const mock = process.env.MOCK_MODE === 'true';
  const audit = await runAudit({ url: product.url, mock });

  const category = baselines.categories.find((c) => c.slug === product.category_slug);
  const prompts = category?.prompts ?? [];
  const mentionResult = await runMentionSample({
    productName: product.name,
    productUrl: product.url,
    prompts,
    mock,
  });

  const percentile = await computeCategoryPercentile(product.category_slug, mentionResult.rate);

  const client = db();
  const snapshotId = uuid();
  await client.execute({
    sql: 'insert into audit_snapshots (id, product_id, readability_score, gaps_json, mention_rate, category_percentile) values (?, ?, ?, ?, ?, ?)',
    args: [
      snapshotId,
      product.id,
      audit.analysis.summary.readabilityScore,
      JSON.stringify(audit.analysis.gaps),
      mentionResult.rate,
      percentile,
    ],
  });

  for (const sample of mentionResult.samples) {
    await client.execute({
      sql: 'insert into mention_samples (id, snapshot_id, prompt, model, mentioned, excerpt) values (?, ?, ?, ?, ?, ?)',
      args: [
        uuid(),
        snapshotId,
        sample.prompt,
        sample.model,
        sample.mentioned ? 1 : 0,
        sample.excerpt ?? null,
      ],
    });
  }

  const topGaps: Gap[] = audit.analysis.gaps
    .slice()
    .sort((a, b) => severityRank(b.severity) - severityRank(a.severity))
    .slice(0, 3);

  for (const [i, gap] of topGaps.entries()) {
    await client.execute({
      sql: 'insert into improvement_actions (id, snapshot_id, title, rationale, priority) values (?, ?, ?, ?, ?)',
      args: [uuid(), snapshotId, gap.description, gap.whatFileNeeds, topGaps.length - i],
    });
  }

  return snapshotId;
}

function severityRank(s: string): number {
  return s === 'critical' ? 3 : s === 'high' ? 2 : 1;
}
