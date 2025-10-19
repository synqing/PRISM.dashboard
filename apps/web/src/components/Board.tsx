import { useBoard } from "../hooks/useBoard";
import { STATUS_META } from "../config/board";
import { NEXT_STATES, type Status } from "../config/workflow";
import { useState } from "react";
import { BoardFilters, type BoardFiltersValue } from "./BoardFilters";
import { useToast } from "./Toast";

function cls(...a: (string | false | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

export default function Board() {
  const [flt, setFlt] = useState<BoardFiltersValue>({});
  const { columns, loading, error, refresh, totals, transition } = useBoard(flt);

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
            <BoardColumn key={col.status} {...col} onTransition={transition} />
          ))}
        </div>
      )}
    </div>
  );
}

type ColumnProps = ReturnType<typeof useBoard>["columns"][number] & {
  onTransition?: (issue: any, to: Status) => Promise<void>;
};

function BoardColumn({ status, items, wipLimit, count, breached, onTransition }: ColumnProps) {
  const meta = STATUS_META[status as keyof typeof STATUS_META];
  return (
    <section
      className={cls('rounded-xl')}
      style={{ border: '1px solid var(--stroke-low)', background: breached ? 'rgba(245, 158, 11, 0.06)' : 'var(--surface-2)' }}
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
          items.map((it) => <Card key={it.id} issue={it} onTransition={onTransition} />)
        )}
      </div>
    </section>
  );
}

function Card({ issue, onTransition }: { issue: any; onTransition?: (i:any,to:Status)=>Promise<void> }) {
  const [menu, setMenu] = useState(false);
  const push = useToast();
  const legal = NEXT_STATES[issue.status as Status] || [];

  async function handle(to: Status) {
    setMenu(false);
    if (!onTransition) return;
    try {
      await onTransition(issue, to);
      push({ kind: 'success', text: `Moved ${issue.key} → ${to}` });
    } catch (e: any) {
      push({ kind: 'error', text: e?.message || 'Transition failed' });
    }
  }

  return (
    <article
      className="group rounded-lg transition-colors focus-within:ring-2"
      style={{ border: '1px solid var(--stroke-low)', background: 'var(--surface-1)' }}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key.toLowerCase() === 't' && legal.length) { setMenu(v=>!v); e.preventDefault(); } }}
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
