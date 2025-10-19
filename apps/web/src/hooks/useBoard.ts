import { useEffect, useMemo, useState, useCallback } from "react";
import { listIssues } from "../lib/api";
import { WORKFLOW_ORDER, WIP_LIMITS, type Status } from "../config/board";

export type Issue = any;

export type BoardColumn = {
  status: Status;
  items: Issue[];
  wipLimit: number;
  count: number;
  breached: boolean;
};

export function useBoard() {
  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listIssues({ status: [...WORKFLOW_ORDER], limit: 500 });
      const bucket = new Map<Status, Issue[]>();
      WORKFLOW_ORDER.forEach((s) => bucket.set(s, []));
      for (const it of res.items) {
        const s = it.status as Status;
        if (bucket.has(s)) bucket.get(s)!.push(it);
      }
      const cols = WORKFLOW_ORDER.map((s) => {
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
      setColumns(cols);
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const totals = useMemo(
    () => ({
      total: columns.reduce((n, c) => n + c.count, 0),
      inProgress: columns.find((c) => c.status === "In Progress")?.count ?? 0,
    }),
    [columns],
  );

  return { columns, loading, error, refresh, totals };
}

