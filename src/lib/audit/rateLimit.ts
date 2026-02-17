const requestLog = new Map<string, number[]>();

const HOUR_LIMIT = 3;
const DAY_LIMIT = 5;
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const timestamps = requestLog.get(ip) || [];

  // Clean old entries (older than 24h)
  const recent = timestamps.filter((t) => now - t < DAY_MS);

  const lastHour = recent.filter((t) => now - t < HOUR_MS);
  const lastDay = recent;

  if (lastHour.length >= HOUR_LIMIT) {
    const oldestInHour = lastHour[0];
    const retryAfterSeconds = Math.ceil((HOUR_MS - (now - oldestInHour)) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  if (lastDay.length >= DAY_LIMIT) {
    const oldestInDay = lastDay[0];
    const retryAfterSeconds = Math.ceil((DAY_MS - (now - oldestInDay)) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  // Record this request
  recent.push(now);
  requestLog.set(ip, recent);

  const hourRemaining = HOUR_LIMIT - lastHour.length - 1;
  const dayRemaining = DAY_LIMIT - lastDay.length - 1;

  return {
    allowed: true,
    remaining: Math.min(hourRemaining, dayRemaining),
    retryAfterSeconds: 0,
  };
}
