import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@libsql/client';

async function main() {
  const url = process.env.DATABASE_URL || 'file:./local.db';
  const authToken = process.env.DATABASE_AUTH_TOKEN;
  const client = createClient({ url, authToken });

  const dir = join(process.cwd(), 'db/migrations');
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const sql = readFileSync(join(dir, file), 'utf8');
    const stripped = sql
      .split('\n')
      .filter((line) => !line.trim().startsWith('--'))
      .join('\n');
    const statements = stripped
      .split(/;\s*$/m)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    console.log(`> ${file} (${statements.length} statements)`);
    for (const stmt of statements) {
      await client.execute(stmt);
    }
  }
  console.log('Migrations applied.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
