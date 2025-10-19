import { useState, useRef } from "react";
import { useBoard, findIssue } from "../hooks/useBoard";
import { STATUS_META } from "../config/board";
import { NEXT_STATES, type Status } from "../config/workflow";
import { BoardFilters, type BoardFiltersValue } from "./BoardFilters";
import { useToast } from "./Toast";

function cls(...a: (string | false | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

export default function Board() {
  const [flt, setFlt] = useState<BoardFiltersValue>({});
  const { columns, loading, error, refresh, totals, transition } = useBoard(flt);
  const push = useToast();

  // Drag state
  const draggingRef = useRef<{ id: string; from: Status } | null>(null);
  const [hoverStatus, setHoverStatus] = useState<Status | null>(null);
  const [hoverLegal, setHoverLegal] = useState(false);

  function onDragStart(issue: any, from: Status, ev: React.DragEvent) {
    draggingRef.current = { id: issue.id, from };
    ev.dataTransfer.setData("text/plain", issue.id);
    ev.dataTransfer.effectAllowed = "move";
    (ev.currentTarget as HTMLElement).classList.add("drag-ghost");
  }
  function onDragEnd(ev: React.DragEvent) {
    (ev.currentTarget as HTMLElement).classList.remove("drag-ghost");
    draggingRef.current = null;
    setHoverStatus(null);
  }

  async function onDrop(to: Status, ev: React.DragEvent) {
    ev.preventDefault();
    const id = ev.dataTransfer.getData("text/plain");
    const grabbed = findIssue(columns as any, id);
    setHoverStatus(null);
    if (!grabbed) return;
    const cur = grabbed.issue;
    const from = grabbed.from;
    if (from === to) return;
    const legal = NEXT_STATES[from]?.includes(to);
    if (!legal) {
      push({ kind: "error", text: `Illegal transition: ${from} → ${to}` });
      return;
    }
    try {
      await transition(cur, to);
      push({ kind: "success", text: `${cur.key} → ${to}` });
    } catch (e: any) {
      push({ kind: "error", text: e?.message || "Transition failed" });
    }
  }

  function onDragOver(to: Status, ev: React.DragEvent) {
    ev.preventDefault();
    if (!draggingRef.current) return;
    const { from } = draggingRef.current;
    setHoverStatus(to);
    const ok = NEXT_STATES[from]?.includes(to) ?? false;
    setHoverLegal(ok);
    ev.dataTransfer.dropEffect = ok ? "move" : "none";
  }

  return (
    <div className="p-8 space-y-6 overflow-auto h-full">
      <div className="flex items-center gap-3">
        <div>
          <h2 style={{ color: 'var(--text-high)' }}>Board</h2>
          <p style={{ color: 'var(--text-med)', fontSize: 'var(--text-meta)', marginTop: '4px' }}>
            Column workflow with WIP control (API‑backed)
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3" style={{ color: 'var(--text-med)', fontSize: 'var(--text-meta)' }}>
          <BoardFilters value={flt} onChange={setFlt} />
          <span>Total: {totals.total}</span>
          <span>•</span>
          <span>In Progress: {totals.inProgress}</span>
          <button
            className="px-3 py-1.5 rounded border"
            style={{ borderColor: 'var(--stroke-high)', color: 'var(--text-high)', background: 'var(--surface-2)' }}
            onClick={() => refresh()}
            disabled={loading}
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {error ? (
        <div className="p-4">
          <div className="text-red-400">Failed to load board from API.</div>
          <button
            className="px-3 py-1.5 rounded border"
            style={{ borderColor: 'var(--stroke-high)', color: 'var(--text-high)', background: 'var(--surface-2)' }}
            onClick={() => refresh()}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {columns.map((col) => (
            <BoardColumn
              key={col.status}
              {...col}
              hover={hoverStatus === (col.status as Status)}
              hoverLegal={hoverLegal}
              onDragOver={(ev) => onDragOver(col.status as Status, ev)}
              onDrop={(ev) => onDrop(col.status as Status, ev)}
            >
              {col.items.map((it) => (
                <Card
                  key={it.id}
                  issue={it}
                  status={col.status as Status}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onTransition={async (i, to) => {
                    try {
                      await transition(i, to);
                      push({ kind: "success", text: `${i.key} → ${to}` });
                    } catch (e: any) {
                      push({ kind: "error", text: e?.message || "Transition failed" });
                    }
                  }}
                />
              ))}
            </BoardColumn>
          ))}
        </div>
      )}
    </div>
  );
}

type ColumnProps = ReturnType<typeof useBoard>["columns"][number] & {
  onTransition?: (issue: any, to: Status) => Promise<void>;
  hover?: boolean;
  hoverLegal?: boolean;
  onDragOver?: (ev: React.DragEvent) => void;
  onDrop?: (ev: React.DragEvent) => void;
  children?: React.ReactNode;
};

function BoardColumn({ status, items, wipLimit, count, breached, hover, hoverLegal, onDragOver, onDrop, children }: ColumnProps) {
  const meta = STATUS_META[status as keyof typeof STATUS_META];
  const dropClass = hover ? (hoverLegal ? "outline outline-1 outline-cyan-300/35 bg-cyan-300/5" : "outline outline-1 outline-amber-500/45 bg-amber-500/6") : "";
  return (
    <section
      className={cls('rounded-xl border transition-colors', dropClass)}
      style={{ border: '1px solid var(--stroke-low)', background: breached ? 'rgba(245, 158, 11, 0.06)' : 'var(--surface-2)' }}
      onDragOver={onDragOver}
      onDrop={onDrop}
      aria-dropeffect="move"
    >
      <header className="sticky top-0 z-10 px-3 py-2 flex items-center gap-2"
        style={{ backdropFilter: 'blur(6px)', color: 'var(--text-high)' }}
      >
        <h3 className="font-medium">{meta.label}</h3>
        <div
          className="ml-auto text-xs px-2 py-0.5 rounded-full"
          style={{
            border: `1px solid ${breached ? 'rgba(245, 158, 11, 0.6)' : 'var(--stroke-high)'}`,
            color: breached ? 'rgba(245, 158, 11, 0.9)' : 'var(--text-med)'
          }}
        >
          {count}{wipLimit ? ` / ${wipLimit}` : ''}
        </div>
      </header>

      <div className="p-2 flex flex-col gap-2 min-h-[120px]">
        {items.length === 0 ? (
          <div className="text-xs px-2 py-8 text-center" style={{ color: 'var(--text-subtle)' }}>No items</div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

function Card({ issue, status, onTransition, onDragStart, onDragEnd }: { issue: any; status: Status; onTransition?: (i:any,to:Status)=>Promise<void>; onDragStart?: (issue:any, from:Status, ev:React.DragEvent)=>void; onDragEnd?: (ev:React.DragEvent)=>void }) {
  const [menu, setMenu] = useState(false);
  const legal = NEXT_STATES[status] || [];

  async function handle(to: Status) {
    setMenu(false);
    await onTransition?.(issue, to);
  }

  return (
    <article
      className="group rounded-lg transition-colors focus-within:ring-2"
      style={{ border: '1px solid var(--stroke-low)', background: 'var(--surface-1)' }}
      tabIndex={0}
      draggable
      onDragStart={(ev)=>onDragStart?.(issue, status, ev)}
      onDragEnd={(ev)=>onDragEnd?.(ev)}
      onKeyDown={(e) => { if (e.key.toLowerCase() === 't' && legal.length) { setMenu(v=>!v); e.preventDefault(); } if ((e.key === ']' || e.key === '}') && legal.length){ handle(legal[0]); e.preventDefault(); } if ((e.key === '[' || e.key === '{') && legal.length){ handle(legal[legal.length-1]); e.preventDefault(); } }}
    >
      <div className="p-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono" style={{ color: 'var(--brand-cyan)' }}>{issue.key}</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ border: '1px solid var(--stroke-low)', color: 'var(--text-med)' }}>
            {issue.priority}
          </span>
          <span className="ml-auto text-[10px]" style={{ color: 'var(--text-subtle)' }}>
            {issue.updated_at ? new Date(issue.updated_at).toLocaleDateString() : ''}
          </span>
        </div>
        <div className="mt-1 text-sm" style={{ color: 'var(--text-high)' }}>{issue.title}</div>
        <div className="mt-1 text-xs" style={{ color: 'var(--text-med)' }}>{issue.category}</div>

        {legal.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <button
              className="text-[11px] px-2 py-1 rounded"
              style={{ border: '1px solid var(--stroke-low)', color: 'var(--text-high)', background: 'var(--surface-2)' }}
              onClick={() => setMenu((m) => !m)}
              title="t — transition"
            >
              Transition ▾
            </button>
            {menu && (
              <ul className="z-10 mt-1 rounded-lg"
                style={{ border: '1px solid var(--stroke-low)', background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(6px)' }}
              >
                {legal.map((to: Status) => (
                  <li key={to}>
                    <button
                      className="w-full text-left text-[12px] px-2 py-1 rounded hover:bg-white/10"
                      onClick={() => handle(to)}
                    >
                      → {to}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
