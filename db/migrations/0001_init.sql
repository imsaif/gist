-- Gist: Submit → Track → Improve → Refine loop (MVP)
-- SQLite / libsql flavor (Turso).

create table if not exists users (
  id text primary key,           -- email (normalized, lowercase)
  created_at integer not null default (unixepoch())
);

create table if not exists products (
  id text primary key,           -- uuid v4 generated in app code
  user_id text not null references users(id) on delete cascade,
  name text not null,
  url text not null,
  category_slug text not null,
  mrr_goal_cents integer,
  mrr_current_cents integer,
  created_at integer not null default (unixepoch()),
  archived_at integer
);

create index if not exists products_user_idx on products(user_id);
create index if not exists products_category_idx on products(category_slug) where archived_at is null;

create table if not exists audit_snapshots (
  id text primary key,
  product_id text not null references products(id) on delete cascade,
  run_at integer not null default (unixepoch()),
  readability_score text,
  gaps_json text not null default '[]',
  mention_rate real,
  category_percentile real
);

create index if not exists audit_snapshots_product_idx on audit_snapshots(product_id, run_at desc);

create table if not exists mention_samples (
  id text primary key,
  snapshot_id text not null references audit_snapshots(id) on delete cascade,
  prompt text not null,
  model text not null,
  mentioned integer not null check (mentioned in (0, 1)),
  excerpt text
);

create index if not exists mention_samples_snapshot_idx on mention_samples(snapshot_id);

create table if not exists improvement_actions (
  id text primary key,
  snapshot_id text not null references audit_snapshots(id) on delete cascade,
  title text not null,
  rationale text,
  priority integer not null default 0,
  status text not null default 'open' check (status in ('open', 'done', 'dismissed')),
  created_at integer not null default (unixepoch()),
  resolved_at integer
);

create index if not exists improvement_actions_snapshot_idx on improvement_actions(snapshot_id);
create index if not exists improvement_actions_status_idx on improvement_actions(status);

create table if not exists mrr_checkins (
  id text primary key,
  product_id text not null references products(id) on delete cascade,
  recorded_at integer not null default (unixepoch()),
  mrr_cents integer not null
);

create index if not exists mrr_checkins_product_idx on mrr_checkins(product_id, recorded_at desc);
