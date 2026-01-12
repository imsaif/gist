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
  title,
  description,
  icon,
  href,
  disabled = false,
}: Omit<ModeCardProps, 'mode'>) {
  const content = (
    <div
      className={`group flex h-44 w-full flex-col items-center justify-center rounded-2xl border-2 p-6 text-center transition-all ${
        disabled
          ? 'border-border-light bg-bg-secondary cursor-not-allowed opacity-60'
          : 'border-border-light hover:border-accent-primary cursor-pointer bg-white hover:shadow-lg'
      }`}
    >
      <div
        className={`mb-3 text-4xl transition-transform ${disabled ? '' : 'group-hover:scale-110'}`}
      >
        {icon}
      </div>
      <h3 className="text-text-primary mb-1 text-lg font-semibold">{title}</h3>
      <p className="text-text-secondary text-sm">{description}</p>
      {disabled && (
        <span className="bg-bg-tertiary text-text-tertiary mt-2 rounded-full px-2 py-0.5 text-xs">
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
