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
    <div className="border-border-light bg-bg-primary mx-auto max-w-md rounded-xl border p-6 text-center">
      <h3 className="text-text-primary mb-2 text-lg font-semibold">
        Enter your email to run the audit
      </h3>
      <p className="text-text-secondary mb-4 text-sm">
        We&apos;ll email you when the results are ready.
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
          className="border-border-light focus:border-accent-primary w-full rounded-xl border px-4 py-3 text-base transition-colors outline-none"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={!email.trim()}
          className="bg-accent-primary hover:bg-accent-hover disabled:bg-bg-tertiary disabled:text-text-tertiary rounded-xl px-6 py-3 font-medium text-white transition-colors"
        >
          Run audit
        </button>
      </form>
    </div>
  );
}
