'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  slug: string;
  label: string;
  suggestedMrr?: {
    medianCurrentCents: number;
    typicalGoalCents: number;
    source: string;
  };
}

function dollars(cents: number): string {
  return (cents / 100).toFixed(0);
}

export function OnboardingForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const initial = categories[0];
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [categorySlug, setCategorySlug] = useState(initial?.slug ?? '');
  const [mrrCurrent, setMrrCurrent] = useState(
    initial?.suggestedMrr ? dollars(initial.suggestedMrr.medianCurrentCents) : ''
  );
  const [mrrGoal, setMrrGoal] = useState(
    initial?.suggestedMrr ? dollars(initial.suggestedMrr.typicalGoalCents) : ''
  );
  const [mrrTouched, setMrrTouched] = useState({ current: false, goal: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentCategory = categories.find((c) => c.slug === categorySlug);
  const suggestion = currentCategory?.suggestedMrr;

  function handleCategoryChange(next: string) {
    setCategorySlug(next);
    const cat = categories.find((c) => c.slug === next);
    if (!cat?.suggestedMrr) return;
    // Only overwrite if the user hasn't manually edited that field
    if (!mrrTouched.current) setMrrCurrent(dollars(cat.suggestedMrr.medianCurrentCents));
    if (!mrrTouched.goal) setMrrGoal(dollars(cat.suggestedMrr.typicalGoalCents));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          url: url.trim(),
          categorySlug,
          mrrGoalCents: mrrGoal ? Math.round(parseFloat(mrrGoal) * 100) : null,
          mrrCurrentCents: mrrCurrent ? Math.round(parseFloat(mrrCurrent) * 100) : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create product');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <Field label="Product name">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Acme"
          className="border-border-primary focus:border-brand-primary w-full rounded-xl border px-4 py-3 text-base outline-none"
        />
      </Field>

      <Field label="Product URL">
        <input
          type="url"
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://acme.com"
          className="border-border-primary focus:border-brand-primary w-full rounded-xl border px-4 py-3 text-base outline-none"
        />
      </Field>

      <Field label="Category">
        <select
          required
          value={categorySlug}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="border-border-primary focus:border-brand-primary w-full rounded-xl border px-4 py-3 text-base outline-none"
        >
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Current MRR ($)">
            <input
              type="number"
              min="0"
              step="1"
              value={mrrCurrent}
              onChange={(e) => {
                setMrrCurrent(e.target.value);
                setMrrTouched((t) => ({ ...t, current: true }));
              }}
              placeholder="1200"
              className="border-border-primary focus:border-brand-primary w-full rounded-xl border px-4 py-3 text-base outline-none"
            />
          </Field>
          <Field label="MRR goal ($)">
            <input
              type="number"
              min="0"
              step="1"
              value={mrrGoal}
              onChange={(e) => {
                setMrrGoal(e.target.value);
                setMrrTouched((t) => ({ ...t, goal: true }));
              }}
              placeholder="10000"
              className="border-border-primary focus:border-brand-primary w-full rounded-xl border px-4 py-3 text-base outline-none"
            />
          </Field>
        </div>
        {suggestion && (
          <p className="text-ink-tertiary mt-2 text-xs">
            Suggested for {currentCategory?.label}: ${dollars(suggestion.medianCurrentCents)} today,
            ${dollars(suggestion.typicalGoalCents)} goal. Source: {suggestion.source}. Adjust if you
            know better.
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading || !name.trim() || !url.trim()}
        className="bg-brand-primary hover:bg-brand-hover rounded-full px-7 py-3.5 font-medium text-white transition-colors disabled:opacity-60"
      >
        {loading ? 'Creating…' : 'Start tracking'}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-ink-secondary text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
