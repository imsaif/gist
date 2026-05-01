import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { LandingWithAudit } from './LandingWithAudit';

function FeatureCard({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="bg-background-secondary rounded-2xl p-6 md:p-8">
      <Icon className="text-ink-primary mb-6 h-5 w-5" />
      <h3 className="text-ink-primary mb-3 text-base font-semibold">{title}</h3>
      <p className="text-ink-secondary text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function MarketingSections() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-12">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FeatureCard
          icon={MagnifyingGlassIcon}
          title="Audit ChatGPT and Claude"
          body="Run your URL through both. See where they're right, where they're wrong, and where they invent things."
        />
        <FeatureCard
          icon={DocumentTextIcon}
          title="Generate an llms.gist"
          body="Patches what AI misses about your product. Drop it in your repo as llms.gist, or paste into ChatGPT."
        />
        <FeatureCard
          icon={CodeBracketIcon}
          title="Open standard, no lock-in"
          body="Just markdown with a tiny schema. Cursor, Claude Code, ChatGPT — they all read it."
        />
        <FeatureCard
          icon={ArrowPathIcon}
          title="Re-run anytime"
          body="Re-audit when you ship a feature, change positioning, or quarterly. Manual — you decide."
        />
      </div>
    </div>
  );
}

export default function Home() {
  return <LandingWithAudit marketingSections={<MarketingSections />} />;
}
