import type { Metadata } from 'next';
import { SiteHeader } from '@/components/Layout/SiteHeader';
import { AuditHero } from '@/components/Audit';

export const metadata: Metadata = {
  title: 'Audit your product · llms.gist',
  description:
    'Audit what ChatGPT and Claude say about your product. Generate an llms.gist file that fixes the gaps.',
};

export default function StartPage() {
  return (
    <div className="bg-background-primary min-h-screen">
      <SiteHeader active="audit" />
      <main className="relative mx-auto max-w-5xl px-6">
        <section className="pt-20 pb-10 text-center md:pt-28">
          <h1 className="text-ink-primary mb-6 text-4xl leading-[1.05] font-bold tracking-[-0.03em] md:text-5xl lg:text-6xl">
            AI doesn&apos;t know your product.
            <br />
            <span className="text-brand-primary">llms.gist makes sure it knows.</span>
          </h1>
          <p className="text-ink-secondary mx-auto mb-10 max-w-md text-base leading-relaxed">
            Audit what ChatGPT and Claude say about you. Fix the gaps with an{' '}
            <code className="bg-background-secondary rounded px-1 py-0.5 text-sm font-medium">
              llms.gist
            </code>{' '}
            file in your repo.
          </p>
          <AuditHero />
        </section>
      </main>
    </div>
  );
}
