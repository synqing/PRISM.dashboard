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

