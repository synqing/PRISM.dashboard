create table if not exists space_config (
  space_id uuid primary key references space(id) on delete cascade,
  wip_limits jsonb not null default '{}'::jsonb
);

with s as (select id from space where slug='k1')
insert into space_config(space_id, wip_limits)
select id, '{"To Do":0,"In Progress":6,"In Review":4,"Blocked":3,"Done":0}'::jsonb from s
on conflict (space_id) do nothing;
