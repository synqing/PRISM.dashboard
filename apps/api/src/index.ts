import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { issues } from "./routes/issues.js";
import { search } from "./routes/search.js";
import { sync } from "./routes/sync.js";
import { webhooks } from "./routes/webhooks.js";

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));

// very light metrics
let issuesListCount = 0, searchCount = 0;
app.use("/api/issues", (req, _res, next)=>{ if (req.method === "GET" && req.path === "/") issuesListCount++; next(); });
app.use("/api/search", (_req,_res,next)=>{ searchCount++; next(); });
app.get("/metrics", (_req,res)=> res.type("text/plain").send(
  `issues_list_count ${issuesListCount}\nsearch_count ${searchCount}\n`
));

app.use("/api/issues", issues);
app.use("/api/search", search);
app.use("/api/sync", sync);
app.use("/api/webhooks", webhooks);

app.use((_req, res) => res.status(404).json({ error: "not found" }));

const port = Number(process.env.PORT || 3333);
app.listen(port, () => {
  console.log(`PRISM API on http://localhost:${port}`);
});
