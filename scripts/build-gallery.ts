/**
 * Build the /audited gallery.
 *
 * Reads data/gallery/companies.json, runs runAudit() against each URL, writes
 * one JSON file per company at data/gallery/results/<slug>.json. The gallery
 * page template consumes these JSONs statically — no runtime audit call on
 * /audited/<slug> page load.
 *
 * Flags:
 *   --force     Re-audit companies that already have a result file
 *   --only=X    Comma-separated slugs to audit (skip everything else)
 *   --mock      Use MOCK_MODE audit output regardless of env
 *
 * Rate limiting: runs sequentially with a 2s pause between audits so we don't
 * hammer OpenAI/Anthropic. If a single audit fails it's recorded in the
 * result JSON and the loop continues.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { runAudit } from '../src/lib/audit/runAudit';
import { buildMockAnalysis } from './mockAnalysis';

interface Company {
  slug: string;
  name: string;
  url: string;
  simpleIcon: string | null;
}

interface GalleryEntry {
  slug: string;
  name: string;
  url: string;
  simpleIcon: string | null;
  auditedAt: string;
  status: 'ok' | 'error';
  /** True when generated via --mock; used by loadResults to keep mock data off public surfaces. */
  synthetic?: boolean;
  error?: string;
  // Flattened pieces the template needs; keeps pages independent of audit internals.
  readabilityScore?: string;
  totalGaps?: number;
  criticalGaps?: number;
  headline?: {
    category: string;
    severity: string;
    description: string;
    chatgptSays: string | null;
    claudeSays: string | null;
    siteContent: string | null;
  };
  allGaps?: unknown[];
  draftFile?: unknown;
}

function parseArgs() {
  const args = process.argv.slice(2);
  return {
    force: args.includes('--force'),
    mock: args.includes('--mock') || process.env.MOCK_MODE === 'true',
    only: (() => {
      const hit = args.find((a) => a.startsWith('--only='));
      return hit ? hit.slice('--only='.length).split(',') : null;
    })(),
  };
}

async function main() {
  const { force, mock, only } = parseArgs();
  const root = process.cwd();
  const companiesFile = join(root, 'data/gallery/companies.json');
  const resultsDir = join(root, 'data/gallery/results');

  if (!existsSync(resultsDir)) mkdirSync(resultsDir, { recursive: true });

  const { companies } = JSON.parse(readFileSync(companiesFile, 'utf8')) as {
    companies: Company[];
  };

  const targets = only ? companies.filter((c) => only.includes(c.slug)) : companies;

  console.log(
    `Building gallery: ${targets.length} target(s)${mock ? ' (MOCK_MODE)' : ''}${force ? ' (force)' : ''}`
  );

  for (const [i, company] of targets.entries()) {
    const outFile = join(resultsDir, `${company.slug}.json`);
    const marker = `[${i + 1}/${targets.length}] ${company.slug}`;

    if (!force && existsSync(outFile)) {
      console.log(`${marker}  skip (already built — pass --force to re-run)`);
      continue;
    }

    process.stdout.write(`${marker}  auditing ${company.url}… `);
    const startedAt = Date.now();

    const entry: GalleryEntry = {
      slug: company.slug,
      name: company.name,
      url: company.url,
      simpleIcon: company.simpleIcon,
      auditedAt: new Date().toISOString(),
      status: 'error',
      ...(mock ? { synthetic: true } : {}),
    };

    try {
      // In mock mode we bypass runAudit entirely so each company gets a
      // visibly-distinct headline (runAudit's mock returns one canned payload).
      let analysis;
      if (mock) {
        analysis = buildMockAnalysis({
          slug: company.slug,
          name: company.name,
          url: company.url,
        });
      } else {
        const result = await runAudit({ url: company.url, mock: false });
        if (result.verdict === 'no_llms_txt' || !result.analysis) {
          entry.status = 'error';
          entry.error = 'Site has no /llms.txt — skipped audit.';
          console.log('skipped: no llms.txt');
          writeFileSync(outFile, JSON.stringify(entry, null, 2));
          if (!mock && i < targets.length - 1) {
            await new Promise((r) => setTimeout(r, 2000));
          }
          continue;
        }
        analysis = result.analysis;
      }
      const headline =
        analysis.gaps.find((g) => g.category === 'fabrication') ??
        analysis.gaps.find((g) => g.severity === 'critical') ??
        analysis.gaps[0] ??
        null;

      entry.status = 'ok';
      entry.readabilityScore = analysis.summary.readabilityScore;
      entry.totalGaps = analysis.summary.totalGaps;
      entry.criticalGaps = analysis.summary.criticalGaps;
      entry.allGaps = analysis.gaps;
      entry.draftFile = analysis.draftFile ?? null;
      if (headline) {
        entry.headline = {
          category: headline.category,
          severity: headline.severity,
          description: headline.description,
          chatgptSays: headline.evidence?.chatgptSays ?? null,
          claudeSays: headline.evidence?.claudeSays ?? null,
          siteContent: headline.evidence?.siteContent ?? null,
        };
      }

      const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
      console.log(`ok (${elapsed}s, ${entry.totalGaps} gaps)`);
    } catch (err) {
      entry.error = err instanceof Error ? err.message : String(err);
      console.log(`error: ${entry.error}`);
    }

    writeFileSync(outFile, JSON.stringify(entry, null, 2));

    // Pause between runs to be polite to LLM APIs. Skip pause in mock mode
    // and after the last item.
    if (!mock && i < targets.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
