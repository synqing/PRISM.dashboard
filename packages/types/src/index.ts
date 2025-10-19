import { z } from "zod";

export const Status = z.enum(["To Do", "In Progress", "In Review", "Blocked", "Done"]);

export const IssueKey = z.string().regex(/^[A-Za-z][A-Za-z0-9]+(?:[A-Za-z][A-Za-z0-9]+)*-\d{3,}$/);

export const IssueCreate = z.object({
  key: IssueKey,
  title: z.string().min(1),
  type: z.enum(["Task", "Bug", "Story"]),
  status: Status,
  category: z.string().min(1),
  priority: z.string().default("P1"),
  assignee: z.string().optional(),
  reporter: z.string().optional(),
  labels: z.array(z.string()).optional(),
  details: z.string().optional(),
  test_strategy: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  space_slug: z.string().default("k1")
});

export const IssueUpdate = IssueCreate
  .omit({ key: true, type: true, category: true, space_slug: true, status: true })
  .partial();

export const TransitionBody = z.object({
  to: Status,
});

export type Issue = z.infer<typeof IssueCreate>;
