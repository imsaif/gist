interface RateLimitConfig {
  hourLimit: number;
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
  const requestLog = new Map<string, number[]>();

  return function checkRateLimit(ip: string): RateLimitResult {
    const now = Date.now();
    const timestamps = requestLog.get(ip) || [];

    // Clean old entries (older than 24h)
    const recent = timestamps.filter((t) => now - t < DAY_MS);

    const lastHour = recent.filter((t) => now - t < HOUR_MS);
    const lastDay = recent;

    if (lastHour.length >= config.hourLimit) {
      const oldestInHour = lastHour[0];
      const retryAfterSeconds = Math.ceil((HOUR_MS - (now - oldestInHour)) / 1000);
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    if (lastDay.length >= config.dayLimit) {
      const oldestInDay = lastDay[0];
      const retryAfterSeconds = Math.ceil((DAY_MS - (now - oldestInDay)) / 1000);
      return { allowed: false, remaining: 0, retryAfterSeconds };
    }

    // Record this request
    recent.push(now);
    requestLog.set(ip, recent);

    const hourRemaining = config.hourLimit - lastHour.length - 1;
    const dayRemaining = config.dayLimit - lastDay.length - 1;

    return {
      allowed: true,
      remaining: Math.min(hourRemaining, dayRemaining),
      retryAfterSeconds: 0,
    };
  };
}

export const checkAuditRateLimit = createRateLimiter({ hourLimit: 3, dayLimit: 5 });
export const checkChatRateLimit = createRateLimiter({ hourLimit: 30, dayLimit: 100 });
