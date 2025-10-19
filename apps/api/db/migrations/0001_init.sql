-- PRISM.dashboard schema (Postgres 14+). Designed for Supabase or vanilla.
-- Idempotent-ish; run with psql or your migration tool.

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create table if not exists space (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

create table if not exists status_dict(
  name text primary key
);
insert into status_dict(name) values
 ('To Do'), ('In Progress'), ('In Review'), ('Blocked'), ('Done')
on conflict do nothing;

create table if not exists issue (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  title text not null,
  type text not null check (type in ('Task','Bug','Story')),
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists issue_space_idx on issue(space_id);
create index if not exists issue_status_idx on issue(status);
create index if not exists issue_category_idx on issue(category);
create index if not exists issue_updated_idx on issue(updated_at desc);
create index if not exists issue_labels_gin on issue using gin(labels);

create trigger issue_set_updated
before update on issue
for each row execute function set_updated_at();

create table if not exists comment (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references issue(id) on delete cascade,
  author text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists comment_issue_idx on comment(issue_id);

create table if not exists attachment (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references issue(id) on delete cascade,
  name text not null,
  url text not null,
  mime text,
  size_bytes int
);
create index if not exists attachment_issue_idx on attachment(issue_id);

create table if not exists link (
  id uuid primary key default gen_random_uuid(),
  issue_id uuid not null references issue(id) on delete cascade,
  type text not null,
  target_key text,
  target_url text,
  created_at timestamptz default now()
);
create index if not exists link_issue_idx on link(issue_id);

create table if not exists workflow (
  id bigserial primary key,
  space_id uuid not null references space(id) on delete cascade,
  from_status text not null,
  to_status text not null,
  unique(space_id, from_status, to_status)
);

create or replace function enforce_workflow()
returns trigger language plpgsql as $$
declare ok int;
begin
  if (tg_op = 'UPDATE' and NEW.status is distinct from OLD.status) then
    select count(*) into ok from workflow
     where space_id = NEW.space_id
       and from_status = OLD.status
       and to_status   = NEW.status;
    if ok = 0 then
      raise exception 'Illegal status transition: % -> % for space %', OLD.status, NEW.status, NEW.space_id;
    end if;
  end if;
  return NEW;
end $$;

drop trigger if exists issue_enforce_workflow on issue;
create trigger issue_enforce_workflow
before update on issue
for each row execute function enforce_workflow();

create table if not exists event_log (
  id bigserial primary key,
  source text not null,
  name text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists event_log_created_idx on event_log(created_at desc);
