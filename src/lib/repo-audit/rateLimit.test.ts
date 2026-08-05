import { describe, it, expect, vi } from 'vitest';
import { limiterPrefix, checkLimit } from './rateLimit';

describe('limiterPrefix', () => {
  it('namespaces by environment so local never eats production counters', () => {
    expect(limiterPrefix('production', 'audit')).toBe('rl:production:audit');
    expect(limiterPrefix('development', 'audit')).toBe('rl:development:audit');
  });

  it('falls back to development when the environment is unset', () => {
    expect(limiterPrefix(undefined, 'generate')).toBe('rl:development:generate');
  });
});

describe('checkLimit', () => {
  it('resolves to denial when the underlying limiter throws', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const throwingLimiter = () => Promise.reject(new Error('KV unreachable'));

    const result = await checkLimit('test', throwingLimiter);

    expect(result).toEqual({ ok: false, retryAfter: 60 });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Rate limit check failed for test:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it('resolves to denial when the underlying limiter rejects', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const rejectingLimiter = () => Promise.reject(new Error('Invalid credentials'));

    const result = await checkLimit('generate', rejectingLimiter);

    expect(result).toEqual({ ok: false, retryAfter: 60 });
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Rate limit check failed for generate:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });
});
