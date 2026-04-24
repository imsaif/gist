import { cookies } from 'next/headers';
import { createVerifiedToken, verifyVerifiedToken } from './auth';
import { db } from './db';

export const SESSION_COOKIE = 'gist_session';
const SESSION_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export interface Session {
  email: string;
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const result = verifyVerifiedToken(token);
  if (!result.valid || !result.email) return null;
  return { email: result.email };
}

export async function setSession(email: string): Promise<void> {
  const token = createVerifiedToken(email);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/**
 * Upsert a user row keyed by normalized email. Safe to call on every session
 * establishment — no-op if the row already exists.
 */
export async function upsertUser(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  await db().execute({
    sql: 'insert into users (id) values (?) on conflict (id) do nothing',
    args: [normalized],
  });
}
