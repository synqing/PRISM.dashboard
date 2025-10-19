# Smoke Tests

Run these against a local API (`pnpm dev:api`) to verify the stack quickly. Ensure the CLI is built once (`pnpm --filter @prism/cli build`).

```bash
# 1) Health
curl -s http://localhost:3333/health | jq .

# 2) Show seeded issue
PRISM_API=http://localhost:3333 PRISM_TOKEN=devtoken123 \
  node apps/cli/dist/index.js issue:show Helpers-001

# 3) Next ready task (allows 404 if none ready)
PRISM_API=http://localhost:3333 PRISM_TOKEN=devtoken123 \
  node apps/cli/dist/index.js issue:next --category Helpers || true

# 4) Sync TM tasks (example)
cat > /tmp/tasks.json <<'JSON'
{
  "tasks": [
    {
      "key": "MotionVisuals-001",
      "title": "Glint on success",
      "type": "Task",
      "status": "To Do",
      "category": "MotionVisuals",
      "details": "≤280ms single pass",
      "testStrategy": "visual snap test",
      "dependencies": []
    }
  ]
}
JSON
PRISM_API=http://localhost:3333 PRISM_TOKEN=devtoken123 \
  node apps/cli/dist/index.js sync:pull --file /tmp/tasks.json --space k1
```
