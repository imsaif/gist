import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateEmail, isHoneypotTriggered } from '@/lib/email-validation';
import { createChallenge } from '@/lib/auth';

const resend = new Resend(process.env.RESEND_API_KEY);

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Honeypot check — silently accept to not tip off bots
    if (isHoneypotTriggered(body)) {
      return NextResponse.json({ success: true, challenge: 'ok' });
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json({ error: emailValidation.error }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Generate code and create HMAC-signed challenge
    const code = generateCode();
    const challenge = createChallenge(normalizedEmail, code);

    // Send email via Resend
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@gist.design';
    await resend.emails.send({
      from: `Gist <${fromEmail}>`,
      to: normalizedEmail,
      subject: 'Your verification code',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">Your verification code</h2>
          <p style="color: #666; font-size: 14px; margin-bottom: 24px;">Enter this code to continue using Gist.</p>
          <div style="background: #f5f5f5; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 32px; font-weight: 700; letter-spacing: 6px; font-family: monospace;">${code}</span>
          </div>
          <p style="color: #999; font-size: 12px;">This code expires in 10 minutes.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, challenge });
  } catch (error) {
    console.error('Request code error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
