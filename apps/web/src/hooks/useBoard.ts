import { useEffect, useMemo, useState, useCallback } from "react";
import { listIssues, transitionIssue, type Issue } from "../lib/api";
import { WORKFLOW_ORDER, WIP_LIMITS, type Status } from "../config/board";
import { NEXT_STATES } from "../config/workflow";


export type BoardColumn = {
  status: Status;
  items: Issue[];
  wipLimit: number;
  count: number;
  breached: boolean;
};

export function useBoard(filters?: { category?: string; assignee?: string }) {
  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const build = useCallback((items: Issue[]) => {
    const bucket = new Map<Status, Issue[]>();
    WORKFLOW_ORDER.forEach((s) => bucket.set(s, []));
    for (const it of items) {
      const s = it.status as Status;
      if (bucket.has(s)) bucket.get(s)!.push(it);
    }
    return WORKFLOW_ORDER.map((s) => {
      const arr = bucket.get(s)!;
      const lim = WIP_LIMITS[s] ?? 0;
      return {
        status: s,
        items: arr,
        wipLimit: lim,
        count: arr.length,
        breached: lim > 0 && arr.length > lim,
      } as BoardColumn;
    });
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listIssues({
        status: [...WORKFLOW_ORDER],
        limit: 500,
        category: filters?.category ? filters.category.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
        assignee: filters?.assignee,
      });
      setColumns(build(res.items));
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [build, filters?.category, filters?.assignee]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const transition = useCallback(async (issue: Issue, to: Status) => {
    const current = issue.status as Status;
    const legal = NEXT_STATES[current]?.includes(to);
    if (!legal) throw new Error(`Illegal transition: ${current} -> ${to}`);

    const before = columns;
    // optimistic columns update
    const optimistic = before.map((col) => {
      if (col.status === current) {
        const nextCount = col.count - 1;
        return {
          ...col,
          items: col.items.filter((i) => i.id === undefined || i.id !== issue.id),
          count: nextCount,
          breached: (col.wipLimit ?? 0) > 0 && nextCount > (col.wipLimit ?? 0),
        };
      }
      if (col.status === to) {
        const nextCount = col.count + 1;
        return {
          ...col,
          items: [issue, ...col.items],
          count: nextCount,
          breached: (col.wipLimit ?? 0) > 0 && nextCount > (col.wipLimit ?? 0),
        };
      }
      return col;
    });
    setColumns(optimistic);

    try {
      const updated = await transitionIssue(issue.key, to);
      // Replace the issue in its new column with server-updated copy
      const finalCols = optimistic.map((col) => {
        if (col.status === to) {
          return {
            ...col,
            items: col.items.map((i) => (i.id === issue.id ? updated : i)),
          };
        }
        return col;
      });
      setColumns(finalCols);
    } catch (e) {
      // revert
      setColumns(before);
      throw e;
    }
  }, [columns]);

  const totals = useMemo(
    () => ({
      total: columns.reduce((n, c) => n + c.count, 0),
      inProgress: columns.find((c) => c.status === "In Progress")?.count ?? 0,
    }),
    [columns],
  );

  return { columns, loading, error, refresh, totals, transition };
}

export function findIssue(columns: BoardColumn[], id: string) {
  for (const col of columns) {
    const found = col.items.find((i: any) => i.id === id || i.key === id);
    if (found) return { issue: found, from: col.status as Status };
  }
  return null;
}
