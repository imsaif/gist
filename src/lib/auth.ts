import crypto from 'crypto';

const SECRET = process.env.HMAC_SECRET || 'dev-secret-change-in-production';

// --- HMAC signing / verifying ---

function sign(payload: object): string {
  const json = JSON.stringify(payload);
  const encoded = Buffer.from(json).toString('base64url');
  const signature = crypto.createHmac('sha256', SECRET).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

function verify<T>(token: string): T | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encoded, signature] = parts;
  const expected = crypto.createHmac('sha256', SECRET).update(encoded).digest('base64url');
  if (signature !== expected) return null;
  try {
    return JSON.parse(Buffer.from(encoded, 'base64url').toString()) as T;
  } catch {
    return null;
  }
}

// --- Challenge: sent to client during email verification ---

interface ChallengePayload {
  email: string;
  code: string;
  exp: number;
}

const CHALLENGE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function createChallenge(email: string, code: string): string {
  return sign({ email, code, exp: Date.now() + CHALLENGE_TTL_MS } satisfies ChallengePayload);
}

export function verifyChallenge(
  challenge: string,
  email: string,
  code: string
): { valid: boolean; error?: string } {
  const payload = verify<ChallengePayload>(challenge);
  if (!payload) return { valid: false, error: 'Invalid or expired code.' };
  if (payload.exp < Date.now())
    return { valid: false, error: 'Code expired. Please request a new one.' };
  if (payload.email !== email) return { valid: false, error: 'Invalid request.' };
  if (payload.code !== code) return { valid: false, error: 'Incorrect code. Please try again.' };
  return { valid: true };
}

// --- Verified token: proves the user verified their email ---

interface VerifiedPayload {
  email: string;
  exp: number;
}

const VERIFIED_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export function createVerifiedToken(email: string): string {
  return sign({ email, exp: Date.now() + VERIFIED_TTL_MS } satisfies VerifiedPayload);
}

export function verifyVerifiedToken(token: string): { valid: boolean; email?: string } {
  const payload = verify<VerifiedPayload>(token);
  if (!payload) return { valid: false };
  if (payload.exp < Date.now()) return { valid: false };
  return { valid: true, email: payload.email };
}
