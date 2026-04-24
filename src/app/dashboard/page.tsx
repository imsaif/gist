import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { db } from '@/lib/db';
import { DashboardClient } from './DashboardClient';
import type { Gap } from '@/types/audit';

interface ProductRow {
  id: string;
  name: string;
  url: string;
  category_slug: string;
  mrr_goal_cents: number | null;
  mrr_current_cents: number | null;
}

interface SnapshotRow {
  id: string;
  run_at: number;
  readability_score: string | null;
  gaps_json: string;
  mention_rate: number | null;
  category_percentile: number | null;
}

interface ActionRow {
  id: string;
  title: string;
  rationale: string | null;
  priority: number;
  status: 'open' | 'done' | 'dismissed';
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect('/login?next=/dashboard');

  const client = db();

  const productRes = await client.execute({
    sql: 'select id, name, url, category_slug, mrr_goal_cents, mrr_current_cents from products where user_id = ? and archived_at is null limit 1',
    args: [session.email],
  });
  if (productRes.rows.length === 0) redirect('/onboarding');
  const p = productRes.rows[0];
  const product: ProductRow = {
    id: p.id as string,
    name: p.name as string,
    url: p.url as string,
    category_slug: p.category_slug as string,
    mrr_goal_cents: p.mrr_goal_cents as number | null,
    mrr_current_cents: p.mrr_current_cents as number | null,
  };

  const snapsRes = await client.execute({
    sql: 'select id, run_at, readability_score, gaps_json, mention_rate, category_percentile from audit_snapshots where product_id = ? order by run_at desc limit 12',
    args: [product.id],
  });
  const snapshots: SnapshotRow[] = snapsRes.rows.map((r) => ({
    id: r.id as string,
    run_at: Number(r.run_at),
    readability_score: r.readability_score as string | null,
    gaps_json: r.gaps_json as string,
    mention_rate: r.mention_rate as number | null,
    category_percentile: r.category_percentile as number | null,
  }));
  const latest = snapshots[0] ?? null;

  let actions: ActionRow[] = [];
  if (latest) {
    const actionsRes = await client.execute({
      sql: "select id, title, rationale, priority, status from improvement_actions where snapshot_id = ? and status = 'open' order by priority desc limit 3",
      args: [latest.id],
    });
    actions = actionsRes.rows.map((r) => ({
      id: r.id as string,
      title: r.title as string,
      rationale: r.rationale as string | null,
      priority: Number(r.priority),
      status: r.status as 'open' | 'done' | 'dismissed',
    }));
  }

  const mrrRes = await client.execute({
    sql: 'select recorded_at, mrr_cents from mrr_checkins where product_id = ? order by recorded_at desc limit 2',
    args: [product.id],
  });
  const mrrHistory = mrrRes.rows.map((r) => ({
    recorded_at: Number(r.recorded_at),
    mrr_cents: Number(r.mrr_cents),
  }));

  const latestGaps: Gap[] = latest ? (JSON.parse(latest.gaps_json) as Gap[]) : [];

  return (
    <DashboardClient
      email={session.email}
      product={product}
      snapshots={snapshots}
      latestGaps={latestGaps}
      actions={actions}
      mrrHistory={mrrHistory}
    />
  );
}
