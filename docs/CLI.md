# PRISM.dashboard — CLI (v1) Reference

Install (local dev)
```bash
pnpm --filter @prism/cli build
cd apps/cli && npm link
```

Usage
```bash
prism --help
```

Environment
- `PRISM_API` (default `http://localhost:3333`)
- `PRISM_TOKEN` (bearer token; aligns with `PRISM_API_TOKEN` in API .env)

Commands
```bash
prism plan parse-prd <path|url>
prism plan analyze
prism plan expand [--research]
prism plan validate
prism plan generate

prism issue create|update|show <KEY>
prism issue next [--category <name>]

prism link pr <number> <KEY>

prism sync pull|push
```

Global flags
- --json       Print machine‑readable JSON
- --dry-run    Simulate without changes
- --verbose    Extra logging

Environment
- Reads API base URL and auth token from environment or config file.

Exit codes
- 0 success, non‑zero on errors (validation, network, server, MCP).
