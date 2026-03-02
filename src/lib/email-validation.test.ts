import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  isDisposableEmail,
  isHoneypotTriggered,
  HONEYPOT_FIELD_NAME,
} from './email-validation';

describe('validateEmail', () => {
  it('accepts a valid email', () => {
    expect(validateEmail('user@gmail.com')).toEqual({ valid: true });
  });

  it('accepts email with subdomain', () => {
    expect(validateEmail('user@mail.example.org')).toEqual({ valid: true });
  });

  it('trims and lowercases before validating', () => {
    expect(validateEmail('  User@Gmail.COM  ')).toEqual({ valid: true });
  });

  it('rejects empty string', () => {
    const result = validateEmail('');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Email is required.');
  });

  it('rejects undefined cast to string', () => {
    const result = validateEmail(undefined as unknown as string);
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Email is required.');
  });

  it('rejects non-string input', () => {
    const result = validateEmail(123 as unknown as string);
    expect(result.valid).toBe(false);
  });

  it('rejects missing @ symbol', () => {
    const result = validateEmail('userexample.com');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please enter a valid email address.');
  });

  it('rejects missing domain', () => {
    const result = validateEmail('user@');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please enter a valid email address.');
  });

  it('rejects missing TLD', () => {
    const result = validateEmail('user@example');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please enter a valid email address.');
  });

  it('rejects email with spaces', () => {
    const result = validateEmail('user @example.com');
    expect(result.valid).toBe(false);
  });

  it('rejects disposable email domain', () => {
    const result = validateEmail('test@mailinator.com');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please use a permanent email address.');
  });

  it('rejects disposable email case-insensitively', () => {
    const result = validateEmail('test@YOPMAIL.COM');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Please use a permanent email address.');
  });

  it('accepts non-disposable domains', () => {
    expect(validateEmail('user@company.io')).toEqual({ valid: true });
  });

  it('accepts plus-addressed emails', () => {
    expect(validateEmail('user+tag@gmail.com')).toEqual({ valid: true });
  });
});

describe('isDisposableEmail', () => {
  it('returns true for known disposable domain', () => {
    expect(isDisposableEmail('a@mailinator.com')).toBe(true);
  });

  it('returns true for another disposable domain', () => {
    expect(isDisposableEmail('a@guerrillamail.com')).toBe(true);
  });

  it('returns false for normal domain', () => {
    expect(isDisposableEmail('a@gmail.com')).toBe(false);
  });

  it('returns false when no @ in email', () => {
    expect(isDisposableEmail('noemail')).toBe(false);
  });

  it('handles case-insensitive domain', () => {
    expect(isDisposableEmail('a@TEMPMAIL.COM')).toBe(true);
  });
});

describe('isHoneypotTriggered', () => {
  it('returns true when honeypot field has a value', () => {
    expect(isHoneypotTriggered({ [HONEYPOT_FIELD_NAME]: 'spam bot was here' })).toBe(true);
  });

  it('returns false when honeypot field is empty string', () => {
    expect(isHoneypotTriggered({ [HONEYPOT_FIELD_NAME]: '' })).toBe(false);
  });

  it('returns false when honeypot field is missing', () => {
    expect(isHoneypotTriggered({ email: 'user@test.com' })).toBe(false);
  });

  it('returns false when honeypot field is non-string', () => {
    expect(isHoneypotTriggered({ [HONEYPOT_FIELD_NAME]: 123 })).toBe(false);
  });
});
