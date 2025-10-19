export type ParsedQuery = {
  where: { clause: string; params: any[] };
  orderBy: string; // safe SQL fragment from whitelist
};

const ORDER_FIELD_MAP: Record<string, string> = {
  updated: "i.updated_at",
  created: "i.created_at",
  priority: "i.priority",
  status: "i.status",
};

export function parseJQL(input: string | undefined): ParsedQuery {
  if (!input || !input.trim()) {
    return { where: { clause: "true", params: [] }, orderBy: "i.updated_at desc" };
  }
  const tokens = input.match(/"[^"]*"|\S+/g) || [];
  const params: any[] = [];
  const clauses: string[] = [];
  let i = 0;
  let orderBy = "i.updated_at desc";

  const fields = new Set(["status", "assignee", "reporter", "priority", "label", "category", "text"]);
  const unq = (s: string) => (s.startsWith('"') && s.endsWith('"') ? s.slice(1, -1) : s);

  while (i < tokens.length) {
    const tk = tokens[i];

    if (tk.toLowerCase() === "order" && tokens[i + 1]?.toLowerCase() === "by") {
      const rawField = (tokens[i + 2] || "updated").toLowerCase();
      const dirToken = (tokens[i + 3] || "desc").toUpperCase();
      const fieldSql = ORDER_FIELD_MAP[rawField] || ORDER_FIELD_MAP["updated"];
      const dir = dirToken === "ASC" ? "asc" : "desc";
      orderBy = `${fieldSql} ${dir}`;
      break;
    }

    if (fields.has(tokens[i])) {
      const field = tokens[i];
      const op = tokens[i + 1];
      const val = unq(tokens[i + 2] || "");
      i += 3;

      switch (field) {
        case "status":
        case "assignee":
        case "reporter":
        case "priority":
        case "category":
          if (op === "=") clauses.push(`i.${field} = $${params.push(val)}`);
          else if (op === "!=") clauses.push(`i.${field} <> $${params.push(val)}`);
          break;
        case "label":
          if (op.toLowerCase() === "in") {
            const list = val.split(",").map((s) => s.trim());
            clauses.push(`labels && $${params.push(list)}::text[]`);
          } else if (op.toLowerCase() === "not" && tokens[i]?.toLowerCase() === "in") {
            i += 1;
            const list = val.split(",").map((s) => s.trim());
            clauses.push(`NOT (labels && $${params.push(list)}::text[])`);
          }
          break;
        case "text":
          if (op === "~") {
            clauses.push(`(i.title ilike $${params.push(`%${val}%`)} or i.details ilike $${params.push(`%${val}%`)})`);
          }
          break;
      }
      continue;
    }

    if (["and", "or", "not"].includes(tk.toLowerCase())) {
      i += 1;
      continue;
    }

    i += 1;
  }

  const clause = clauses.length ? clauses.join(" AND ") : "true";
  return { where: { clause, params }, orderBy };
}
