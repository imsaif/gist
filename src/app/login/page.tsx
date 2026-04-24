'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/dashboard';

  const [stage, setStage] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [challenge, setChallenge] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/request-code', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send code');
      setChallenge(data.challenge);
      setStage('code');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, code, challenge }),
      });
      const data = await res.json();
      if (!res.ok || !data.verified) throw new Error(data.error || 'Invalid code');
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-ink-primary mb-2 text-3xl font-bold">Sign in to Gist</h1>
      <p className="text-ink-secondary mb-8 text-base">
        {stage === 'email'
          ? "We'll email you a 6-digit code. No passwords."
          : `Code sent to ${email}`}
      </p>

      {stage === 'email' ? (
        <form onSubmit={requestCode} className="flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoFocus
            className="border-border-primary focus:border-brand-primary rounded-xl border px-4 py-3 text-base transition-colors outline-none"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="bg-brand-primary hover:bg-brand-hover rounded-full px-7 py-3.5 font-medium text-white transition-colors disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send code'}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} className="flex flex-col gap-3">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="123456"
            autoFocus
            className="border-border-primary focus:border-brand-primary rounded-xl border px-4 py-3 text-center font-mono text-2xl tracking-[0.5em] transition-colors outline-none"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="bg-brand-primary hover:bg-brand-hover rounded-full px-7 py-3.5 font-medium text-white transition-colors disabled:opacity-60"
          >
            {loading ? 'Verifying…' : 'Continue'}
          </button>
          <button
            type="button"
            onClick={() => {
              setStage('email');
              setCode('');
              setError('');
            }}
            className="text-ink-secondary hover:text-ink-primary mt-2 text-sm"
          >
            Use a different email
          </button>
        </form>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-md px-6 py-16" />}>
      <LoginInner />
    </Suspense>
  );
}
