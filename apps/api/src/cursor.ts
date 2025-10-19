export type Cursor = { updated_at: string; id: string };

export function encodeCursor(c: Cursor): string {
  return Buffer.from(JSON.stringify(c), "utf8").toString("base64url");
}

export function decodeCursor(s?: string | null): Cursor | null {
  if (!s) return null;
  try {
    const json = Buffer.from(String(s), "base64url").toString("utf8");
    const obj = JSON.parse(json);
    if (typeof obj?.updated_at === "string" && typeof obj?.id === "string") return obj as Cursor;
    return null;
  } catch {
    return null;
  }
}

