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
  - body: { status }
  - response: updated issue (server enforces workflow)

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

