// Workflow order mirrors DB workflow; adjust if you change migrations.
export const WORKFLOW_ORDER = [
  "To Do",
  "In Progress",
  "In Review",
  "Blocked",
  "Done",
] as const;
export type Status = typeof WORKFLOW_ORDER[number];

// Per-column WIP limits; 0 disables warning.
export const WIP_LIMITS: Partial<Record<Status, number>> = {
  "To Do": 0,
  "In Progress": 6,
  "In Review": 4,
  "Blocked": 3,
  "Done": 0,
};

// Friendly labels + optional descriptions (for headers/tooltips)
export const STATUS_META: Record<Status, { label: string; desc?: string }> = {
  "To Do": { label: "To Do" },
  "In Progress": { label: "In Progress" },
  "In Review": { label: "In Review" },
  "Blocked": { label: "Blocked" },
  "Done": { label: "Done" },
};

