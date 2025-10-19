"use client";
import { useEffect, useState } from "react";
import { getIssue, getComments, getActivity, postComment } from "../lib/api";

const ACTIVITY_EVENTS = new Set(["issue.transition", "comment.created", "pr.linked"]);
const API_BASE = process.env.NEXT_PUBLIC_PRISM_API_BASE || process.env.PRISM_API_BASE || "http://localhost:3333";

type CommentItem = { id: string; author: string; body: string; created_at: string };
type ActivityItem = { name: string; payload: any; created_at: string };

type Props = { issueKey: string; onClose: () => void };

export default function InspectorDrawer({ issueKey, onClose }: Props) {
  const [issue, setIssue] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"summary" | "notes" | "deps" | "labels" | "activity" | "comments">("summary");
  const [comments, setComments] = useState<CommentItem[] | null>(null);
  const [activity, setActivity] = useState<ActivityItem[] | null>(null);
  const [streamErr, setStreamErr] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    getIssue(issueKey)
      .then((data) => {
        if (mounted) {
          setIssue(data);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (mounted) {
          setError(e?.message || "Failed to load issue");
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [issueKey]);

  useEffect(() => {
    if (!issueKey) return;
    if (tab === "comments" && comments == null) {
      getComments(issueKey)
        .then((res) => setComments(res.items))
        .catch(() => setComments([]));
    }
    if (tab === "activity" && activity == null) {
      setStreamErr(null);
      getActivity(issueKey)
        .then((res) => setActivity(res.items))
        .catch(() => setActivity([]));
    }
  }, [issueKey, tab, comments, activity]);

  useEffect(() => {
    if (tab !== "activity" || !issueKey) return;

    let es: EventSource | null = null;
    let pollId: ReturnType<typeof setInterval> | null = null;
    const startPolling = () => {
      if (!pollId) {
        pollId = setInterval(() => {
          getActivity(issueKey)
            .then((res) => setActivity(res.items))
            .catch(() => {});
        }, 10000);
      }
    };

    try {
      setStreamErr(null);
      es = new EventSource(`${API_BASE}/api/issues/${encodeURIComponent(issueKey)}/activity/stream`);
      es.addEventListener("activity", (ev) => {
        try {
          const data = JSON.parse((ev as MessageEvent).data);
          if (!ACTIVITY_EVENTS.has(data?.name)) return;
          setActivity((prev) => [data, ...(prev ?? [])]);
        } catch (err) {
          console.warn("Failed to parse SSE activity", err);
        }
      });
      es.addEventListener("error", () => {
        setStreamErr("Live stream lost; falling back to polling");
        es?.close();
        startPolling();
      });
    } catch (err) {
      setStreamErr("SSE not available; using polling");
      startPolling();
    }

    return () => {
      if (es) es.close();
      if (pollId) clearInterval(pollId);
    };
  }, [tab, issueKey]);

  const tabs: [typeof tab, string][] = [
    ["summary", "Summary"],
    ["notes", "Notes"],
    ["deps", "Dependencies"],
    ["labels", "Labels"],
    ["activity", "Activity"],
    ["comments", "Comments"],
  ];

  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog">
      <div className="absolute inset-0" style={{ background: "rgba(8,12,18,0.60)" }} onClick={onClose} />
      <aside
        className="absolute right-0 top-0 h-full w-[460px]"
        style={{ background: "#1B2232", borderLeft: "1px solid rgba(255,255,255,0.12)" }}
      >
        <header
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}
        >
          <h2 className="text-base" style={{ color: "rgba(255,255,255,0.92)" }}>
            Inspector
          </h2>
          <button onClick={onClose} className="text-sm" style={{ color: "rgba(255,255,255,0.72)" }}>
            Close
          </button>
        </header>
        <div className="px-4 pt-3 border-b border-white/10 flex gap-2 text-xs">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={
                "px-2 py-1 rounded-t " +
                (tab === id ? "bg-white/10 text-slate-100" : "text-slate-400 hover:text-slate-200")
              }
            >
              {label}
            </button>
          ))}
        </div>
        <div className="p-4 space-y-3 overflow-auto h-[calc(100%-96px)] text-sm">
          {loading && <div style={{ color: "rgba(255,255,255,0.72)" }}>Loading…</div>}
          {error && <div style={{ color: "#fecaca" }}>{error}</div>}
          {issue && !loading && !error && (
            <div className="space-y-4">
              {tab === "summary" && <Summary issue={issue} />}
              {tab === "notes" && <Notes issue={issue} />}
              {tab === "deps" && <Deps issue={issue} />}
              {tab === "labels" && <Labels issue={issue} />}
              {tab === "activity" && <Activity items={activity} streamErr={streamErr} />}
              {tab === "comments" && (
                <Comments
                  issueKey={issueKey}
                  items={comments}
                  onAdd={(comment) => setComments((prev) => [comment, ...(prev ?? [])])}
                  onActivity={(item) => setActivity((prev) => [item, ...(prev ?? [])])}
                />
              )}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function Summary({ issue }: { issue: any }) {
  return (
    <section>
      <div className="text-xs" style={{ color: "#22d3ee", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas" }}>
        {issue.key}
      </div>
      <h3 className="text-lg" style={{ color: "rgba(255,255,255,0.92)" }}>
        {issue.title}
      </h3>
      <div className="text-xs" style={{ color: "rgba(255,255,255,0.56)" }}>
        {issue.status} • {issue.category} • {issue.priority ?? "P1"}
      </div>
    </section>
  );
}

function Notes({ issue }: { issue: any }) {
  return (
    <section>
      <h4 className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.92)" }}>
        Notes for Agents
      </h4>
      <div className="text-sm" style={{ color: "rgba(255,255,255,0.72)" }}>{issue.details || "—"}</div>
      {issue.test_strategy && (
        <div className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.56)" }}>
          Test: {issue.test_strategy}
        </div>
      )}
    </section>
  );
}

function Deps({ issue }: { issue: any }) {
  return (
    <section>
      <h4 className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.92)" }}>Dependencies</h4>
      {Array.isArray(issue.dependencies) && issue.dependencies.length ? (
        <ul className="list-disc pl-5 text-sm" style={{ color: "rgba(255,255,255,0.72)" }}>
          {issue.dependencies.map((d: string) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      ) : (
        <div className="text-sm" style={{ color: "rgba(255,255,255,0.56)" }}>
          None
        </div>
      )}
    </section>
  );
}

function Labels({ issue }: { issue: any }) {
  return (
    <section>
      <h4 className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.92)" }}>Labels</h4>
      <div className="flex gap-1 flex-wrap">
        {(issue.labels || []).map((l: string) => (
          <span
            key={l}
            className="text-[10px] px-2 py-0.5 rounded"
            style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.72)" }}
          >
            {l}
          </span>
        ))}
      </div>
    </section>
  );
}

function Activity({ items, streamErr }: { items: ActivityItem[] | null; streamErr: string | null }) {
  if (items == null) return <div className="text-slate-400">Loading…</div>;
  if (!items.length) return <div className="text-slate-500">No activity</div>;
  return (
    <div className="space-y-2">
      {streamErr && <div className="text-amber-400 text-xs">{streamErr}</div>}
      <ul className="space-y-2">
        {items.map((e, idx) => (
          <li key={idx} className="text-slate-300">
            <div className="text-slate-400 text-xs">
              {new Date(e.created_at || e.payload?.at || Date.now()).toLocaleString()}
            </div>
            {e.name === "issue.transition" && (
              <span>
                Transition: <b>{e.payload.from}</b> → <b>{e.payload.to}</b>
              </span>
            )}
            {e.name === "comment.created" && (
              <span>
                Comment by <b>{e.payload.author}</b>
              </span>
            )}
            {e.name === "pr.linked" && <span>PR linked</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Comments({
  issueKey,
  items,
  onAdd,
  onActivity,
}: {
  issueKey: string;
  items: CommentItem[] | null;
  onAdd: (comment: CommentItem) => void;
  onActivity: (item: ActivityItem) => void;
}) {
  const [author, setAuthor] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [posting, setPosting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  if (items == null) return <div className="text-slate-400">Loading…</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !body.trim()) return;
    setPosting(true);
    setFeedback(null);
    try {
      const comment = await postComment(issueKey, author.trim(), body.trim());
      onAdd(comment);
      onActivity({
        name: "comment.created",
        payload: { key: issueKey, author: comment.author, at: comment.created_at },
        created_at: comment.created_at,
      });
      setBody("");
      setFeedback("Comment posted");
    } catch (err: any) {
      setFeedback(err?.message || "Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="space-y-4">
      <form className="space-y-2" onSubmit={handleSubmit}>
        <input
          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-slate-200 placeholder:text-slate-500"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea
          className="w-full bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-slate-200 placeholder:text-slate-500 min-h-[80px]"
          placeholder="Write a comment…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/15 border border-white/10 text-sm"
            disabled={posting || !author.trim() || !body.trim()}
            type="submit"
          >
            {posting ? "Posting…" : "Post comment"}
          </button>
          {feedback && <span className="text-xs text-slate-400">{feedback}</span>}
        </div>
      </form>
      {items.length === 0 ? (
        <div className="text-slate-500">No comments yet</div>
      ) : (
        <ul className="space-y-3">
          {items.map((c) => (
            <li key={c.id} className="border-b border-white/10 pb-2">
              <div className="text-xs text-slate-400">
                {c.author} — {new Date(c.created_at).toLocaleString()}
              </div>
              <div className="text-slate-200 whitespace-pre-wrap">{c.body}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
