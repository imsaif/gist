/**
 * Email security validation for bot protection
 * Ported from AIUX project (aiuxdesign.guide)
 */

const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'example.com',
  'test.com',
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamail.de',
  'grr.la',
  'guerrillamail.net',
  'temp-mail.org',
  'tempmail.com',
  'yopmail.com',
  'yopmail.fr',
  '10minutemail.com',
  '10minute.email',
  'throwaway.email',
  'throwaway.com',
  'trashmail.com',
  'trashmail.me',
  'trashmail.net',
  'dispostable.com',
  'mailnesia.com',
  'maildrop.cc',
  'fakeinbox.com',
  'sharklasers.com',
  'guerrillamailblock.com',
  'tempail.com',
  'tempr.email',
  'temp-mail.io',
  'mohmal.com',
  'burnermail.io',
  'mailtemp.net',
  'emailondeck.com',
  'getnada.com',
  'mintemail.com',
  'tempinbox.com',
  'mytemp.email',
  'harakirimail.com',
  'jetable.org',
  'spamgourmet.com',
  'mailcatch.com',
  'discard.email',
  'disposableemailaddresses.emailmiser.com',
  'mailexpire.com',
  'tempmailo.com',
  'tempmailaddress.com',
  'crazymailing.com',
  'trash-mail.com',
  'wegwerfmail.de',
  'wegwerfmail.net',
  'binkmail.com',
  'safetymail.info',
  'filzmail.com',
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required.' };
  }

  const trimmed = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  if (isDisposableEmail(trimmed)) {
    return { valid: false, error: 'Please use a permanent email address.' };
  }

  return { valid: true };
}

export const HONEYPOT_FIELD_NAME = 'website_url';

export function isHoneypotTriggered(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD_NAME];
  return typeof value === 'string' && value.length > 0;
}
