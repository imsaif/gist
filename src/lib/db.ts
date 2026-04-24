import { createClient, type Client } from '@libsql/client';

let _client: Client | null = null;

export function db(): Client {
  if (_client) return _client;
  const url = process.env.DATABASE_URL || 'file:./local.db';
  const authToken = process.env.DATABASE_AUTH_TOKEN;
  _client = createClient({ url, authToken });
  return _client;
}

export function uuid(): string {
  return crypto.randomUUID();
}
