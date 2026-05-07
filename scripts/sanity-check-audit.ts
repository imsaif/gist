// One-off sanity check for the llms.txt-gated audit flow.
// Run with: node --env-file-if-exists=.env.local --import tsx scripts/sanity-check-audit.ts
//
// Tests two scenarios:
//   1. example.com — no /llms.txt → expect verdict: 'no_llms_txt', zero LLM calls
//   2. vercel.com — has /llms.txt → expect verdict: 'audited', full pipeline

import { runAudit } from '../src/lib/audit/runAudit';

async function check(label: string, url: string, name: string, description: string) {
  console.log(`\n=== ${label}: ${url} ===`);
  const events: string[] = [];
  const start = Date.now();
  const result = await runAudit({
    url,
    name,
    description,
    onEvent: (e) => events.push(e.type),
  });
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log(`Elapsed: ${elapsed}s`);
  console.log(`Events: ${events.join(' → ')}`);
  console.log(`Verdict: ${result.verdict}`);
  if (result.llmsTxtUrl) console.log(`llms.txt URL: ${result.llmsTxtUrl}`);
  if (result.siteContent) {
    console.log(`Content bytes: ${result.siteContent.contentLength}`);
  }
  if (result.analysis) {
    console.log(
      `Gaps: ${result.analysis.gaps.length} (${result.analysis.summary.criticalGaps} critical)`
    );
    console.log(`Readability: ${result.analysis.summary.readabilityScore}`);
    for (const g of result.analysis.gaps) {
      console.log(`  - [${g.severity}/${g.category}] ${g.description}`);
    }
  }
}

async function main() {
  await check('No llms.txt', 'https://example.com', 'Example', 'A documentation example domain.');
  await check(
    'Has llms.txt',
    'https://vercel.com',
    'Vercel',
    'Frontend cloud platform for deploying web apps.'
  );
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
