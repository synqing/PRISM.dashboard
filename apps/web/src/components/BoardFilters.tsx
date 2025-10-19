export type BoardFiltersValue = { category?: string; assignee?: string };

export function BoardFilters({ value, onChange }: { value: BoardFiltersValue; onChange: (v: BoardFiltersValue) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2" style={{ color: 'var(--text-med)', fontSize: 'var(--text-meta)' }}>
      <label className="inline-flex items-center gap-1">
        <span style={{ color: 'var(--text-subtle)' }}>Category</span>
        <input
          className="rounded px-2 py-1"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--stroke-high)', color: 'var(--text-high)' }}
          placeholder="Helpers, Onboarding…"
          value={value.category ?? ""}
          onChange={(e) => onChange({ ...value, category: e.target.value || undefined })}
        />
      </label>
      <label className="inline-flex items-center gap-1">
        <span style={{ color: 'var(--text-subtle)' }}>Assignee</span>
        <input
          className="rounded px-2 py-1"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--stroke-high)', color: 'var(--text-high)' }}
          placeholder="alice"
          value={value.assignee ?? ""}
          onChange={(e) => onChange({ ...value, assignee: e.target.value || undefined })}
        />
      </label>
    </div>
  );
}

