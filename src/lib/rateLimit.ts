import { db } from './db';

interface RateLimitConfig {
  scope: string;
  windowMs?: number;
  windowLimit: number;
  dayLimit: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

// Persistent rate limiter backed by libsql/Turso. The previous in-memory
// implementation didn't survive across Vercel function instances or cold
// starts — effectively a no-op in prod. This version reads/writes the
// rate_limit_events table so limits are consistent across the fleet.
function createRateLimiter(config: RateLimitConfig) {
  const windowMs = config.windowMs ?? HOUR_MS;
  const windowSec = Math.ceil(windowMs / 1000);
  const daySec = Math.ceil(DAY_MS / 1000);

  return async function checkRateLimit(key: string): Promise<RateLimitResult> {
    // Local dev escape hatch. Set DISABLE_RATE_LIMIT=true in .env.local to
    // bypass the persistent limiter while iterating on the audit flow. Should
    // never be set in production — the prebuild migration runs against Turso
    // and the limit is what protects the LLM credit card.
    if (process.env.DISABLE_RATE_LIMIT === 'true') {
      return { allowed: true, remaining: Number.POSITIVE_INFINITY, retryAfterSeconds: 0 };
    }

    const client = db();
    const nowSec = Math.floor(Date.now() / 1000);
    const dayCutoff = nowSec - daySec;
    const windowCutoff = nowSec - windowSec;

    // One read: pull every event for this key in the last 24h, ordered.
    const res = await client.execute({
      sql: 'select ts from rate_limit_events where scope = ? and key = ? and ts > ? order by ts asc',
      args: [config.scope, key, dayCutoff],
    });
    const timestamps = res.rows.map((r) => Number(r.ts));
    const inWindow = timestamps.filter((t) => t > windowCutoff);

    if (inWindow.length >= config.windowLimit) {
      const oldestInWindow = inWindow[0];
      const retryAfterSeconds = Math.max(1, windowSec - (nowSec - oldestInWindow));
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    if (timestamps.length >= config.dayLimit) {
      const oldestInDay = timestamps[0];
      const retryAfterSeconds = Math.max(1, daySec - (nowSec - oldestInDay));
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    // Best-effort write. Don't await-block on cleanup; the index is small.
    await client.execute({
      sql: 'insert into rate_limit_events (scope, key, ts) values (?, ?, ?)',
      args: [config.scope, key, nowSec],
    });

    // Opportunistic GC: prune events older than 24h for this key.
    // Cheap because it's keyed on the same index we just hit.
    await client.execute({
      sql: 'delete from rate_limit_events where scope = ? and key = ? and ts <= ?',
      args: [config.scope, key, dayCutoff],
    });

    const windowRemaining = config.windowLimit - inWindow.length - 1;
    const dayRemaining = config.dayLimit - timestamps.length - 1;

    return {
      allowed: true,
      remaining: Math.max(0, Math.min(windowRemaining, dayRemaining)),
      retryAfterSeconds: 0,
    };
  };
}

export const checkAuditRateLimit = createRateLimiter({
  scope: 'audit',
  windowMs: 10 * 60 * 1000,
  windowLimit: 1,
  dayLimit: 3,
});

export const checkChatRateLimit = createRateLimiter({
  scope: 'chat',
  windowLimit: 30,
  dayLimit: 100,
});
