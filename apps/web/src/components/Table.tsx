import { ChevronDown, X, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { listIssues } from '../lib/api';
import { TableFilters, type TableFiltersValue } from './TableFilters';

const fallbackData = [
  { id: 'PRISM-312', title: 'Add keyboard shortcuts for board navigation', category: 'Accessibility', priority: 'medium', status: 'Backlog', assignee: 'AK', labels: ['a11y', 'ux'], updated: '2 hours ago' },
  { id: 'PRISM-289', title: 'Design empty state for new users', category: 'Onboarding', priority: 'high', status: 'To Do', assignee: 'SL', labels: ['design', 'ux'], updated: '4 hours ago' },
  { id: 'PRISM-247', title: 'Glass effect performance regression', category: 'Performance', priority: 'critical', status: 'In Progress', assignee: 'JD', labels: ['bug', 'perf'], updated: '1 hour ago' },
  { id: 'PRISM-301', title: 'Motion animation stuck in reduced-motion mode', category: 'MotionVisuals', priority: 'high', status: 'In Progress', assignee: 'TR', labels: ['bug', 'a11y'], updated: '3 hours ago' },
  { id: 'PRISM-189', title: 'Focus ring missing on custom dropdown', category: 'Accessibility', priority: 'high', status: 'In Progress', assignee: 'AK', labels: ['bug', 'a11y'], updated: '5 hours ago' },
  { id: 'PRISM-256', title: 'Update error recovery documentation', category: 'DocumentationAndSpec', priority: 'medium', status: 'Review', assignee: 'RM', labels: ['docs'], updated: '6 hours ago' },
  { id: 'PRISM-234', title: 'Standardize button taxonomy across app', category: 'TaxonomyAndNaming', priority: 'low', status: 'Review', assignee: 'SL', labels: ['refactor'], updated: '1 day ago' },
  { id: 'PRISM-267', title: 'Implement skeleton loading for table', category: 'Performance', priority: 'high', status: 'Review', assignee: 'JD', labels: ['perf', 'ux'], updated: '2 days ago' },
];

type Row = { id: string; title: string; category: string; priority: string; status: string; assignee: string; labels: string[]; updated: string };

export default function Table() {
  const [density, setDensity] = useState<'compact' | 'comfortable'>('comfortable');
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [focusedRow, setFocusedRow] = useState<number | null>(null);
  const [rows, setRows] = useState<Row[]>(fallbackData as Row[]);
  const [loaded, setLoaded] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [filters, setFilters] = useState<TableFiltersValue>({});
  const pageSize = 100;
  const filterSig = useMemo(()=>JSON.stringify(filters), [filters]);
  const first = useRef(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const params: any = { limit: pageSize };
        if (filters.q) params.q = filters.q;
        if (filters.assignee) params.assignee = filters.assignee;
        if (filters.status) params.status = filters.status.split(',').map((s:string)=>s.trim()).filter(Boolean);
        if (filters.category) params.category = filters.category.split(',').map((s:string)=>s.trim()).filter(Boolean);
        if (filters.labels) params.labels = filters.labels.split(',').map((s:string)=>s.trim()).filter(Boolean);
        const res = await listIssues(params);
        if (cancelled) return;
        const mapped: Row[] = res.items.map((i: any) => ({
          id: i.key,
          title: i.title,
          category: i.category ?? "",
          priority: (i.priority || "P1").toLowerCase(),
          status: i.status,
          assignee: (i.assignee || "").slice(0, 2).toUpperCase(),
          labels: Array.isArray(i.labels) ? i.labels : [],
          updated: i.updated_at || "",
        }));
        setRows(mapped);
        setNextCursor(res.nextCursor ?? null);
        setTotal(res.total);
      } catch (_e) {
        // fall back to in-memory data
        setRows(fallbackData as Row[]);
        setNextCursor(null);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filterSig]);

  const loadMore = async () => {
    if (!nextCursor) return;
    setLoadingMore(true);
    try {
      const params: any = { limit: pageSize, cursor: nextCursor };
      if (filters.q) params.q = filters.q;
      if (filters.assignee) params.assignee = filters.assignee;
      if (filters.status) params.status = filters.status.split(',').map((s:string)=>s.trim()).filter(Boolean);
      if (filters.category) params.category = filters.category.split(',').map((s:string)=>s.trim()).filter(Boolean);
      if (filters.labels) params.labels = filters.labels.split(',').map((s:string)=>s.trim()).filter(Boolean);
      const res = await listIssues(params);
      const mapped: Row[] = res.items.map((i: any) => ({
        id: i.key,
        title: i.title,
        category: i.category ?? "",
        priority: (i.priority || "P1").toLowerCase(),
        status: i.status,
        assignee: (i.assignee || "").slice(0, 2).toUpperCase(),
        labels: Array.isArray(i.labels) ? i.labels : [],
        updated: i.updated_at || "",
      }));
      // de-dup by id
      const existing = new Set(rows.map((r) => r.id));
      setRows([...rows, ...mapped.filter((r) => !existing.has(r.id))]);
      setNextCursor(res.nextCursor ?? null);
      setTotal(res.total ?? total);
    } catch (_e) {
      // swallow; keep existing
    } finally {
      setLoadingMore(false);
    }
  };

  const rowPadding = density === 'compact' ? 'py-2' : 'py-4';

  const addFilter = (column: string, value: string) => {
    setFilters({ ...filters, [column]: value });
  };

  const removeFilter = (column: string) => {
    const newFilters = { ...filters };
    delete newFilters[column];
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 style={{ color: 'var(--text-high)' }}>Table</h2>
            <p style={{ color: 'var(--text-med)', fontSize: 'var(--text-meta)', marginTop: '4px' }}>
              Power view with inline filtering
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDensity('compact')}
              className="px-3 py-2 rounded-lg transition-colors"
              style={{
                background: density === 'compact' ? 'var(--surface-2)' : 'transparent',
                border: `1px solid ${density === 'compact' ? 'var(--stroke-high)' : 'var(--stroke-low)'}`,
                color: density === 'compact' ? 'var(--text-high)' : 'var(--text-med)',
                fontSize: 'var(--text-meta)'
              }}
            >
              Compact
            </button>
            <button
              onClick={() => setDensity('comfortable')}
              className="px-3 py-2 rounded-lg transition-colors"
              style={{
                background: density === 'comfortable' ? 'var(--surface-2)' : 'transparent',
                border: `1px solid ${density === 'comfortable' ? 'var(--stroke-high)' : 'var(--stroke-low)'}`,
                color: density === 'comfortable' ? 'var(--text-high)' : 'var(--text-med)',
                fontSize: 'var(--text-meta)'
              }}
            >
              Comfortable
            </button>
          </div>
        </div>

        {/* Active Filters */}
        {Object.keys(filters).length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span style={{ fontSize: 'var(--text-meta)', color: 'var(--text-subtle)' }}>
              Active filters:
            </span>
            {Object.entries(filters).map(([column, value]) => (
              <div
                key={column}
                className="px-3 py-1 rounded-full flex items-center gap-2"
                style={{
                  background: 'var(--brand-cyan)20',
                  border: '1px solid var(--brand-cyan)40',
                  fontSize: 'var(--text-meta)',
                  color: 'var(--brand-cyan)'
                }}
              >
                <span>{column}: {value}</span>
                <button onClick={() => removeFilter(column)} className="hover:opacity-70">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters and hint */}
      <div className="flex items-center gap-3 mb-3">
        <TableFilters value={filters} onChange={setFilters} />
        <div className="ml-auto" style={{ color: 'var(--text-med)', fontSize: 'var(--text-meta)' }}>
          {total != null ? `Showing ${rows.length}${nextCursor ? '+' : ''} of ${total}` : `Showing ${rows.length}`}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6">
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--stroke-low)' }}>
          <table className="w-full" style={{ background: 'var(--surface-1)' }}>
            <thead className="sticky top-0 z-10" style={{ background: 'var(--surface-2)' }}>
              <tr style={{ borderBottom: '1px solid var(--stroke-med)' }}>
                <th className="px-4 py-3 text-left" style={{ fontSize: 'var(--text-meta)', color: 'var(--text-med)' }}>
                  ID
                </th>
                <th className="px-4 py-3 text-left" style={{ fontSize: 'var(--text-meta)', color: 'var(--text-med)' }}>
                  Title
                </th>
                <th className="px-4 py-3 text-left" style={{ fontSize: 'var(--text-meta)', color: 'var(--text-med)' }}>
                  <div className="flex items-center gap-1">
                    Category
                    <ChevronDown size={14} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left" style={{ fontSize: 'var(--text-meta)', color: 'var(--text-med)' }}>
                  <div className="flex items-center gap-1">
                    Priority
                    <ChevronDown size={14} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left" style={{ fontSize: 'var(--text-meta)', color: 'var(--text-med)' }}>
                  <div className="flex items-center gap-1">
                    Status
                    <ChevronDown size={14} />
                  </div>
                </th>
                <th className="px-4 py-3 text-left" style={{ fontSize: 'var(--text-meta)', color: 'var(--text-med)' }}>
                  Assignee
                </th>
                <th className="px-4 py-3 text-left" style={{ fontSize: 'var(--text-meta)', color: 'var(--text-med)' }}>
                  Labels
                </th>
                <th className="px-4 py-3 text-left" style={{ fontSize: 'var(--text-meta)', color: 'var(--text-med)' }}>
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {(rows).map((row, index) => (
                <tr
                  key={row.id}
                  className={`cursor-pointer transition-colors ${rowPadding}`}
                  style={{
                    borderBottom: '1px solid var(--stroke-low)',
                    background: focusedRow === index ? 'var(--surface-2)' : 'transparent',
                    outline: focusedRow === index ? '2px solid var(--focus-ring)' : 'none',
                    outlineOffset: '-2px'
                  }}
                  onFocus={() => setFocusedRow(index)}
                  onBlur={() => setFocusedRow(null)}
                  tabIndex={0}
                >
                  <td className="px-4" style={{ fontSize: 'var(--text-meta)', color: 'var(--text-subtle)' }}>
                    {row.id}
                  </td>
                  <td className="px-4" style={{ fontSize: 'var(--text-base)', color: 'var(--text-high)' }}>
                    {row.title}
                  </td>
                  <td className="px-4">
                    <div
                      className="px-2 py-1 rounded-md inline-block"
                      style={{
                        background: 'var(--surface-3)',
                        fontSize: 'var(--text-micro)',
                        color: 'var(--text-med)'
                      }}
                    >
                      {row.category}
                    </div>
                  </td>
                  <td className="px-4">
                    <PriorityBadge priority={row.priority} />
                  </td>
                  <td className="px-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, var(--brand-cyan), var(--brand-violet))',
                        fontSize: 'var(--text-micro)',
                        color: 'var(--surface-0)'
                      }}
                    >
                      {row.assignee}
                    </div>
                  </td>
                  <td className="px-4">
                    <div className="flex gap-1">
                      {row.labels.slice(0, 2).map((label) => (
                        <div
                          key={label}
                          className="px-2 py-0.5 rounded"
                          style={{
                            background: 'var(--surface-3)',
                            fontSize: 'var(--text-micro)',
                            color: 'var(--text-subtle)'
                          }}
                        >
                          {label}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4" style={{ fontSize: 'var(--text-meta)', color: 'var(--text-subtle)' }}>
                    {row.updated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {nextCursor && (
          <div className="flex justify-center py-4">
            <button
              onClick={loadMore}
              className="px-4 py-2 rounded-lg"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--stroke-high)',
                color: 'var(--text-high)',
                fontSize: 'var(--text-meta)'
              }}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors = {
    critical: 'var(--accent-danger)',
    high: 'var(--accent-warning)',
    medium: 'var(--accent-info)',
    low: 'var(--text-subtle)'
  };

  const color = colors[priority as keyof typeof colors];

  return (
    <div
      className="px-2 py-1 rounded-md inline-block"
      style={{
        background: color + '20',
        border: `1px solid ${color}40`,
        fontSize: 'var(--text-micro)',
        color: color
      }}
    >
      {priority}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    'Backlog': 'var(--text-subtle)',
    'To Do': 'var(--accent-info)',
    'In Progress': 'var(--brand-cyan)',
    'Review': 'var(--brand-violet)',
    'Done': 'var(--accent-success)'
  };

  const color = colors[status as keyof typeof colors] || 'var(--text-subtle)';

  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ background: color }} />
      <span style={{ fontSize: 'var(--text-meta)', color: 'var(--text-med)' }}>
        {status}
      </span>
    </div>
  );
}
