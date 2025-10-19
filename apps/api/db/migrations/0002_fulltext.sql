-- Full-text search for issues: title + details (+ labels as a small boost)
-- Uses the 'english' dictionary. Adjust if your content is multilingual.

-- 1) Add tsvector column
alter table issue add column if not exists issue_fts tsvector;

-- 2) Backfill existing rows (idempotent)
update issue
set issue_fts =
  setweight(to_tsvector('english', coalesce(title,'')), 'A') ||
  setweight(to_tsvector('english', coalesce(details,'')), 'B') ||
  setweight(to_tsvector('english', array_to_string(labels, ' ')), 'C');

-- 3) GIN index on the vector
create index if not exists issue_fts_gin on issue using gin(issue_fts);

-- 4) Keep the vector up-to-date on INSERT/UPDATE
create or replace function issue_fts_update() returns trigger language plpgsql as $$
begin
  new.issue_fts :=
    setweight(to_tsvector('english', coalesce(new.title,'')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.details,'')), 'B') ||
    setweight(to_tsvector('english', array_to_string(new.labels, ' ')), 'C');
  return new;
end $$;

drop trigger if exists trg_issue_fts on issue;
create trigger trg_issue_fts
before insert or update of title, details, labels
on issue
for each row execute function issue_fts_update();

