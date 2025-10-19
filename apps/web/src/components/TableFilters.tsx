export type TableFiltersValue = {
  q?: string;
  status?: string;   // CSV
  category?: string; // CSV
  assignee?: string;
  labels?: string;   // CSV
};

export function TableFilters({ value, onChange }: { value: TableFiltersValue; onChange: (v: TableFiltersValue) => void }) {
  const cls = {
    input: "rounded px-2 py-1 text-sm",
  };
  const style = {
    input: { background: 'var(--surface-2)', border: '1px solid var(--stroke-high)', color: 'var(--text-high)' } as React.CSSProperties,
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      <input className={cls.input} style={style.input} placeholder="Search (q)"
        value={value.q ?? ""}
        onChange={(e)=>onChange({ ...value, q: e.target.value || undefined })}
      />
      <input className={cls.input} style={style.input} placeholder="Status CSV (To Do,In Progress)"
        value={value.status ?? ""}
        onChange={(e)=>onChange({ ...value, status: e.target.value || undefined })}
      />
      <input className={cls.input} style={style.input} placeholder="Category CSV (Helpers,Onboarding)"
        value={value.category ?? ""}
        onChange={(e)=>onChange({ ...value, category: e.target.value || undefined })}
      />
      <input className={cls.input} style={style.input} placeholder="Assignee"
        value={value.assignee ?? ""}
        onChange={(e)=>onChange({ ...value, assignee: e.target.value || undefined })}
      />
      <input className={cls.input} style={style.input} placeholder="Labels CSV (perf,a11y)"
        value={value.labels ?? ""}
        onChange={(e)=>onChange({ ...value, labels: e.target.value || undefined })}
      />
    </div>
  );
}

