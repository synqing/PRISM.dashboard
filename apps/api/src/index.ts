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

app.use("/api/issues", issues);
app.use("/api/search", search);
app.use("/api/sync", sync);
app.use("/api/webhooks", webhooks);

app.use((_req, res) => res.status(404).json({ error: "not found" }));

const port = Number(process.env.PORT || 3333);
app.listen(port, () => {
  console.log(`PRISM API on http://localhost:${port}`);
});
