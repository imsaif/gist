'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  CATEGORY_LABELS,
  type CategoryCount,
  type GalleryCategory,
  type GalleryEntry,
} from '@/lib/gallery/loadResults';
import { resolveLogo, stripIconTitle } from '@/lib/gallery/logo';

interface Props {
  entries: GalleryEntry[];
  categoryCounts: CategoryCount[];
}

type SortKey = 'gaps' | 'critical' | 'readability' | 'name';

export function AuditedBrowser({ entries, categoryCounts }: Props) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'all'>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('gaps');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries
      .filter((e) => activeCategory === 'all' || e.category === activeCategory)
      .filter((e) => {
        if (!q) return true;
        return (
          e.name.toLowerCase().includes(q) ||
          (e.headline?.description ?? '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (sort === 'name') return a.name.localeCompare(b.name);
        if (sort === 'critical') return (b.criticalGaps ?? 0) - (a.criticalGaps ?? 0);
        if (sort === 'readability') {
          return readabilityRank(b.readabilityScore) - readabilityRank(a.readabilityScore);
        }
        return (b.totalGaps ?? 0) - (a.totalGaps ?? 0);
      });
  }, [entries, activeCategory, query, sort]);

  return (
    <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="eyebrow text-ink-tertiary mb-4">Find audits</p>
        <ul className="flex flex-col gap-1">
          <li>
            <CategoryButton
              label="All"
              count={entries.length}
              active={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
            />
          </li>
          {categoryCounts.map((c) => (
            <li key={c.category}>
              <CategoryButton
                label={c.label}
                count={c.count}
                active={activeCategory === c.category}
                onClick={() => setActiveCategory(c.category)}
              />
            </li>
          ))}
        </ul>
      </aside>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="border-border-primary bg-background-secondary focus-within:border-border-focus flex w-full items-center gap-2 rounded-full border px-4 py-2 sm:max-w-md">
            <span aria-hidden className="text-ink-tertiary">
              🔍
            </span>
            <input
              type="search"
              placeholder="Search audits"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-ink-primary placeholder:text-ink-tertiary w-full bg-transparent text-sm focus:outline-none"
            />
          </label>
          <p className="text-ink-tertiary text-xs">
            Showing {filtered.length} of {entries.length}
          </p>
        </div>

        <div className="border-border-primary overflow-hidden rounded-2xl border">
          <table className="w-full text-left text-sm">
            <thead className="bg-background-secondary text-ink-tertiary">
              <tr>
                <Th>#</Th>
                <Th onClick={() => setSort('name')} active={sort === 'name'}>
                  Product
                </Th>
                <Th>Description</Th>
                <Th onClick={() => setSort('gaps')} active={sort === 'gaps'} align="right">
                  Gaps
                </Th>
                <Th onClick={() => setSort('critical')} active={sort === 'critical'} align="right">
                  Critical
                </Th>
                <Th
                  onClick={() => setSort('readability')}
                  active={sort === 'readability'}
                  align="right"
                >
                  Readability
                </Th>
              </tr>
            </thead>
            <tbody className="divide-border-primary divide-y">
              {filtered.map((e, i) => (
                <Row key={e.slug} index={i + 1} entry={e} />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-ink-tertiary px-4 py-12 text-center text-sm">
                    No audits match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function CategoryButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? 'bg-background-secondary text-ink-primary font-medium'
          : 'text-ink-secondary hover:bg-background-secondary hover:text-ink-primary'
      }`}
    >
      <span>{label}</span>
      <span className="text-ink-tertiary text-xs tabular-nums">{count}</span>
    </button>
  );
}

function Th({
  children,
  align = 'left',
  onClick,
  active,
}: {
  children: React.ReactNode;
  align?: 'left' | 'right';
  onClick?: () => void;
  active?: boolean;
}) {
  const base = `px-4 py-3 text-xs font-medium uppercase tracking-wide ${
    align === 'right' ? 'text-right' : 'text-left'
  }`;
  if (!onClick) return <th className={base}>{children}</th>;
  return (
    <th className={base}>
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center gap-1 ${active ? 'text-ink-primary' : ''}`}
      >
        {children}
        {active && <span aria-hidden>↓</span>}
      </button>
    </th>
  );
}

function Row({ index, entry }: { index: number; entry: GalleryEntry }) {
  const logo = resolveLogo(entry.simpleIcon);
  return (
    <tr className="hover:bg-background-secondary/60 group transition-colors">
      <td className="text-ink-tertiary px-4 py-3 text-xs tabular-nums">{index}</td>
      <td className="px-4 py-3">
        <Link href={`/audited/${entry.slug}`} className="flex items-center gap-3">
          <span
            className="flex h-7 w-7 items-center justify-center rounded-md"
            style={{ background: `${logo.hex}1A`, color: logo.hex }}
            dangerouslySetInnerHTML={{
              __html: stripIconTitle(logo.svg).replace('<svg', '<svg width="16" height="16"'),
            }}
          />
          <span className="text-ink-primary group-hover:text-brand-primary font-medium">
            {entry.name}
          </span>
        </Link>
      </td>
      <td className="text-ink-secondary max-w-xl truncate px-4 py-3">
        {entry.headline?.description ?? '—'}
      </td>
      <td className="text-ink-primary px-4 py-3 text-right tabular-nums">{entry.totalGaps ?? 0}</td>
      <td className="px-4 py-3 text-right tabular-nums">
        <CriticalChip count={entry.criticalGaps ?? 0} />
      </td>
      <td className="px-4 py-3 text-right">
        <ReadabilityChip score={entry.readabilityScore} />
      </td>
    </tr>
  );
}

function CriticalChip({ count }: { count: number }) {
  if (count === 0) return <span className="text-ink-tertiary">0</span>;
  return (
    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
      {count}
    </span>
  );
}

function ReadabilityChip({ score }: { score: string | undefined }) {
  if (!score) return <span className="text-ink-tertiary">—</span>;
  const palette =
    score === 'Good'
      ? 'bg-green-50 text-green-700'
      : score === 'Partial'
        ? 'bg-amber-50 text-amber-700'
        : 'bg-red-50 text-red-700';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${palette}`}>
      {score}
    </span>
  );
}

function readabilityRank(s: string | undefined): number {
  if (s === 'Good') return 3;
  if (s === 'Partial') return 2;
  if (s === 'Poor') return 1;
  return 0;
}
