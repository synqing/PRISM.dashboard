export function getApiBase() {
  return process.env.PRISM_API_BASE || "http://localhost:3333";
}

export async function getIssue(key: string) {
  const base = getApiBase();
  const resp = await fetch(`${base}/api/issues/${encodeURIComponent(key)}`, { cache: "no-store" });
  if (!resp.ok) throw new Error(`issue fetch failed: ${resp.status}`);
  return await resp.json();
}

export async function getComments(key: string) {
  const base = getApiBase();
  const resp = await fetch(`${base}/api/issues/${encodeURIComponent(key)}/comments`, { cache: "no-store" });
  if (!resp.ok) throw new Error("comments fetch failed");
  return (await resp.json()) as { items: { id: string; author: string; body: string; created_at: string }[] };
}

export async function getActivity(key: string) {
  const base = getApiBase();
  const resp = await fetch(`${base}/api/issues/${encodeURIComponent(key)}/activity`, { cache: "no-store" });
  if (!resp.ok) throw new Error("activity fetch failed");
  return (await resp.json()) as { items: { name: string; payload: any; created_at: string }[] };
}
