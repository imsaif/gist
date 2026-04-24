import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { db } from '@/lib/db';
import baselines from '@/data/categoryBaselines.json';
import { OnboardingForm } from './OnboardingForm';

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) redirect('/login?next=/onboarding');

  // One product per user for MVP — if they already have one, go to dashboard.
  const existing = await db().execute({
    sql: 'select id from products where user_id = ? and archived_at is null limit 1',
    args: [session.email],
  });
  if (existing.rows.length > 0) redirect('/dashboard');

  const categories = baselines.categories.map((c) => ({
    slug: c.slug,
    label: c.label,
    suggestedMrr: c.suggestedMrr,
  }));

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-ink-primary mb-2 text-3xl font-bold">Start tracking your product</h1>
      <p className="text-ink-secondary mb-8 text-base">
        We&apos;ll audit it weekly and show how you&apos;re tracking toward your MRR goal.
      </p>
      <OnboardingForm categories={categories} />
    </div>
  );
}
