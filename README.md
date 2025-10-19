
<div align="center">

# PRISM Dashboard UI

High‑fidelity React 18 dashboard implementing the PRISM design system with Tailwind v4, Radix UI primitives, and a production‑oriented theming model. Includes feature modules, visualization stack, and accessibility‑first defaults.

![Tech](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss)
![Radix UI](https://img.shields.io/badge/Radix%20UI-1.1-black)

</div>

  ## Table of Contents

  - Overview
  - Feature Highlights
  - Tech Stack
  - Architecture
  - Theming Strategy
  - Component Catalog
  - Visualization Stack
  - Setup
  - Build & Deploy
  - Project Structure
  - Local API & CLI
  - Internal Brief Overview
  - Domain Glossary
  - Coding Standards
  - Extension Guide
  - Data Integration Plan
  - Performance & Bundling
  - Accessibility
  - Browser Support
  - Smoke Tests
  - Troubleshooting
  - Onwards Research
  - Roadmap
  - Keyboard Shortcuts
  - Credits

## Overview

This repository recreates the PRISM Dashboard UI (Figma source: https://www.figma.com/design/ZNRC96bAw6M2Xo7TvluNxo/PRISM-Dashboard-UI-Design) as a code-first, documented baseline. It emphasizes design tokens, accessible primitives, and modular views so engineers can extend with real data quickly.

Assumptions and scope:
- Single-package Vite app optimized for static hosting (no SSR/routing library; views are conditionally rendered).
- TypeScript usage is idiomatic; ESLint/Prettier not yet configured (see Roadmap).
- No backend or network fetches; demo data is colocated for determinism and quick iteration.

## Feature Highlights

- Design System view demonstrating tokens, surfaces, typography, glass overlays, and chart palettes.
- Overview analytics with KPI grid, bar/line trends, and exception feed.
- Board and Table views for planning and analysis workflows.
- Inspector panel and Search/Command Palette (⌘/Ctrl + K).
- Automations builder and rich Empty States for UX clarity.

## Tech Stack

- React 18.3 + TypeScript
- Vite 6 with `@vitejs/plugin-react-swc` (SWC transforms) for fast HMR and esbuild pre-bundling
- Tailwind CSS v4 reset/utilities (`apps/web/src/index.css`) and PRISM tokens (`apps/web/src/styles/globals.css`)
- Radix UI headless primitives wrapped under `apps/web/src/components/ui/*`
- Recharts (2.x) for charting; Embla Carousel (8.x) for galleries
- `lucide-react` for icons; `cmdk` for the command palette
- Node 18+ recommended (Node 20 LTS supported)

## Architecture

- App Shell (`apps/web/src/App.tsx`):
  - Layout: two‑pane with left navigation and content area.
  - View switching: union type `View` controls which feature module renders.
  - UI toggles: glass effects toggle, palette visibility (⌘/Ctrl+K).
  - No router or global store; keeps demo deterministic and lightweight.
- Feature Modules (`apps/web/src/components/*.tsx`):
  - Each module owns layout, demo data, and interactions (e.g., `Overview.tsx` defines KPI arrays and chart configs).
  - No cross‑module coupling; data is colocated to encourage modularization.
- UI Primitives (`apps/web/src/components/ui/*`):
  - Thin wrappers around Radix primitives unify tokens, classNames, and accessible defaults.
  - Utilities: `tailwind-merge` for class de‑duplication; `class-variance-authority` for variant APIs.
- Styling (`apps/web/src/index.css`, `apps/web/src/styles/globals.css`):
  - Tailwind v4 reset and utilities; design tokens exported as CSS variables and mapped into Tailwind via `@theme inline`.
  - Scrollbars, reduced‑motion, and global typography live in `globals.css`.
- Build & Dev Config (`vite.config.ts`):
  - React SWC plugin, `target: 'esnext'`, `outDir: 'build'`, dev `server.port: 3000` with `open: true`.
  - Aliases pin popular packages to specific versions to avoid import mismatches.

```
[App Shell]
   ├─ union View type + state toggles
   └─ renders one [Feature Module]
        ├─ consumes [UI Primitives]
        └─ themed by [PRISM Tokens]
```

## Theming Strategy

Design tokens in `apps/web/src/styles/globals.css` serve as the single source of truth and are consumed both via Tailwind utilities and directly as CSS variables.

Core token groups:
- Surfaces: `--surface-0 … --surface-3` + `--overlay-scrim`
- Text: `--text-high`, `--text-med`, `--text-subtle`
- Brand/Accents: `--brand-cyan`, `--brand-violet`, `--accent-*`
- Strokes/Focus: `--stroke-low/med/high`, `--focus-ring`
- Glass: `--glass-bg`, `--glass-stroke`
- Charts: Okabe–Ito palette (`--chart-okabe-1 … 8`)
- Typography: scale (`--text-display … --text-micro`) and weights

Example (excerpt):

```css
:root {
  --surface-0: #0B0D12;
  --surface-1: #121826;
  --text-high: rgba(255,255,255,0.92);
  --brand-cyan: #6EE7F3;
  --focus-ring: #A7E9EF;
}
```

## Component Catalog

Radix‑based primitives live under `apps/web/src/components/ui/` and are themed with PRISM classes/variables.

- Overlay: `dialog`, `drawer`, `sheet`, `tooltip`, `popover`, `hover-card`, `alert-dialog`
- Navigation: `navigation-menu`, `menubar`, `sidebar`, `breadcrumb`, `tabs`
- Inputs & Forms: `input`, `textarea`, `checkbox`, `radio-group`, `select`, `slider`, `switch`, `input-otp`, `label`, `form`
- Data Display: `table`, `card`, `badge`, `progress`, `skeleton`, `separator`, `pagination`
- Layout & Behavior: `accordion`, `collapsible`, `resizable`, `scroll-area`, `aspect-ratio`, `avatar`
- Command: `command` (cmdk-powered palette)

## Visualization Stack

- Recharts in `Overview.tsx` (`ResponsiveContainer`, `BarChart`, `LineChart`, `Bar`, `Line`), with axes and colors sourced from tokens.
- Embla Carousel powers gallery‑style content where applicable.

## Setup

Requirements:
- Node 18+ (Node 20 LTS supported)
- pnpm 9+

Commands (run from repo root):
```bash
pnpm install
cp apps/api/.env.example apps/api/.env
pnpm migrate && pnpm seed
pnpm dev:api        # http://localhost:3333
pnpm dev:web        # http://localhost:3000
```

Build the CLI once (`pnpm --filter @prism/cli build`) if you want local binaries (see Local API & CLI below). Use ⌘/Ctrl + K in the web app to open the command palette; toggle “Glass Effects” in the left rail to compare overlay variants.

Web → API configuration
- Set `VITE_API_BASE` in a Vite env file (e.g., `apps/web/.env`) or your shell to point the UI at a different API origin.
- Example: `VITE_API_BASE=http://localhost:3333` (default if unset).

## Build & Deploy

```bash
pnpm --filter @prism/web build
```

- Output directory: `apps/web/build/` (configured in `apps/web/vite.config.ts`).
- Target: modern evergreen browsers (`esnext`).
- Hosting: Any static host/CDN (Netlify, Vercel, S3/CloudFront, Cloudflare Pages). Configure base path if served under a subpath.

## Project Structure

```
.
├── apps
│   ├── api/              # Express API service (issues, search, sync, webhooks)
│   ├── cli/              # Commander-based CLI that talks to the API
│   └── web/              # React UI showcase (Vite)
├── docs/                 # README companions (brief, env, api, smoke, etc.)
├── packages
│   ├── types/            # Shared Zod schemas + TypeScript types
│   └── ui/               # Reserved for shared UI primitives
├── scripts/              # Smoke test runner(s)
├── supabase/
│   ├── migrations/0001_init.sql
│   └── seeds/seed.sql
├── package.json          # pnpm workspace root
├── tsconfig.base.json
└── README.md
```

Notes:
- `apps/web` retains the design-system showcase. Migrate to Next.js App Router when ready.
- `packages/ui` is a placeholder for shared components once the monorepo converges.

## Local API & CLI

- Configure environment variables (see `docs/ENV.md`).
- Apply schema + seeds: `pnpm migrate && pnpm seed` (uses `apps/api/db/*`).
- Run the API: `pnpm dev:api` → http://localhost:3333 (`/health`, `/api/issues/...`).
- Build the CLI: `pnpm --filter @prism/cli build`.
- Ad-hoc commands:
  - `PRISM_API=http://localhost:3333 PRISM_TOKEN=devtoken123 node apps/cli/dist/index.js issue:show Helpers-001`
  - `prism issue:create ...` (after `npm link` inside `apps/cli` if you want the binary on PATH).
- Run the smoke script (`pnpm smoke`) or copy/paste commands from `docs/SMOKE.md` to validate wiring end-to-end.

## Internal Brief Overview

This repository includes a comprehensive internal product/architecture brief at `docs/BRIEF.md`. It is intended to give engineers and coding agents everything needed to plan, build, and ship the full PRISM.dashboard system beyond this UI showcase.

What the brief covers:
- BLUF: What PRISM.dashboard is and the role of Task Master (TM)
- Why: Motivation and non‑goals for v1
- Scope: Core features for v1 and near‑term Core+
- Product Principles: Source of truth, layout philosophy, glass/motion discipline, performance/a11y stance
- Architecture: Next.js UI+API, Supabase Postgres (+Realtime, +pgvector), MCP bridge to TM, GitHub webhooks, OpenTelemetry
- Data Model: SQL DDL for issues, comments, attachments, links, automations, events, documents, embeddings
- Workflows: PRD→Plan chain, structural edit rules (always via TM), smart‑commit linking, automations
- API: Essential REST routes and a JQL‑lite query model with examples
- MCP Tools: The exact tools invoked on TM and server launch guidance
- CLI: `prism` commands with common flags
- UI/UX Spec: Shell, Overview KPIs, Board/Table, Plan stepper, Inspector tabs, dark theme, motion, a11y, performance
- Developer Setup: Monorepo layout, env vars, Supabase, dev runbook
- Testing & Acceptance: Unit/integration/a11y/perf criteria and v1 release checklist
- Risks & Mitigations: Drift, webhooks, perf, security
- Roadmap: Phase 1 (spine), Phase 2 (fit & finish), Phase 3 (hardening)
- Pre‑reading & Appendices: Figma prompts, CSV templates, JQL grammar
- Open Questions: Status/workflow, WIP, automations, retention, brand hexes

Target architecture vs current repo:
- Target (brief): Next.js App Router with API routes, Supabase Postgres (+Realtime, +pgvector), TM MCP bridge, GitHub webhooks, OTel.
- Current (this repo): Vite + React 18 UI showcase with Tailwind v4 tokens, Radix wrappers, demo views and charts.
- Migration strategy is outlined in README sections (Architecture, Extension Guide, Data Integration Plan) and elaborated in `docs/BRIEF.md`.

Templates and deeper references:
- Environment template: `docs/ENV.example`
- Environment walkthrough: `docs/ENV.md`
- Database schema (DDL, indexes, workflow trigger): `supabase/migrations/0001_init.sql`
- REST API shapes and examples: `docs/API.md`
- JQL‑lite mini‑spec: `docs/JQL.md`
- Workflow details and invariants: `docs/WORKFLOWS.md`

Link: See the full brief in `docs/BRIEF.md`.

Notes:
- `apps/web/src/components/ui/*` is the integration surface for Radix—extend or theme here before feature modules.
- `apps/web/src/components/figma/*` contains small helpers used to mirror Figma semantics during asset loading.

## Domain Glossary

- TTFV (Time To First Value): Time from user entry to perceiving delivered value; proxy for UX latency.
- Cycle Time: Average time from work start to completion; indicates throughput.
- Lead Time: Time from ideation to delivery; spans backlog → shipped.
- PR Aging: Count of open PRs exceeding a time threshold (e.g., 48h).
- WIP Breach: Number of active items above WIP limit; signals process contention.
- Error Budget: Remaining allowable error rate before SLO breach.

The demo values live in `apps/web/src/components/Overview.tsx` for consistent UI behavior.

## Coding Standards

- TypeScript: prefer explicit props and discriminated unions for variants.
- Styling: prefer semantic utilities (`bg-surface-2`, `text-text-med`); use inline CSS vars for specific token use.
- Components: keep presentational and data concerns colocated within each feature module for this demo; extract to shared hooks when integrating real data.
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`) to enable changelog automation later.

## Extension Guide

Add a new view:
1. Create `src/components/MyView.tsx` and implement UI.
2. Extend the `View` union in `src/App.tsx` and add a `NavItem` entry.
3. Optionally add a command in the command palette for quick access.

Add a new Radix primitive wrapper:
1. Start from a similar adapter in `src/components/ui/` (e.g., `dialog.tsx`).
2. Expose variants with `class-variance-authority` and theme with PRISM tokens.
3. Validate focus ring, reduced‑motion behavior, and ARIA props.

Token changes:
1. Update variables in `src/styles/globals.css`.
2. If exposing as utilities, mirror in the `@theme inline` mapping.

## Data Integration Plan

- Query Layer: Introduce TanStack Query for fetch lifecycles, caching, and retry/backoff. Keep view modules declarative and fetch data in boundaries/hooks.
- Types: Define API contracts via zod or OpenAPI codegen to preserve type safety.
- Loading States: Use skeletons and progress from `ui/` primitives; avoid layout shift.
- Virtualization: Adopt `@tanstack/react-virtual` for large tables/boards.
- Errors: Centralize toasts (sonner) and status banners; map HTTP errors to clear UX language.

## Performance & Bundling

- Bundles: Code‑split heavy views if they become data‑rich (dynamic `import()` per view).
- Images: Prefer vector or tiny thumbnails; lazy‑load non‑critical imagery.
- Effects: Glass blur is restricted to overlays; avoid on large canvases.
- Recharts: Limit tick counts and point density; memoize datasets and components.
- Vite: Inspect bundle using a visualizer (optional) and keep `esnext` targets for modern browsers.

## Accessibility

- Color: WCAG AA contrast on dark surfaces; focus rings via `--focus-ring` maintain visibility.
- Interaction: Radix primitives ensure keyboard operability, ARIA roles, focus trapping, and dismiss patterns.
- Motion: `prefers-reduced-motion` disables non‑essential animation; glass overlays fall back to matte when needed.
- Semantics: Headings/labels present; legible scales for tables and charts; descriptive copy near charts.

## Browser Support

- Target: evergreen browsers (Chromium, Firefox, Safari) with ESNext features.
- For legacy support later, reduce `build.target` and add polyfills.

## Smoke Tests

- Quick check: `pnpm smoke` (runs `scripts/smoke.cjs`; expects API running on http://localhost:3333 and CLI build output).
- Manual commands and examples live in `docs/SMOKE.md`.

## Troubleshooting

- Blank page after start: ensure Node ≥ 18 and a clean install (`rm -rf node_modules && pnpm install`).
- Port conflict: web dev server runs on `3000`; change `server.port` in `apps/web/vite.config.ts` if needed.
- Styles unthemed: confirm `apps/web/src/styles/globals.css` is imported and variables resolve; check class collisions.

## Onwards Research

- React 18 concurrent rendering and transitions
- Tailwind CSS v4 `@layer` + `@theme inline`
- Radix UI accessibility patterns and anatomy
- Recharts customization and accessibility considerations
- Okabe–Ito color‑blind safe palette
- WAI‑ARIA Authoring Practices, WCAG 2.2 quick reference

## Roadmap

- Tooling: add ESLint + Prettier + TypeScript strict config; Husky pre‑commit hooks.
- Testing: Vitest + React Testing Library; optional visual regression with Storybook + Chromatic.
- Data: integrate TanStack Query and API typing (zod/OpenAPI).
- Performance: code‑split data‑heavy views; consider router once navigation grows.
- CI/CD: GitHub Actions to run install/build/lint/test and publish previews.

## Keyboard Shortcuts

- ⌘/Ctrl + K — Open command palette

## Credits

- Design reference: PRISM Dashboard UI (Figma)
- Icons: `lucide-react`
- Charts: `recharts`
- Carousel: `embla-carousel-react`
- Command Palette: `cmdk`

—

This codebase captures the visual + interaction spec as maintainable React components, ready to plug into real data and application logic.
  
