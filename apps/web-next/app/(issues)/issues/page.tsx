import "server-only";

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
  return (
    <main className="p-6 space-y-4">
      <header className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Issues</h1>
        <div className="ml-auto text-sm" style={{ color: '#9ca3af' }}>
          {total != null ? `Showing ${items.length} of ${total}` : `Showing ${items.length}`}
        </div>
      </header>
      <table className="w-full text-sm">
        <thead style={{ color: '#9ca3af' }}>
          <tr>
            <th className="text-left p-2">Key</th>
            <th className="text-left p-2">Title</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Category</th>
            <th className="text-left p-2">Assignee</th>
            <th className="text-left p-2">Updated</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i=> (
            <tr key={i.id} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <td className="p-2" style={{ color: '#22d3ee', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas' }}>{i.key}</td>
              <td className="p-2">{i.title}</td>
              <td className="p-2">{i.status}</td>
              <td className="p-2">{i.category}</td>
              <td className="p-2">{i.assignee ?? '—'}</td>
              <td className="p-2">{new Date(i.updated_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

