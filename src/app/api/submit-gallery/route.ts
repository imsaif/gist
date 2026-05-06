import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateEmail } from '@/lib/email-validation';

const resend = new Resend(process.env.RESEND_API_KEY);

interface Body {
  url?: string;
  name?: string;
  email?: string;
  category?: string;
  description?: string;
}

const ALLOWED_CATEGORIES = new Set([
  'ai-llm',
  'dev-tools',
  'backend-devops',
  'productivity',
  'design',
  'fintech',
]);

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
    const name = (body.name ?? '').trim();
    const email = (body.email ?? '').trim();
    const category = (body.category ?? '').trim();
    const description = (body.description ?? '').trim();

    if (!url || !isValidUrl(url)) {
      return NextResponse.json({ error: 'A valid website URL is required.' }, { status: 400 });
    }
    if (!name) {
      return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
    }
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json({ error: emailValidation.error }, { status: 400 });
    }
    if (!ALLOWED_CATEGORIES.has(category)) {
      return NextResponse.json({ error: 'Please pick a category.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();
    const ownerEmail = process.env.GALLERY_SUBMIT_TO_EMAIL || 'hello@llmsgist.org';
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@llmsgist.org';

    const summary = [
      `Product: ${name}`,
      `URL: ${url}`,
      `Category: ${category}`,
      `Email: ${normalizedEmail}`,
      description ? `Description: ${description}` : null,
      `Submitted: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join('\n');

    if (process.env.MOCK_MODE === 'true') {
      console.log('\n[MOCK_MODE] gallery submission:\n' + summary + '\n');
      return NextResponse.json({ ok: true });
    }

    const { error: ownerError } = await resend.emails.send({
      from: `Gist Gallery <${fromEmail}>`,
      to: ownerEmail,
      replyTo: normalizedEmail,
      subject: `Gallery submission — ${name} (clean audit)`,
      text: summary,
    });
    if (ownerError) {
      console.error('Resend (gallery owner) failed:', ownerError);
      return NextResponse.json(
        { error: 'We couldn’t submit. Please try again or email hello@llmsgist.org.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Gallery submit error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
