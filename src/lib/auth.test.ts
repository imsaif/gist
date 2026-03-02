import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createChallenge, verifyChallenge, createVerifiedToken, verifyVerifiedToken } from './auth';

describe('challenge', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('round-trips with correct email and code', () => {
    const challenge = createChallenge('user@test.com', '123456');
    const result = verifyChallenge(challenge, 'user@test.com', '123456');
    expect(result).toEqual({ valid: true });
  });

  it('fails with wrong email', () => {
    const challenge = createChallenge('user@test.com', '123456');
    const result = verifyChallenge(challenge, 'other@test.com', '123456');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid request.');
  });

  it('fails with wrong code', () => {
    const challenge = createChallenge('user@test.com', '123456');
    const result = verifyChallenge(challenge, 'user@test.com', '999999');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Incorrect code. Please try again.');
  });

  it('fails when expired (>10 min)', () => {
    const challenge = createChallenge('user@test.com', '123456');
    vi.advanceTimersByTime(11 * 60 * 1000); // 11 minutes
    const result = verifyChallenge(challenge, 'user@test.com', '123456');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Code expired. Please request a new one.');
  });

  it('succeeds just before expiry', () => {
    const challenge = createChallenge('user@test.com', '123456');
    vi.advanceTimersByTime(9 * 60 * 1000 + 59 * 1000); // 9m59s
    const result = verifyChallenge(challenge, 'user@test.com', '123456');
    expect(result).toEqual({ valid: true });
  });

  it('fails with tampered token', () => {
    const challenge = createChallenge('user@test.com', '123456');
    const tampered = challenge.slice(0, -4) + 'XXXX';
    const result = verifyChallenge(tampered, 'user@test.com', '123456');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Invalid or expired code.');
  });

  it('fails with malformed token (no dot)', () => {
    const result = verifyChallenge('not-a-valid-token', 'user@test.com', '123456');
    expect(result.valid).toBe(false);
  });

  it('fails with empty string', () => {
    const result = verifyChallenge('', 'user@test.com', '123456');
    expect(result.valid).toBe(false);
  });
});

describe('verifiedToken', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('round-trips with correct email', () => {
    const token = createVerifiedToken('user@test.com');
    const result = verifyVerifiedToken(token);
    expect(result).toEqual({ valid: true, email: 'user@test.com' });
  });

  it('returns email in result', () => {
    const token = createVerifiedToken('another@example.com');
    const result = verifyVerifiedToken(token);
    expect(result.email).toBe('another@example.com');
  });

  it('fails when expired (>30 days)', () => {
    const token = createVerifiedToken('user@test.com');
    vi.advanceTimersByTime(31 * 24 * 60 * 60 * 1000); // 31 days
    const result = verifyVerifiedToken(token);
    expect(result.valid).toBe(false);
  });

  it('succeeds at edge of expiry (29 days)', () => {
    const token = createVerifiedToken('user@test.com');
    vi.advanceTimersByTime(29 * 24 * 60 * 60 * 1000); // 29 days
    const result = verifyVerifiedToken(token);
    expect(result.valid).toBe(true);
    expect(result.email).toBe('user@test.com');
  });

  it('fails with tampered token', () => {
    const token = createVerifiedToken('user@test.com');
    const tampered = token.slice(0, -4) + 'XXXX';
    const result = verifyVerifiedToken(tampered);
    expect(result.valid).toBe(false);
  });

  it('fails with malformed token', () => {
    const result = verifyVerifiedToken('garbage.data.extra');
    expect(result.valid).toBe(false);
  });

  it('fails with empty string', () => {
    const result = verifyVerifiedToken('');
    expect(result.valid).toBe(false);
  });
});
