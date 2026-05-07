// Runs DB migrations as part of the Vercel build, but only on production
// deploys — preview builds skip so PR pushes don't hammer the prod DB.
// Local builds (where VERCEL_ENV is undefined) run migrations against
// whatever DATABASE_URL is set, falling back to the local file:./local.db.

import { spawnSync } from 'node:child_process';

const env = process.env.VERCEL_ENV;

if (env && env !== 'production') {
  console.log(`[migrate-on-deploy] VERCEL_ENV=${env} — skipping migrations.`);
  process.exit(0);
}

console.log(`[migrate-on-deploy] VERCEL_ENV=${env ?? '(unset)'} — running migrations.`);

const result = spawnSync(
  'node',
  ['--env-file-if-exists=.env.local', '--import', 'tsx', 'scripts/migrate.ts'],
  { stdio: 'inherit', env: process.env }
);

process.exit(result.status ?? 1);
