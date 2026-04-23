'use client';

import { useState } from 'react';

interface AuditInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
  remaining?: number;
}

export function AuditInput({ onSubmit, isLoading, remaining }: AuditInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    let normalizedUrl = url.trim();
    if (!normalizedUrl) {
      setError('Please enter a URL');
      return;
    }

    // Add https:// if no protocol
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    try {
      new URL(normalizedUrl);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    onSubmit(normalizedUrl);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
            placeholder="https://yourproduct.com"
            disabled={isLoading}
            className="border-border-primary focus:border-border-secondary disabled:bg-background-secondary disabled:text-ink-tertiary bg-surface-primary w-full rounded-full border px-5 py-3.5 text-base shadow-[0_2px_8px_rgba(51,65,85,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] transition-colors outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-brand-primary hover:bg-brand-hover rounded-full px-7 py-3.5 font-medium text-white transition-colors disabled:opacity-60"
        >
          {isLoading ? 'Auditing...' : 'Run audit'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {remaining !== undefined && remaining >= 0 && (
        <p className="text-ink-tertiary mt-2 text-sm">
          {remaining} audit{remaining !== 1 ? 's' : ''} remaining today
        </p>
      )}
    </form>
  );
}
