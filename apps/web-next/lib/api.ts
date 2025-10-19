export function getApiBase() {
  return process.env.PRISM_API_BASE || "http://localhost:3333";
}

export async function getIssue(key: string) {
  const base = getApiBase();
  const resp = await fetch(`${base}/api/issues/${encodeURIComponent(key)}`, { cache: "no-store" });
  if (!resp.ok) throw new Error(`issue fetch failed: ${resp.status}`);
  return await resp.json();
}

