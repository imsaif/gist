import { NextResponse } from 'next/server';
import { validateEmail, isHoneypotTriggered } from '@/lib/email-validation';
import { verifyChallenge, createVerifiedToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code, challenge } = body;

    // Honeypot check
    if (isHoneypotTriggered(body)) {
      return NextResponse.json({ verified: true, verifiedToken: 'ok' });
    }

    // Validate inputs
    if (!challenge || typeof challenge !== 'string') {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required.' }, { status: 400 });
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json({ error: emailValidation.error }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verify the code against the HMAC-signed challenge
    const result = verifyChallenge(challenge, normalizedEmail, code.trim());

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Issue a long-lived verified token
    const verifiedToken = createVerifiedToken(normalizedEmail);

    return NextResponse.json({ verified: true, verifiedToken });
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
