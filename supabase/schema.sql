-- PRISM.dashboard — Postgres schema (v1)
-- Requires: pgcrypto (for gen_random_uuid), pgvector (optional)

create extension if not exists pgcrypto;
-- create extension if not exists vector; -- enable if using embeddings

-- 1) Spaces / projects
create table if not exists space (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

-- 2) Issues (mirrored from TM)
create type issue_type as enum ('Task','Bug','Story');
create table if not exists issue (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  title text not null,
  type issue_type not null,
  status text not null,
  category text not null,
  priority text default 'P1',
  assignee text,
  reporter text,
  labels text[] default '{}',
  details text,
  test_strategy text,
  dependencies text[] default '{}',
  space_id uuid not null references space(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_issue_space on issue(space_id);
create index if not exists idx_issue_status on issue(status);
create index if not exists idx_issue_category on issue(category);
create index if not exists idx_issue_updated on issue(updated_at desc);
create index if not exists idx_issue_labels on issue using gin(labels);

-- optional full text search
-- alter table issue add column if not exists tsv tsvector;
-- create index if not exists idx_issue_tsv on issue using gin(tsv);
-- create or replace function issue_tsv_refresh() returns trigger as $$
-- begin
--   new.tsv := setweight(to_tsvector('simple', coalesce(new.title,'')), 'A') ||
--              setweight(to_tsvector('simple', coalesce(new.details,'')), 'B') ||
--              setweight(to_tsvector('simple', coalesce(new.test_strategy,'')), 'C');
--   return new;
-- end; $$ language plpgsql;
-- create trigger trg_issue_tsv before insert or update on issue
-- for each row execute function issue_tsv_refresh();

-- 3) Comments
create table if not exists comment (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references issue(id) on delete cascade,
  author text not null,
  body text not null,
  created_at timestamptz default now()
);
create index if not exists idx_comment_issue on comment(issue_id);

-- 4) Attachments
create table if not exists attachment (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references issue(id) on delete cascade,
  name text,
  url text,
  mime text,
  size_bytes int
);
create index if not exists idx_attachment_issue on attachment(issue_id);

-- 5) Links (issue relations)
create table if not exists link (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references issue(id) on delete cascade,
  type text,
  target_key text
);
create index if not exists idx_link_issue on link(issue_id);

-- 6) Automation Rules
create table if not exists automation_rule (
  id uuid primary key default gen_random_uuid(),
  space_id uuid not null references space(id) on delete cascade,
  enabled boolean default true,
  trigger jsonb not null,
  conditions jsonb not null,
  actions jsonb not null
);
create index if not exists idx_automation_space on automation_rule(space_id);
create index if not exists idx_automation_trigger on automation_rule using gin(trigger);
create index if not exists idx_automation_conditions on automation_rule using gin(conditions);

-- 7) Event Log (auditing)
create table if not exists event_log (
  id bigserial primary key,
  source text,
  name text,
  payload jsonb,
  created_at timestamptz default now()
);
create index if not exists idx_event_created on event_log(created_at desc);

-- 8) RAG Documents (optional)
create table if not exists document (
  id uuid primary key default gen_random_uuid(),
  space_id uuid references space(id) on delete cascade,
  title text,
  url text,
  body text
);
create index if not exists idx_document_space on document(space_id);

-- 9) Embeddings (optional; requires pgvector)
-- create table if not exists embedding (
--   id uuid primary key default gen_random_uuid(),
--   document_id uuid references document(id) on delete cascade,
--   chunk_index int,
--   vec vector(1536)
-- );
-- create index if not exists idx_embedding_doc on embedding(document_id);
-- create index if not exists idx_embedding_vec on embedding using ivfflat (vec vector_cosine_ops);

-- Row Level Security (example policies — adapt to your auth model)
-- alter table space enable row level security;
-- alter table issue enable row level security;
-- alter table comment enable row level security;
-- alter table attachment enable row level security;
-- alter table link enable row level security;
-- alter table automation_rule enable row level security;
-- alter table document enable row level security;
-- create policy space_read on space for select using (true);
-- create policy issue_read on issue for select using (true);
-- create policy issue_write on issue for insert with check (true);
-- create policy issue_update on issue for update using (true) with check (true);

