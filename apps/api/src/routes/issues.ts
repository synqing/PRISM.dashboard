import { Router } from "express";
import { IssueCreate, IssueUpdate, TransitionBody } from "@prism/types";
import { query } from "../db.js";
import { authGuard } from "../util.js";

export const issues = Router();

issues.post("/", authGuard, async (req, res) => {
  const parsed = IssueCreate.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error);
    return;
  }

  const body = parsed.data;
  const space = await query<{ id: string }>("select id from space where slug=$1", [body.space_slug]);
  if (!space.rowCount) {
    res.status(400).json({ error: "space not found" });
    return;
  }

  try {
    const insert = await query(
      `insert into issue (key,title,type,status,category,priority,assignee,reporter,labels,details,test_strategy,dependencies,space_id)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       returning *`,
      [
        body.key,
        body.title,
        body.type,
        body.status,
        body.category,
        body.priority,
        body.assignee ?? null,
        body.reporter ?? null,
        body.labels ?? [],
        body.details ?? null,
        body.test_strategy ?? null,
        body.dependencies ?? [],
        space.rows[0].id,
      ],
    );
    res.status(201).json(insert.rows[0]);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

issues.get("/:keyOrId", async (req, res) => {
  const keyOrId = req.params.keyOrId;
  const record = await query("select * from issue where id::text=$1 or key=$1", [keyOrId]);
  if (!record.rowCount) {
    res.status(404).json({ error: "not found" });
    return;
  }
  res.json(record.rows[0]);
});

issues.patch("/:keyOrId", authGuard, async (req, res) => {
  const parsed = IssueUpdate.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error);
    return;
  }
  const updates = parsed.data;
  const fields = Object.keys(updates);
  if (!fields.length) {
    res.json({ ok: true });
    return;
  }

  const setClauses = fields.map((field, index) => `${field}=$${index + 1}`).join(", ");
  const params = fields.map((field) => (updates as any)[field]);
  params.push(req.params.keyOrId);

  const updated = await query(
    `update issue set ${setClauses} where key=$${params.length} or id::text=$${params.length} returning *`,
    params,
  );
  if (!updated.rowCount) {
    res.status(404).json({ error: "not found" });
    return;
  }
  res.json(updated.rows[0]);
});

issues.post("/:key/transition", authGuard, async (req, res) => {
  const parsed = TransitionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(parsed.error);
    return;
  }

  const key = req.params.key;
  const current = await query("select * from issue where key=$1", [key]);
  if (!current.rowCount) {
    res.status(404).json({ error: "not found" });
    return;
  }

  const issue = current.rows[0];
  const workflow = await query(
    "select 1 from workflow where space_id=$1 and from_status=$2 and to_status=$3",
    [issue.space_id, issue.status, parsed.data.to],
  );
  if (!workflow.rowCount) {
    res.status(409).json({ error: `Illegal transition: ${issue.status} -> ${parsed.data.to}` });
    return;
  }

  const updated = await query("update issue set status=$1 where id=$2 returning *", [parsed.data.to, issue.id]);
  res.json(updated.rows[0]);
});

issues.post("/:key/comment", authGuard, async (req, res) => {
  const key = req.params.key;
  const { author, body } = (req.body || {}) as { author?: string; body?: string };
  if (!author || !body) {
    res.status(400).json({ error: "author/body required" });
    return;
  }

  const issue = await query("select id from issue where key=$1", [key]);
  if (!issue.rowCount) {
    res.status(404).json({ error: "not found" });
    return;
  }

  const comment = await query(
    "insert into comment(issue_id, author, body) values ($1,$2,$3) returning *",
    [issue.rows[0].id, author, body],
  );
  res.status(201).json(comment.rows[0]);
});

issues.post("/:key/link", authGuard, async (req, res) => {
  const key = req.params.key;
  const { type, target_url, target_key } = req.body || {};
  if (!type || (!target_url && !target_key)) {
    res.status(400).json({ error: "type and one of target_url/target_key" });
    return;
  }

  const issue = await query("select id from issue where key=$1", [key]);
  if (!issue.rowCount) {
    res.status(404).json({ error: "not found" });
    return;
  }

  const link = await query(
    "insert into link(issue_id, type, target_url, target_key) values ($1,$2,$3,$4) returning *",
    [issue.rows[0].id, type, target_url ?? null, target_key ?? null],
  );
  res.status(201).json(link.rows[0]);
});

issues.get("/next/by-category/:cat", async (req, res) => {
  const category = req.params.cat;
  const next = await query(
    `
    select i.*
    from issue i
    where i.category=$1 and i.status='To Do'
      and not exists (
        select 1
        from unnest(i.dependencies) as dep
        join issue d on d.key = dep
        where d.status <> 'Done'
      )
    order by i.priority, i.updated_at asc
    limit 1
  `,
    [category],
  );

  if (!next.rowCount) {
    res.status(404).json({ error: "no ready task" });
    return;
  }

  res.json(next.rows[0]);
});
