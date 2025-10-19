import { Router } from "express";
import { parseJQL } from "../jql.js";
import { query } from "../db.js";

export const search = Router();

search.post("/", async (req, res) => {
  const ql = typeof req.body?.q === "string" ? req.body.q : "";
  const parsed = parseJQL(ql);

  // Detect substring search emitted for text ~ "..." and upgrade to FTS
  let whereClause = parsed.where.clause;
  let params = parsed.where.params.slice();
  const hasTextSearch = /i\.title ilike/.test(whereClause) || /i\.details ilike/.test(whereClause);

  let rankSelect = "";
  if (hasTextSearch) {
    const likeA = params.pop();
    const likeB = params.pop();
    const termLike = typeof likeA === 'string' ? likeA : likeB;
    const plainTerm = String(termLike || '').replace(/^%|%$/g, '');
    const ftsParamIndex = params.length + 1;
    whereClause = `(${whereClause}) OR (i.issue_fts @@ websearch_to_tsquery('english', $${ftsParamIndex}))`;
    params.push(plainTerm);
    rankSelect = `, ts_rank_cd(i.issue_fts, websearch_to_tsquery('english', $${ftsParamIndex}), 32) as rank`;
  }

  const sql = `
    select i.* ${rankSelect}
    from issue i
    where ${whereClause}
    order by ${hasTextSearch ? `rank desc, ${parsed.orderBy}` : parsed.orderBy}
    limit 1000
  `;
  const rows = await query(sql, params);
  res.json({ count: rows.rowCount, items: rows.rows });
});
