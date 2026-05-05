import Link from 'next/link';
import { LockClosedIcon } from '@heroicons/react/24/outline';

interface Props {
  /** Optional `?ref=<slug>` so the request page can attribute the gallery entry that drove the click. */
  refSlug?: string;
  variant?: 'primary' | 'subtle';
  size?: 'xs' | 'sm' | 'md';
  label?: string;
}

export function RequestPrivateButton({
  refSlug,
  variant = 'primary',
  size = 'md',
  label = 'Request private llms.gist',
}: Props) {
  const href = refSlug ? `/request-private?ref=${encodeURIComponent(refSlug)}` : '/request-private';
  const sizing =
    size === 'xs'
      ? 'px-3 py-1 text-xs'
      : size === 'sm'
        ? 'px-4 py-2 text-sm'
        : 'px-5 py-2.5 text-sm md:px-6 md:py-3 md:text-base';
  const palette =
    variant === 'primary'
      ? 'bg-brand-primary hover:bg-brand-hover text-white shadow-sm'
      : 'bg-background-secondary hover:bg-background-tertiary text-ink-primary border-border-primary border';
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full font-medium transition-colors ${palette} ${sizing}`}
    >
      <LockClosedIcon className={size === 'xs' ? 'h-3 w-3' : 'h-4 w-4'} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
