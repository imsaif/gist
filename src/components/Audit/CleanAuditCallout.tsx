'use client';

import { useState } from 'react';
import { CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface Props {
  url: string;
  productName?: string;
  productDescription?: string;
}

const GOOD_FINDINGS = [
  'No contradictions',
  'No fabrications',
  'No category drift',
  'No audience drift',
  'No pricing confusion',
];

const CATEGORIES = [
  { value: 'ai-llm', label: 'AI & LLM' },
  { value: 'dev-tools', label: 'Developer Tools' },
  { value: 'backend-devops', label: 'Backend & DevOps' },
  { value: 'productivity', label: 'Productivity & SaaS' },
  { value: 'design', label: 'Design & Creative' },
  { value: 'fintech', label: 'Fintech & Email' },
];

export function CleanAuditCallout({ url, productName = '', productDescription = '' }: Props) {
  const [stage, setStage] = useState<'callout' | 'form' | 'success'>('callout');
  const [name, setName] = useState(productName);
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !category) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/submit-gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          name,
          email,
          category,
          description: productDescription,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setStage('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (stage === 'success') {
    return (
      <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6 text-center">
        <CheckCircleIcon className="mx-auto mb-3 h-8 w-8 text-emerald-700" aria-hidden="true" />
        <h3 className="mb-1 text-base font-semibold text-emerald-900">Submitted for review</h3>
        <p className="text-sm text-emerald-800">
          Thanks. We&rsquo;ll review and add <strong>{name}</strong> to the public gallery within 1
          business day.
        </p>
      </div>
    );
  }

  if (stage === 'form') {
    return (
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/40 p-6"
      >
        <div>
          <h3 className="text-ink-primary text-base font-semibold">Add to the public gallery</h3>
          <p className="text-ink-secondary mt-1 text-sm">
            We&rsquo;ll write up a short page using this audit. A few details so we can publish it.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-ink-primary mb-1 block text-xs font-medium">Product name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme"
              className="border-border-primary bg-background-primary text-ink-primary placeholder:text-ink-tertiary focus:border-border-focus focus:ring-ring-focus w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:ring-2 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-ink-primary mb-1 block text-xs font-medium">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="border-border-primary bg-background-primary text-ink-primary placeholder:text-ink-tertiary focus:border-border-focus focus:ring-ring-focus w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:ring-2 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="text-ink-primary mb-1 block text-xs font-medium">Category</label>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border-border-primary bg-background-primary text-ink-primary focus:border-border-focus focus:ring-ring-focus w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:ring-2 focus:outline-none"
          >
            <option value="">Select a category…</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        {error && (
          <div className="border-status-error/30 bg-status-error/5 text-status-error rounded-lg border px-3 py-2 text-xs">
            {error}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={submitting || !name.trim() || !email.trim() || !category}
            className="bg-brand-primary hover:bg-brand-hover inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit for review'}
          </button>
          <button
            type="button"
            onClick={() => setStage('callout')}
            className="text-ink-tertiary hover:text-ink-primary cursor-pointer text-xs font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-6">
      <div className="mb-4 flex items-center gap-2">
        <CheckCircleIcon className="h-6 w-6 text-emerald-700" aria-hidden="true" />
        <h3 className="text-base font-semibold text-emerald-900">
          Clean audit — ChatGPT and Claude both got your product right.
        </h3>
      </div>
      <ul className="mb-5 grid gap-1.5 text-sm text-emerald-900 sm:grid-cols-2">
        {GOOD_FINDINGS.map((f) => (
          <li key={f} className="flex items-center gap-2">
            <CheckCircleIcon
              className="h-4 w-4 flex-shrink-0 text-emerald-700"
              aria-hidden="true"
            />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-5 border-t border-emerald-200 pt-5">
        <p className="text-ink-primary mb-3 flex items-start gap-2 text-sm">
          <SparklesIcon
            className="text-brand-primary mt-0.5 h-4 w-4 flex-shrink-0"
            aria-hidden="true"
          />
          <span>
            Clean audits are rare. Want us to feature{' '}
            <strong>{productName || 'your product'}</strong> in the public gallery so others can see
            what good looks like?
          </span>
        </p>
        <button
          onClick={() => setStage('form')}
          className="bg-ink-primary text-background-primary hover:bg-ink-secondary inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
        >
          Yes, add me to the gallery
        </button>
      </div>
    </div>
  );
}
