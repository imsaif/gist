-- Persistent rate-limit log so limits survive across Vercel instances
-- and cold starts. Replaces the in-memory Map in src/lib/rateLimit.ts.

create table if not exists rate_limit_events (
  scope text not null,        -- e.g. 'audit', 'chat'
  key text not null,          -- IP, user id, etc.
  ts integer not null         -- unix seconds
);

create index if not exists rate_limit_scope_key_ts_idx
  on rate_limit_events(scope, key, ts);
