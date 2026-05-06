import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { resolveLogo, stripIconTitle } from '@/lib/gallery/logo';

interface CompanyEntry {
  slug: string;
  name: string;
  url: string;
  simpleIcon: string | null;
}

interface CompaniesFile {
  companies: CompanyEntry[];
}

function loadCompanies(): CompanyEntry[] {
  const raw = readFileSync(join(process.cwd(), 'data/gallery/companies.json'), 'utf8');
  return (JSON.parse(raw) as CompaniesFile).companies;
}

interface Props {
  label?: string;
}

export function LogoMarquee({ label = 'Product files inspired from' }: Props) {
  const companies = loadCompanies().filter((c) => c.simpleIcon);
  // Render the track twice so the -50% translate stitches seamlessly.
  const track = [...companies, ...companies];

  return (
    <div className="border-border-primary w-full border-t border-b">
      <div className="flex w-full items-center gap-6 px-6 py-5 md:gap-10">
        <span className="eyebrow text-ink-tertiary hidden whitespace-nowrap md:inline">
          {label}
        </span>
        <div className="marquee-mask relative flex-1 overflow-hidden">
          <div className="animate-marquee flex w-max items-stretch">
            {track.map((c, i) => {
              const logo = resolveLogo(c.simpleIcon);
              return (
                <div
                  key={`${c.slug}-${i}`}
                  className="border-border-primary text-ink-tertiary hover:text-ink-primary flex flex-shrink-0 items-center gap-2 border-r px-6 py-1 transition-colors md:px-8"
                  aria-hidden={i >= companies.length ? 'true' : undefined}
                >
                  <span
                    className="inline-flex h-5 w-5 items-center justify-center [&_svg]:h-full [&_svg]:w-full [&_svg]:fill-current"
                    dangerouslySetInnerHTML={{ __html: stripIconTitle(logo.svg) }}
                  />
                  <span className="text-sm font-medium whitespace-nowrap">{c.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
