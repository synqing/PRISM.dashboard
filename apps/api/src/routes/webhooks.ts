import { Router } from "express";
import { query } from "../db.js";

export const webhooks = Router();

webhooks.post("/github", async (req, res) => {
  const event = req.headers["x-github-event"];
  if (event !== "pull_request") {
    res.json({ ok: true });
    return;
  }

  const body = req.body || {};
  const pr = body.pull_request || {};
  const title = pr.title || "";
  const bodyText = pr.body || "";
  const prUrl = pr.html_url || "";

  const keys = new Set<string>();
  const regex = /([A-Za-z][A-Za-z0-9]+(?:[A-Za-z][A-Za-z0-9]+)*-\d{3,})/g;

  for (const text of [title, bodyText]) {
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text))) {
      keys.add(match[1]);
    }
  }

  for (const key of keys) {
    const issue = await query("select id from issue where key=$1", [key]);
    if (!issue.rowCount) continue;

    await query(
      "insert into link(issue_id, type, target_url) values ($1,'pr',$2) on conflict do nothing",
      [issue.rows[0].id, prUrl],
    );

    await query(
      "insert into event_log(source,name,payload) values ('webhook','pr.linked',$1)",
      [JSON.stringify({ key, prUrl })],
    );
  }

  res.json({ ok: true, keys: Array.from(keys) });
});
