import Link from 'next/link';
import GistIcon from '@/components/GistIcon';
import { RequestPrivateButton } from '@/components/Gallery/RequestPrivateButton';

interface SiteHeaderProps {
  /** Which nav entry should render in the brand colour. */
  active?: 'audit' | 'audited' | 'spec' | 'about';
  /** Set to false on pages that don't want the sticky glass treatment. */
  sticky?: boolean;
}

export function SiteHeader({ active, sticky = true }: SiteHeaderProps) {
  const cls = (key: string) =>
    active === key
      ? 'text-brand-primary hover:text-brand-hover text-sm font-medium transition-colors'
      : 'text-ink-secondary hover:text-ink-primary text-sm font-medium transition-colors';
  return (
    <header
      className={`${sticky ? 'glass-nav sticky top-0 z-50' : ''} flex h-14 items-center justify-between px-6`}
    >
      <div className="flex items-center gap-4">
        <Link href="/" className="text-ink-primary flex items-center gap-2 text-xl font-semibold">
          <GistIcon className="h-5 w-5" />
          llms.gist
        </Link>
        <RequestPrivateButton variant="primary" size="sm" />
      </div>
      <nav className="flex items-center gap-6">
        <Link href="/spec" className={cls('spec')}>
          Spec
        </Link>
      </nav>
    </header>
  );
}
