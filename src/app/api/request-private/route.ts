import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateEmail } from '@/lib/email-validation';

const resend = new Resend(process.env.RESEND_API_KEY);

interface Body {
  url?: string;
  email?: string;
  name?: string;
  description?: string;
  stack?: string;
  refSlug?: string;
}

function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const url = (body.url ?? '').trim();
    const email = (body.email ?? '').trim();
    const name = (body.name ?? '').trim();
    const description = (body.description ?? '').trim();
    const stack = (body.stack ?? '').trim();
    const refSlug = (body.refSlug ?? '').trim();

    if (!url || !isValidUrl(url)) {
      return NextResponse.json({ error: 'A valid website URL is required.' }, { status: 400 });
    }
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json({ error: emailValidation.error }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json(
        { error: 'A one-line product description is required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();
    const ownerEmail = process.env.REQUEST_PRIVATE_TO_EMAIL || 'hello@llmsgist.org';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@llmsgist.org';

    const summaryLines = [
      `Product: ${name}`,
      `URL: ${url}`,
      `Email: ${normalizedEmail}`,
      `Description: ${description}`,
      stack ? `Stack: ${stack}` : null,
      refSlug ? `Referrer slug: ${refSlug}` : null,
      `Submitted: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join('\n');

    if (process.env.MOCK_MODE === 'true') {
      console.log('\n[MOCK_MODE] private llms.gist request:\n' + summaryLines + '\n');
      return NextResponse.json({ ok: true });
    }

    // Email the project owner with the request details
    const { error: ownerError } = await resend.emails.send({
      from: `Gist Requests <${fromEmail}>`,
      to: ownerEmail,
      replyTo: normalizedEmail,
      subject: `Private llms.gist request — ${name}`,
      text: summaryLines,
    });
    if (ownerError) {
      console.error('Resend (owner) failed:', ownerError);
      return NextResponse.json(
        { error: 'We couldn’t submit your request. Please try again or email hello@llmsgist.org.' },
        { status: 500 }
      );
    }

    // Confirmation email to the requester
    await resend.emails.send({
      from: `Gist <${fromEmail}>`,
      to: normalizedEmail,
      subject: 'We got your private llms.gist request',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 20px; color: #1f1f1f;">
          <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 12px;">Request received</h2>
          <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
            Thanks — we’ve got your request for <strong>${name}</strong>. We’ll email you a Stripe payment link within 1 business day to confirm and start the work. Delivery is 2–3 business days from payment.
          </p>
          <p style="color: #555; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">
            Reply to this email if anything about your product changes before we get started.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">— llms.gist</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Private request error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
