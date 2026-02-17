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
            className="border-border-light focus:border-accent-primary disabled:bg-bg-secondary disabled:text-text-tertiary w-full rounded-xl border px-4 py-3 text-base transition-colors outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="bg-accent-primary hover:bg-accent-hover disabled:bg-bg-tertiary disabled:text-text-tertiary rounded-xl px-6 py-3 font-medium text-white transition-colors"
        >
          {isLoading ? 'Auditing...' : 'Run audit'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {remaining !== undefined && remaining >= 0 && (
        <p className="text-text-tertiary mt-2 text-sm">
          {remaining} audit{remaining !== 1 ? 's' : ''} remaining today
        </p>
      )}
    </form>
  );
}
