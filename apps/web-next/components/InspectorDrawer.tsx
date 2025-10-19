"use client";
import { useEffect, useState } from "react";
import { getIssue, getComments, getActivity } from "../lib/api";

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
      getActivity(issueKey)
        .then((res) => setActivity(res.items))
        .catch(() => setActivity([]));
    }
  }, [issueKey, tab, comments, activity]);

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
          {(
            [
              ["summary", "Summary"],
              ["notes", "Notes"],
              ["deps", "Dependencies"],
              ["labels", "Labels"],
              ["activity", "Activity"],
              ["comments", "Comments"],
            ] as const
          ).map(([id, label]) => (
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
              {tab === "activity" && <Activity items={activity} />}
              {tab === "comments" && <Comments items={comments} />}
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

function Activity({ items }: { items: ActivityItem[] | null }) {
  if (items == null) return <div className="text-slate-400">Loading…</div>;
  if (!items.length) return <div className="text-slate-500">No activity</div>;
  return (
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
  );
}

function Comments({ items }: { items: CommentItem[] | null }) {
  if (items == null) return <div className="text-slate-400">Loading…</div>;
  if (!items.length) return <div className="text-slate-500">No comments yet</div>;
  return (
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
  );
}
