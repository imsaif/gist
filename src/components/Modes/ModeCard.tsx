'use client';

import Link from 'next/link';

export type ModeType = 'brief' | 'critique' | 'research' | 'stakeholder' | 'ia';

interface ModeCardProps {
  mode: ModeType;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  disabled?: boolean;
}

export function ModeCard({
  mode,
  title,
  description,
  icon,
  href,
  disabled = false,
}: ModeCardProps) {
  const content = (
    <div
      className={`group flex h-44 w-full flex-col items-center justify-center rounded-2xl border-2 p-6 text-center transition-all ${
        disabled
          ? 'cursor-not-allowed border-border-light bg-bg-secondary opacity-60'
          : 'cursor-pointer border-border-light bg-white hover:border-accent-primary hover:shadow-lg'
      }`}
    >
      <div
        className={`mb-3 text-4xl transition-transform ${
          disabled ? '' : 'group-hover:scale-110'
        }`}
      >
        {icon}
      </div>
      <h3 className="mb-1 text-lg font-semibold text-text-primary">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
      {disabled && (
        <span className="mt-2 rounded-full bg-bg-tertiary px-2 py-0.5 text-xs text-text-tertiary">
          Coming soon
        </span>
      )}
    </div>
  );

  if (disabled) {
    return content;
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
