# PRISM.dashboard — Workflows

## PRD → Plan (TM chain)
1) parse_prd → initial task set
2) analyze_complexity → scores
3) expand [--research] → subtasks with details/testStrategy
4) validate_dependencies → fix ordering
5) generate → write task files
6) sync pull → mirror issues into DB

Invariants
- Structural edits always: UI → API → TM tool → pull. No DB‑only structural edits.
- Conflicts resolved by pulling after apply and retrying with fresh state.

## Smart‑Commit Linking
- Parse keys from PR/commit titles/bodies
  - KEY #comment <text>
  - KEY #status <StatusName>

## Automations
- Trigger → Conditions → Actions
- Example: on {pr_merged:true} AND {allLinked:true} → transition('Done')

