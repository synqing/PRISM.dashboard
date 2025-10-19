# PRISM.dashboard — JQL‑lite Reference

Grammar (subset)
- Fields: status, assignee, reporter, priority, label, category, text, created, updated
- Operators: =, !=, ~, !~, IN, NOT IN, >, >=, <, <=, IS EMPTY, IS NOT EMPTY
- Logic: AND, OR, NOT, parentheses
- Sort: ORDER BY <field> [ASC|DESC]

Examples
- status IN ("In Progress","Blocked") AND assignee="alice" ORDER BY updated DESC
- text ~ "ghost wire" AND category = Helpers
- priority IN ("P0","P1") AND updated > now() - interval '7 days'
- label IN ("a11y","ux") AND status != "Done"

Mapping to SQL (guidance)
- status/category/assignee/reporter: btree indexes
- labels: GIN array operations (e.g., labels && '{"a11y","ux"}')
- text search: FTS over title/details/test_strategy if enabled
- date comparisons: created_at/updated_at
- ORDER BY updated_at DESC with limit/offset

Notes
- Be strict about quoting for values with spaces.
- Provide helpful parser errors with location and suggestion.

