'use client';

import { useState, useRef } from 'react';
import { HONEYPOT_FIELD_NAME } from '@/lib/email-validation';

interface EmailGateProps {
  onVerified: (verifiedToken: string) => void;
  onClose: () => void;
}

export function EmailGate({ onVerified, onClose }: EmailGateProps) {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [challenge, setChallenge] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/request-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          [HONEYPOT_FIELD_NAME]: honeypotRef.current?.value || '',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      setChallenge(data.challenge);
      setStep('code');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          code: code.trim(),
          challenge,
          [HONEYPOT_FIELD_NAME]: honeypotRef.current?.value || '',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      if (data.verified) {
        onVerified(data.verifiedToken);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-bg-primary border-border-light relative mx-4 w-full max-w-md rounded-2xl border p-8 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="text-text-tertiary hover:text-text-primary absolute top-4 right-4 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="bg-accent-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="text-accent-primary h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>
        </div>

        <h2 className="text-text-primary mb-2 text-center text-lg font-semibold">
          {step === 'email' ? 'Verify your email to continue' : 'Enter verification code'}
        </h2>
        <p className="text-text-secondary mb-6 text-center text-sm">
          {step === 'email'
            ? 'Your first gist file was free. Enter your email to keep creating.'
            : `We sent a 6-digit code to ${email}`}
        </p>

        {/* Honeypot field - hidden from users, visible to bots */}
        <input
          ref={honeypotRef}
          type="text"
          name={HONEYPOT_FIELD_NAME}
          tabIndex={-1}
          autoComplete="off"
          style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
        />

        {step === 'email' ? (
          <form onSubmit={handleRequestCode}>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
              }}
              placeholder="you@example.com"
              autoFocus
              className="border-border-light focus:border-accent-primary mb-3 w-full rounded-xl border px-4 py-3 text-sm transition-colors outline-none"
            />
            {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={isLoading || !email.trim()}
              className="bg-accent-primary hover:bg-accent-hover disabled:bg-bg-tertiary disabled:text-text-tertiary w-full rounded-xl px-4 py-3 text-sm font-medium text-white transition-colors"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Sending code...
                </span>
              ) : (
                'Send verification code'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                setCode(val);
                setError(null);
              }}
              placeholder="123456"
              autoFocus
              inputMode="numeric"
              maxLength={6}
              className="border-border-light focus:border-accent-primary mb-3 w-full rounded-xl border px-4 py-3 text-center font-mono text-lg tracking-widest transition-colors outline-none"
            />
            {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="bg-accent-primary hover:bg-accent-hover disabled:bg-bg-tertiary disabled:text-text-tertiary mb-3 w-full rounded-xl px-4 py-3 text-sm font-medium text-white transition-colors"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify'
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setCode('');
                setChallenge('');
                setError(null);
              }}
              className="text-text-tertiary hover:text-text-primary w-full text-center text-sm transition-colors"
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
