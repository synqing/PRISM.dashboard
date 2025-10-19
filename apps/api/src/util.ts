import type { Request, Response, NextFunction } from "express";

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.replace(/^Bearer\s+/i, "");
  const required = process.env.PRISM_API_TOKEN || "";
  if (!required) {
    next();
    return;
  }
  if (token && token === required) {
    next();
    return;
  }
  res.status(401).json({ error: "unauthorized" });
}
