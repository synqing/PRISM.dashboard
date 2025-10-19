import { Router } from "express";
import { parseJQL } from "../jql.js";
import { query } from "../db.js";

export const search = Router();

search.post("/", async (req, res) => {
  const text = typeof req.body?.q === "string" ? req.body.q : "";
  const parsed = parseJQL(text);
  const sql = `
    select i.*
    from issue i
    where ${parsed.where.clause}
    order by ${parsed.orderBy}
    limit 1000
  `;
  const rows = await query(sql, parsed.where.params);
  res.json({ count: rows.rowCount, items: rows.rows });
});
