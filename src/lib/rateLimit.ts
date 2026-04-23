interface RateLimitConfig {
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

function createRateLimiter(config: RateLimitConfig) {
  const windowMs = config.windowMs ?? HOUR_MS;
  const requestLog = new Map<string, number[]>();

  return function checkRateLimit(ip: string): RateLimitResult {
    const now = Date.now();
    const timestamps = requestLog.get(ip) || [];

    const recent = timestamps.filter((t) => now - t < DAY_MS);
    const inWindow = recent.filter((t) => now - t < windowMs);

    if (inWindow.length >= config.windowLimit) {
      const oldestInWindow = inWindow[0];
      const retryAfterSeconds = Math.ceil((windowMs - (now - oldestInWindow)) / 1000);
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    if (recent.length >= config.dayLimit) {
      const oldestInDay = recent[0];
      const retryAfterSeconds = Math.ceil((DAY_MS - (now - oldestInDay)) / 1000);
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    recent.push(now);
    requestLog.set(ip, recent);

    const windowRemaining = config.windowLimit - inWindow.length - 1;
    const dayRemaining = config.dayLimit - recent.length;

    return {
      allowed: true,
      remaining: Math.min(windowRemaining, dayRemaining),
      retryAfterSeconds: 0,
    };
  };
}

export const checkAuditRateLimit = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  windowLimit: 1,
  dayLimit: 3,
});
export const checkChatRateLimit = createRateLimiter({ windowLimit: 30, dayLimit: 100 });
