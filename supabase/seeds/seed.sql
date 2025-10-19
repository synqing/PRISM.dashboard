insert into space(name, slug)
values ('K1', 'k1')
on conflict (slug) do nothing;

with s as (select id from space where slug='k1')
insert into workflow(space_id, from_status, to_status)
select s.id, x.from_status, x.to_status
from s cross join (values
  ('To Do','In Progress'),
  ('In Progress','In Review'),
  ('In Review','Done'),
  ('In Review','Blocked'),
  ('Blocked','In Progress')
) as x(from_status, to_status)
on conflict do nothing;

with s as (select id from space where slug='k1')
insert into issue(key, title, type, status, category, priority, reporter, details, test_strategy, dependencies, space_id)
select * from (values
  ('Helpers-001','Click feedback (press & settle)','Task','To Do','Helpers','P0','system',
   'UI gives crisp press/release feedback within 160–220ms; keyboard activation works.',
   'Unit test focus + keyboard activation; visual regression screenshot after click.',
   '{}'),
  ('Helpers-002','Inverse ports spotlight (compat glow)','Task','To Do','Helpers','P0','system',
   'On port click, only compatible ports glow once ≤240ms; others dim; no loops.',
   'Simulate type matrix; assert correct glow count.',
   array['Helpers-001']),
  ('Helpers-003','Ghost wire + snap + reason-how fixes','Task','To Do','Helpers','P0','system',
   'While dragging, preview route; snap to valid; on invalid drop show cause + one-tap fix.',
   'Drag-drop e2e; invalid connects show actionable chip.',
   array['Helpers-002']),
  ('Onboarding-001','Tutorial: 3-node First-Light','Story','To Do','Onboarding','P0','system',
   'First run shows Gradient, Reactive Noise, K1 Output. TTFV median≤60s.',
   'Telemetry hooks: timing, attempts per connect.',
   '{}'),
  ('Accessibility-001','Prefers-reduced-motion support','Task','In Progress','Accessibility','P0','system',
   'Disable decorative motion; preserve feedback via color/tonal elevation.',
   'Snapshot diff with PRM on/off.',
   '{}')
) v(key,title,type,status,category,priority,reporter,details,test_strategy,dependencies),
   s(id);

with i as (select id from issue where key='Helpers-003')
insert into link(issue_id, type, target_url)
select id, 'pr', 'https://github.com/example/repo/pull/123' from i
on conflict do nothing;

with i as (select id from issue where key='Onboarding-001')
insert into comment(issue_id, author, body)
select id, 'captain', 'Target TTFV ≤ 60s; avoid rainbow/solids' from i
on conflict do nothing;
