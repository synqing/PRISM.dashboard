export const WORKFLOW_ORDER = [
  "To Do",
  "In Progress",
  "In Review",
  "Blocked",
  "Done",
] as const;
export type Status = typeof WORKFLOW_ORDER[number];

// Client-side optimistic map of allowed transitions.
// Keep consistent with server workflow; DB trigger remains final authority.
export const NEXT_STATES: Readonly<Record<Status, Status[]>> = {
  "To Do": ["In Progress"],
  "In Progress": ["In Review"],
  "In Review": ["Done", "Blocked"],
  "Blocked": ["In Progress"],
  "Done": [],
};

