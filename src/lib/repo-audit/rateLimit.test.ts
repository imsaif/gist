import { describe, it, expect } from 'vitest';
import { limiterPrefix } from './rateLimit';

describe('limiterPrefix', () => {
  it('namespaces by environment so local never eats production counters', () => {
    expect(limiterPrefix('production', 'audit')).toBe('rl:production:audit');
    expect(limiterPrefix('development', 'audit')).toBe('rl:development:audit');
  });

  it('falls back to development when the environment is unset', () => {
    expect(limiterPrefix(undefined, 'generate')).toBe('rl:development:generate');
  });
});
