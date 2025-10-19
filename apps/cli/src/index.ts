#!/usr/bin/env node
import "dotenv/config";
import { Command } from "commander";
import chalk from "chalk";
import fs from "node:fs";
import ora from "ora";
import { http } from "./api.js";
import type { Issue } from "@prism/types";

const program = new Command();
program.name("prism").description("PRISM.dashboard CLI").version("0.1.0");

function printIssue(issue: any) {
  console.log(`${chalk.cyan(issue.key)}  ${issue.title}`);
  console.log(`  type=${issue.type}  status=${issue.status}  category=${issue.category}  priority=${issue.priority}`);
  if (issue.assignee) console.log(`  assignee=${issue.assignee}`);
  if (issue.dependencies?.length) console.log(`  deps=[${issue.dependencies.join(", ")}]`);
  if (issue.details) {
    const snippet = issue.details.length > 160 ? `${issue.details.slice(0, 160)}…` : issue.details;
    console.log(chalk.gray(`  details: ${snippet}`));
  }
  console.log("");
}

program
  .command("issue:create")
  .description("Create an issue")
  .requiredOption("-k, --key <key>")
  .requiredOption("-t, --title <title>")
  .requiredOption("--type <Task|Bug|Story>")
  .requiredOption("--status <status>")
  .requiredOption("--category <name>")
  .option("--priority <priority>", "P1")
  .option("--assignee <name>")
  .option("--reporter <name>")
  .option("--labels <csv>")
  .option("--details <text>")
  .option("--test <text>")
  .option("--deps <csv>")
  .action(async (opts) => {
    const payload: Issue = {
      key: opts.key,
      title: opts.title,
      type: opts.type,
      status: opts.status,
      category: opts.category,
      priority: opts.priority,
      assignee: opts.assignee,
      reporter: opts.reporter,
      labels: opts.labels ? String(opts.labels).split(",").map((s: string) => s.trim()) : [],
      details: opts.details,
      test_strategy: opts.test,
      dependencies: opts.deps ? String(opts.deps).split(",").map((s: string) => s.trim()) : [],
      space_slug: "k1",
    } as Issue;

    const { data } = await http.post("/api/issues", payload);
    printIssue(data);
  });

program
  .command("issue:update")
  .description("Update metadata fields")
  .argument("<keyOrId>")
  .option("--title <title>")
  .option("--assignee <name>")
  .option("--priority <priority>")
  .option("--labels <csv>")
  .option("--details <text>")
  .option("--test <text>")
  .action(async (keyOrId, opts) => {
    const body: any = {};
    if (opts.title) body.title = opts.title;
    if (opts.assignee) body.assignee = opts.assignee;
    if (opts.priority) body.priority = opts.priority;
    if (opts.details) body.details = opts.details;
    if (opts.test) body.test_strategy = opts.test;
    if (opts.labels) body.labels = String(opts.labels).split(",").map((s: string) => s.trim());

    const { data } = await http.patch(`/api/issues/${keyOrId}`, body);
    printIssue(data);
  });

program
  .command("issue:show")
  .description("Show an issue")
  .argument("<keyOrId>")
  .action(async (keyOrId) => {
    const { data } = await http.get(`/api/issues/${keyOrId}`);
    printIssue(data);
  });

program
  .command("issue:next")
  .description("Return next ready task in a category")
  .requiredOption("--category <name>")
  .action(async (opts) => {
    try {
      const { data } = await http.get(`/api/issues/next/by-category/${encodeURIComponent(opts.category)}`);
      printIssue(data);
    } catch (error: any) {
      console.error(chalk.yellow(error.response?.data?.error || error.message));
      process.exitCode = 1;
    }
  });

program
  .command("link:pr")
  .description("Link a PR URL to an issue")
  .argument("<key>")
  .argument("<prUrl>")
  .action(async (key, prUrl) => {
    const { data } = await http.post(`/api/issues/${key}/link`, { type: "pr", target_url: prUrl });
    console.log("linked:", data);
  });

program
  .command("sync:pull")
  .description("Mirror a TM tasks.json into DB")
  .requiredOption("--file <path>")
  .option("--space <slug>", "k1")
  .action(async (opts) => {
    const spinner = ora("Reading tasks…").start();
    const raw = JSON.parse(fs.readFileSync(opts.file, "utf8"));
    const tasks = Array.isArray(raw) ? raw : raw.tasks || [];
    spinner.text = `Upserting ${tasks.length} tasks…`;
    const { data } = await http.post("/api/sync/pull", { space_slug: opts.space, tasks });
    spinner.succeed(`Upserted ${data.upserted} tasks`);
  });

program.parseAsync().catch((error) => {
  console.error(chalk.red(error.stack || error.message));
  process.exit(1);
});
