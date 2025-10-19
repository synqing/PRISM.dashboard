export function getApiBase() {
  return process.env.NEXT_PUBLIC_PRISM_API_BASE || process.env.PRISM_API_BASE || "http://localhost:3333";
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

export async function postComment(key: string, author: string, body: string) {
  const base = getApiBase();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = process.env.NEXT_PUBLIC_PRISM_API_TOKEN;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const resp = await fetch(`${base}/api/issues/${encodeURIComponent(key)}/comment`, {
    method: "POST",
    headers,
    body: JSON.stringify({ author, body }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({} as any));
    throw new Error(err?.error || `comment failed: ${resp.status}`);
  }
  return (await resp.json()) as { id: string; author: string; body: string; created_at: string };
}
