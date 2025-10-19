import "server-only";
import IssuesClient from "./issuesClient";

type Issue = {
  id:string; key:string; title:string; status:string; category:string;
  assignee?:string|null; updated_at:string;
};

async function fetchIssues(searchParams: Record<string,string|undefined>) {
  const base = process.env.PRISM_API_BASE || "http://localhost:3333";
  const url = new URL("/api/issues", base);
  const { q, status, category, assignee, labels, limit } = searchParams;
  if (q) url.searchParams.set("q", q);
  if (status) url.searchParams.set("status", status);
  if (category) url.searchParams.set("category", category);
  if (assignee) url.searchParams.set("assignee", assignee);
  if (labels) url.searchParams.set("labels", labels);
  url.searchParams.set("limit", String(limit ?? 100));
  const resp = await fetch(url, { cache: "no-store" });
  if (!resp.ok) throw new Error("issues fetch failed");
  const data = await resp.json();
  return data as { items: Issue[]; total?: number; nextCursor?: string|null };
}

export default async function IssuesPage({ searchParams }:{ searchParams:Record<string,string|undefined> }) {
  const { items, total } = await fetchIssues(searchParams);
  return <IssuesClient initialItems={items} total={total} />;
}
