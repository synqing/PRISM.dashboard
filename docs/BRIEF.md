## PRISM.dashboard — Project Brief (internal)

> Internal brief — contains product and implementation details for engineers/agents. Not intended for public marketing. See README for tech setup; this brief provides the product, architecture, and execution plan.

---

## BLUF

PRISM.dashboard is our in‑house, “mini‑Jira” planning console powered by Task Master (TM) for plan generation and expansion, with a modern, fast, tech‑polished UI. TM remains the planning/memory kernel (create → analyze → research → expand → dependencies → register). PRISM adds multi‑user UI, search, roles, comments, webhooks, automations, metrics, and a CLI. Structural edits always flow through TM to avoid drift; PRISM mirrors state in Postgres for collaboration.

---

## 1) Why we’re building this

- Consistency over long tasks via TM’s durable briefs (details, testStrategy, subtasks, dependencies).
- Replace docs + ad‑hoc boards with a single cockpit for backlog, PR/design links, automations, and a crisp UI.
- Internal only; no hosted derivative.

Non‑goals (v1): sprints/roadmaps, burndown, multi‑tenant SaaS.

---

## 2) What we’re building (scope)

### Core (v1)

- Issues (Task/Bug/Story) with keys like `CategoryName-###`.
- Board + Table view; right‑side Inspector; TM chain UI (Plan stepper) syncing with TM files.
- Search with JQL‑lite and ⌘K palette.
- Comments, attachments, links, watchers, notifications.
- Automations (Trigger → Conditions → Actions).
- GitHub webhooks + smart‑commit parser.
- Metrics: TTFV, cycle/lead time, PR aging, WIP breaches.

### Core+ (soon)

- CLI (`prism`), pgvector for RAG with citations, “always‑on PM light”.

---

## 3) Product principles

- Plan truth lives in TM; PRISM mirrors. No DB‑only structural edits.
- North–South layout; two‑pane UI with sticky Inspector.
- Delightful, disciplined glass only for overlays; calm motion.
- Performance and a11y are features (virtualization, reduced motion, controls for auto‑updating widgets).

---

## 4) Architecture (high‑level)

```
┌────────────┐   REST/MCP    ┌──────────────┐
│  PRISM UI  │◀────────────▶ │   PRISM API  │──┐
│ (Next.js)  │                │  (Next/Svc)  │  │
└────┬───────┘                └──────┬───────┘  │
     │  Supabase Realtime               │       │
     ▼                                  ▼       │
┌──────────────┐   Mirror/Metadata   ┌──────────┴───────┐
│  Postgres    │◀───────────────────▶│ Task Master MCP  │
│ + pgvector   │   (issues, comments)│ (planning engine)│
└─────┬────────┘                     └──────────┬───────┘
      │  Webhooks (GitHub etc.)                 │
      └─────────────────────────────────────────┘
```

Components: Next.js App Router UI + API routes (Vercel AI SDK), Supabase Postgres + Realtime (+pgvector), TM MCP bridge, GitHub webhooks, OpenTelemetry.

---

## 5) Data model (v1)

SQL DDL for `space`, `issue`, `comment`, `attachment`, `link`, `automation_rule`, `event_log`, optional `document` + `embedding` (pgvector). Keys: `CategoryName-###`.

Templates
- Full schema with indexes and optional FTS/pgvector: `supabase/migrations/0001_init.sql`
- Example environment file: `docs/ENV.example`

---

## 6) Workflows

- PRD → Plan: parse → analyze → expand → validate → generate → sync pull.
- Structural edits must go through TM, then pull.
- “What’s next?” (TM `next`) returns a handoff bundle.
- Smart‑commit linking from GitHub (comments/status transitions).
- Automations: triggers + conditions + actions.

---

## 7) API (REST) — essential routes

Create/read/update issues, comments, attachments, transitions; search (JQL‑lite), sync pull/apply; webhooks and automations endpoints. See `docs/API.md` for concrete request/response examples.

---

## 8) MCP → Task Master (tools we call)

Tools: `parse_prd`, `analyze_complexity`, `expand`, `validate_dependencies`, `generate`, `next`, `set_status`. Server launch guidance and tool whitelisting.

---

## 9) CLI (`prism`) — v1 commands

Plan, issue, link, and sync commands with `--json`, `--dry-run`, `--verbose` flags. See `docs/CLI.md` for usage.

---

## 10) UI/UX spec (condensed)

Shell layout (left rail, top bar, main, sticky Inspector), Overview KPIs, Board/Table, Plan stepper, Inspector tabs, dark theme tokens, motion spec, a11y, performance.

Note on visualization
- Brief references ECharts; current UI demo uses Recharts. Choose one for v1; both can be themed via PRISM tokens. If switching to ECharts, create a thin adapter that maps token colors and typography.

---

## 11) Developer setup (from zero)

Prereqs, monorepo layout (apps/web, apps/cli, packages/*, supabase), environment variables, dev runbook (Supabase start, Next.js/Express dev, TM server, seeding).

Quick start (local):
1. `pnpm install`
2. `cp apps/api/.env.example apps/api/.env`
3. `pnpm migrate && pnpm seed`
4. `pnpm dev:api` (http://localhost:3333)
5. `pnpm dev:web` (http://localhost:3000)
6. `pnpm --filter @prism/cli build` then run CLI commands (`apps/cli/dist/index.js ...` or `npm link` → `prism ...`).

Environment templates
- Copy `docs/ENV.example` into each app/package that needs it and tune per environment. Document required variables near the consuming code.

---

## 12) Testing & acceptance

Unit, integration (TM chain, webhooks), UI perf targets, a11y checks, v1 release criteria.

---

## 13) Risks & mitigations

TM/DB drift, license boundary, webhook misses, low‑end GPU perf, security (RLS, scoped tokens, audit log).

---

## 14) Roadmap

Phase 1 (spine), Phase 2 (fit & finish), Phase 3 (hardening).

---

## 15) Pre‑reading & domain pointers

Task Master docs, WCAG 2.2, Kanban/JQL, dark theme/tonal elevation references.

Additional references
- JQL‑lite mini‑spec and SQL mapping: `docs/JQL.md`
- Workflow specifics and invariants: `docs/WORKFLOWS.md`

---

## 16) Appendices

Figma prompts (UI scaffolding, Color System v1), CSV templates, JQL‑lite grammar subset.

---

## 17) Open questions

Statuses/transition rules, WIP limits, automations for v1, retention policies, brand hexes.

---

### Handoff mantra

Think in plans (TM owns structure). Mirror for collaboration (PRISM stores metadata & UX). Design for speed and legibility (two‑pane, disciplined glass).
