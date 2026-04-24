'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Gap } from '@/types/audit';

interface Product {
  id: string;
  name: string;
  url: string;
  category_slug: string;
  mrr_goal_cents: number | null;
  mrr_current_cents: number | null;
}

interface Snapshot {
  id: string;
  run_at: number;
  readability_score: string | null;
  mention_rate: number | null;
  category_percentile: number | null;
}

interface Action {
  id: string;
  title: string;
  rationale: string | null;
  priority: number;
  status: 'open' | 'done' | 'dismissed';
}

interface Props {
  email: string;
  product: Product;
  snapshots: Snapshot[];
  latestGaps: Gap[];
  actions: Action[];
  mrrHistory: { recorded_at: number; mrr_cents: number }[];
}

export function DashboardClient(props: Props) {
  const router = useRouter();
  const { product, snapshots, actions, mrrHistory } = props;
  const latest = snapshots[0] ?? null;

  const [runningAudit, setRunningAudit] = useState(false);
  const [mrrInput, setMrrInput] = useState('');
  const [savingMrr, setSavingMrr] = useState(false);

  async function triggerAudit() {
    setRunningAudit(true);
    try {
      const res = await fetch('/api/snapshots/trigger', { method: 'POST' });
      if (!res.ok) throw new Error('Audit failed');
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Audit failed');
    } finally {
      setRunningAudit(false);
    }
  }

  async function updateAction(id: string, status: 'done' | 'dismissed') {
    await fetch(`/api/actions/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function saveMrr(e: React.FormEvent) {
    e.preventDefault();
    if (!mrrInput) return;
    setSavingMrr(true);
    try {
      await fetch('/api/mrr-checkins', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mrrCents: Math.round(parseFloat(mrrInput) * 100) }),
      });
      setMrrInput('');
      router.refresh();
    } finally {
      setSavingMrr(false);
    }
  }

  const goalCents = product.mrr_goal_cents ?? 0;
  const currentCents = mrrHistory[0]?.mrr_cents ?? product.mrr_current_cents ?? 0;
  const prevCents = mrrHistory[1]?.mrr_cents;
  const mrrPct = goalCents > 0 ? Math.min(100, (currentCents / goalCents) * 100) : 0;
  const mrrDelta = prevCents !== undefined ? currentCents - prevCents : null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-ink-secondary text-sm">{props.email}</p>
          <h1 className="text-ink-primary text-3xl font-bold">{product.name}</h1>
          <a
            href={product.url}
            target="_blank"
            rel="noreferrer"
            className="text-ink-secondary hover:text-brand-primary text-sm"
          >
            {product.url} ↗
          </a>
        </div>
        <button
          onClick={triggerAudit}
          disabled={runningAudit}
          className="bg-brand-primary hover:bg-brand-hover rounded-full px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {runningAudit ? 'Auditing…' : 'Run audit now'}
        </button>
      </header>

      {/* Scorecard */}
      <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Metric
          label="Readability"
          value={latest?.readability_score ?? '—'}
          sub={latest ? relative(latest.run_at) : 'No audits yet'}
        />
        <Metric
          label="AI mention rate"
          value={latest?.mention_rate != null ? `${Math.round(latest.mention_rate * 100)}%` : '—'}
          sub="across category prompts"
        />
        <Metric
          label="Category percentile"
          value={
            latest?.category_percentile != null ? `${Math.round(latest.category_percentile)}%` : '—'
          }
          sub={product.category_slug}
        />
      </section>

      {/* MRR progress */}
      <section className="border-border-primary mb-10 rounded-2xl border p-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-ink-primary text-lg font-semibold">MRR progress</h2>
          {mrrDelta !== null && mrrDelta !== 0 && (
            <span className={mrrDelta > 0 ? 'text-green-600' : 'text-red-500'}>
              {mrrDelta > 0 ? '↑' : '↓'} ${Math.abs(mrrDelta / 100).toLocaleString()} since last
              check-in
            </span>
          )}
        </div>
        <div className="text-ink-primary mb-3 text-2xl font-bold">
          ${(currentCents / 100).toLocaleString()}{' '}
          <span className="text-ink-secondary text-sm font-normal">
            / ${(goalCents / 100).toLocaleString()} goal
          </span>
        </div>
        <div className="bg-background-tertiary h-2 overflow-hidden rounded-full">
          <div className="bg-brand-primary h-full rounded-full" style={{ width: `${mrrPct}%` }} />
        </div>
        <form onSubmit={saveMrr} className="mt-4 flex gap-2">
          <input
            type="number"
            min="0"
            step="1"
            value={mrrInput}
            onChange={(e) => setMrrInput(e.target.value)}
            placeholder="Update current MRR ($)"
            className="border-border-primary flex-1 rounded-xl border px-4 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={savingMrr || !mrrInput}
            className="text-ink-primary border-border-primary hover:bg-background-secondary rounded-full border px-4 py-2 text-sm disabled:opacity-60"
          >
            {savingMrr ? 'Saving…' : 'Save'}
          </button>
        </form>
      </section>

      {/* Improvement actions */}
      <section className="mb-10">
        <h2 className="text-ink-primary mb-4 text-lg font-semibold">
          Next steps toward ${(goalCents / 100).toLocaleString()} MRR
        </h2>
        {actions.length === 0 ? (
          <p className="text-ink-secondary text-sm">
            {latest
              ? "You're all caught up. Run the next audit to surface new improvements."
              : 'Run your first audit to get improvement suggestions.'}
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {actions.map((a) => (
              <li
                key={a.id}
                className="border-border-primary flex items-start justify-between gap-4 rounded-2xl border p-5"
              >
                <div className="flex-1">
                  <p className="text-ink-primary font-medium">{a.title}</p>
                  {a.rationale && <p className="text-ink-secondary mt-1 text-sm">{a.rationale}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => updateAction(a.id, 'done')}
                    className="bg-brand-primary hover:bg-brand-hover rounded-full px-3 py-1.5 text-xs font-medium text-white"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => updateAction(a.id, 'dismissed')}
                    className="text-ink-secondary hover:text-ink-primary text-xs"
                  >
                    Dismiss
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Trend */}
      {snapshots.length > 1 && (
        <section className="mb-10">
          <h2 className="text-ink-primary mb-4 text-lg font-semibold">Mention-rate trend</h2>
          <Sparkline
            values={snapshots
              .slice()
              .reverse()
              .map((s) => s.mention_rate ?? 0)}
          />
        </section>
      )}

      {/* Gaps from latest audit */}
      {props.latestGaps.length > 0 && (
        <section className="mb-10">
          <h2 className="text-ink-primary mb-4 text-lg font-semibold">
            All issues from latest audit
          </h2>
          <ul className="border-border-primary divide-border-primary divide-y overflow-hidden rounded-2xl border">
            {props.latestGaps.map((g) => (
              <li key={g.id} className="p-4">
                <div className="text-ink-primary text-sm font-medium">{g.description}</div>
                <div className="text-ink-secondary mt-1 text-xs">
                  {g.severity} · {g.category.replace(/_/g, ' ')}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border-border-primary rounded-2xl border p-5">
      <p className="text-ink-secondary mb-1 text-xs tracking-wide uppercase">{label}</p>
      <p className="text-ink-primary text-3xl font-bold">{value}</p>
      {sub && <p className="text-ink-tertiary mt-1 text-xs">{sub}</p>}
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const w = 600;
  const h = 80;
  const max = Math.max(...values, 0.01);
  const min = 0;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / (max - min)) * h;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="border-border-primary w-full rounded-2xl border p-4">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points={pts} />
    </svg>
  );
}

function relative(unix: number): string {
  const days = Math.floor((Date.now() / 1000 - unix) / 86400);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}
