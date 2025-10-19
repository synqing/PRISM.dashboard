export function getApiBase() {
  const base = (import.meta as any)?.env?.VITE_API_BASE as string | undefined;
  return base && base.trim().length > 0 ? base : "http://localhost:3333";
}

export async function searchIssues(q: string = "") {
  const res = await fetch(`${getApiBase()}/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q }),
  });
  if (!res.ok) throw new Error(`Search failed: ${res.status}`);
  return (await res.json()) as { count: number; items: any[] };
}

export type ListIssuesParams = {
  status?: string[];
  category?: string[];
  assignee?: string;
  q?: string;
  labels?: string[];
  limit?: number;
  cursor?: string | null;
};

export async function listIssues(params: ListIssuesParams = {}) {
  const base = getApiBase();
  const url = new URL(`/api/issues`, base);
  const toCSV = (a?: string[]) => (a && a.length ? a.join(",") : undefined);
  if (params.status?.length) url.searchParams.set("status", toCSV(params.status)!);
  if (params.category?.length) url.searchParams.set("category", toCSV(params.category)!);
  if (params.assignee) url.searchParams.set("assignee", params.assignee);
  if (params.q) url.searchParams.set("q", params.q);
  if (params.labels?.length) url.searchParams.set("labels", toCSV(params.labels)!);
  if (typeof params.limit === "number") url.searchParams.set("limit", String(params.limit));
  if (params.cursor) url.searchParams.set("cursor", params.cursor);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`List failed: ${res.status}`);
  const data = await res.json();
  return data as { items: any[]; count: number; nextCursor: string | null; total?: number };
}

export type Issue = {
  id: string;
  key: string;
  title: string;
  status: string;
  category?: string;
  priority?: string;
  assignee?: string | null;
  reporter?: string | null;
  labels?: string[] | null;
  updated_at?: string;
};

export async function transitionIssue(key: string, to: string): Promise<Issue> {
  const base = getApiBase();
  const resp = await fetch(`${base}/api/issues/${encodeURIComponent(key)}/transition`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to }),
  });
  if (!resp.ok) {
    let msg = `transition failed: ${resp.status}`;
    try {
      const data = await resp.json();
      if (data?.error) msg = data.error;
    } catch {}
    throw new Error(msg);
  }
  return (await resp.json()) as Issue;
}
