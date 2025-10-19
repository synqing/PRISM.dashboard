import { Router } from "express";
import { authGuard } from "../util.js";
import { pool, query } from "../db.js";

export const sync = Router();

// TODO(TM-MCP):
// - spawn MCP server (task-master-ai) with env TASK_MASTER_TOOLS=standard
// - tools to call in order: parse_prd → analyze_complexity → expand (--research?) → validate_dependencies → generate
// - then call this same /pull with the produced tasks.json

sync.post("/pull", authGuard, async (req, res) => {
  const { space_slug = "k1", tasks = [] } = (req.body || {}) as {
    space_slug?: string;
    tasks?: Array<Record<string, any>>;
  };

  const space = await query<{ id: string }>("select id from space where slug=$1", [space_slug]);
  if (!space.rowCount) {
    res.status(400).json({ error: "space not found" });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("begin");

    for (const task of tasks) {
      const details = task.details ?? null;
      const testStrategy = task.testStrategy ?? task.test_strategy ?? null;
      const dependencies = task.dependencies ?? [];
      const labels = task.labels ?? [];
      const assignee = task.assignee ?? null;
      const reporter = task.reporter ?? null;

      await client.query(
        `
        insert into issue (key,title,type,status,category,priority,details,test_strategy,dependencies,assignee,reporter,labels,space_id)
        values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        on conflict (key) do update set
          title=excluded.title,
          status=excluded.status,
          priority=excluded.priority,
          details=excluded.details,
          test_strategy=excluded.test_strategy,
          dependencies=excluded.dependencies,
          assignee=excluded.assignee,
          reporter=excluded.reporter,
          labels=excluded.labels,
          updated_at=now()
      `,
        [
          task.key,
          task.title,
          task.type || "Task",
          task.status || "To Do",
          task.category || "Helpers",
          task.priority || "P1",
          details,
          testStrategy,
          dependencies,
          assignee,
          reporter,
          labels,
          space.rows[0].id,
        ],
      );
    }

    await client.query("commit");
    res.json({ ok: true, upserted: tasks.length });
  } catch (error: any) {
    await client.query("rollback");
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});
