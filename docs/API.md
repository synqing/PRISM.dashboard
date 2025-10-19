# PRISM.dashboard — API Guide (v1)

This document defines the essential REST endpoints, request/response shapes, and notes that align with the internal brief. Routes assume a Next.js App Router (route handlers) or equivalent.

Conventions
- Authentication: bearer token (Supabase Auth or custom JWT).
- Content-Type: application/json
- IDs: either `id` (UUID) or `key` (e.g., `Helpers-003`).

Issues
- POST /api/issues
  - body: { title, type: 'Task'|'Bug'|'Story', category, priority?, assignee?, reporter?, labels?[], details?, testStrategy?, dependencies?[] }
  - response: { id, key, ...issue }

- GET /api/issues/{id|key}
  - response: { id, key, title, type, status, category, ... }

- PATCH /api/issues/{id|key}
  - body: partial metadata fields (no structural changes)
  - response: updated issue

- POST /api/issues/{key}/comment
  - body: { author, body }
  - response: { id, issue_id, author, body, created_at }

- POST /api/issues/{key}/attach
  - body: { name, url, mime, size_bytes }
  - response: attachment

- POST /api/issues/{key}/transition
  - body: { to: "In Progress" }
  - response: updated issue (server enforces workflow)

- GET /api/issues/next/by-category/{name}
  - query: category name (path param)
  - response: next "To Do" issue whose dependencies are all `Done`

Search
- POST /api/search
  - body: { q: string, limit?: number, offset?: number }
  - response: { results: Issue[], total: number }
  - JQL-lite examples:
    - status IN ("In Progress","Blocked") AND assignee="alice" ORDER BY updated DESC
    - text ~ "ghost wire" AND category = Helpers

TM Sync
- POST /api/sync/pull      // TM → DB mirror
- POST /api/sync/apply     // UI action → TM tool → pull

Webhooks
- POST /api/webhooks/github
  - Verifies signature; parses PR/commit bodies for keys and commands:
    - KEY #comment <txt>
    - KEY #status <StatusName>

Automations
- POST /api/automations/execute
  - body: { ruleId, payload }
  - response: { ok: boolean, logId }

Errors
- Standard JSON: { error: { code, message, details? } }
- Use 4xx for client mistakes (invalid transition, unknown key); 5xx for server failures.
# PRISM.dashboard — API Guide (v1)
List Issues
- GET /api/issues
  - Query params:
    - status: CSV of statuses (e.g., To Do,In Progress)
    - category: CSV of categories
    - assignee: exact match
    - labels: CSV of labels; matches any overlap
    - q: substring match on title/details (ILIKE)
    - limit: 1–200 (default 50)
    - cursor: base64url(JSON{"updated_at","id"}) from previous response
  - Sort: updated_at desc, id desc (keyset pagination)
  - Response: { items: Issue[], count: number, nextCursor: string|null }
  - Headers: X-Next-Cursor mirrors nextCursor when present
