import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

export function limiterPrefix(env: string | undefined, name: string): string {
  return `rl:${env ?? 'development'}:${name}`;
}

function redis(): Redis {
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

function make(name: string, limit: number, window: `${number} ${'s' | 'm' | 'h'}`) {
  return new Ratelimit({
    redis: redis(),
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix: limiterPrefix(process.env.VERCEL_ENV, name),
    analytics: false,
  });
}

// Per visitor: enough to audit a few repos, not enough to walk a list.
export async function checkAuditLimit(ip: string) {
  const { success, reset } = await make('audit', 10, '10 m').limit(ip);
  return { ok: success, retryAfter: Math.max(0, Math.ceil((reset - Date.now()) / 1000)) };
}

// Global spend ceiling. Fails closed rather than running up a bill.
export async function checkGenerateLimit() {
  const { success, reset } = await make('generate', 60, '1 h').limit('global');
  return { ok: success, retryAfter: Math.max(0, Math.ceil((reset - Date.now()) / 1000)) };
}
