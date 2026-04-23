'use client';

import { useState } from 'react';

interface AuditEmailGateProps {
  onUnlocked: () => void;
}

export function AuditEmailGate({ onUnlocked }: AuditEmailGateProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email');
      return;
    }

    sessionStorage.setItem('audit_email', trimmed);
    onUnlocked();
  };

  return (
    <div className="border-border-primary bg-background-primary mx-auto max-w-md rounded-xl border p-6 text-center">
      <h3 className="text-ink-primary mb-2 text-lg font-semibold">
        Enter your email to download your fix file
      </h3>
      <p className="text-ink-secondary mb-4 text-sm">
        We&apos;ll send you the .gist.design file and notify you when ChatGPT or Claude change how
        they describe your product.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          placeholder="you@company.com"
          className="border-border-primary focus:border-brand-primary w-full rounded-xl border px-4 py-3 text-base transition-colors outline-none"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={!email.trim()}
          className="bg-brand-primary hover:bg-brand-hover disabled:bg-background-tertiary disabled:text-ink-tertiary rounded-full px-7 py-3.5 font-medium text-white transition-colors"
        >
          Continue to fix
        </button>
      </form>
    </div>
  );
}
