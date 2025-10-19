# Environment Variables

Copy the snippets below into the appropriate `.env` files.

## API (`apps/api/.env`)

```
PORT=3333
PRISM_API_TOKEN=devtoken123
DATABASE_URL=postgres://postgres:postgres@localhost:5432/prism
CORS_ORIGIN=*
```

## CLI (shell env or `.env` in repo root)

```
PRISM_API=http://localhost:3333
PRISM_TOKEN=devtoken123
```

## Future (Supabase + Task Master)

```
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
TASK_MASTER_TOOLS=standard
TASK_MASTER_DIR=/absolute/path/to/plans
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
PERPLEXITY_API_KEY=
OTEL_SERVICE_NAME=prism-web
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```
