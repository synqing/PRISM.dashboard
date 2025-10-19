import { MoreHorizontal, AlertTriangle } from 'lucide-react';

const columns = [
  { id: 'backlog', title: 'Backlog', wipLimit: null, count: 12 },
  { id: 'todo', title: 'To Do', wipLimit: 5, count: 4 },
  { id: 'in-progress', title: 'In Progress', wipLimit: 3, count: 4 },
  { id: 'review', title: 'Review', wipLimit: 4, count: 3 },
  { id: 'done', title: 'Done', wipLimit: null, count: 28 }
];

const cards = {
  backlog: [
    { id: 'PRISM-312', title: 'Add keyboard shortcuts for board navigation', category: 'Accessibility', priority: 'medium', status: 'backlog', assignee: 'AK' },
    { id: 'PRISM-315', title: 'Implement auto-save for draft issues', category: 'Helpers', priority: 'low', status: 'backlog', assignee: null }
  ],
  todo: [
    { id: 'PRISM-289', title: 'Design empty state for new users', category: 'Onboarding', priority: 'high', status: 'todo', assignee: 'SL', hasPR: false },
    { id: 'PRISM-291', title: 'Create onboarding checklist component', category: 'Onboarding', priority: 'high', status: 'todo', assignee: 'MK', hasPR: false },
    { id: 'PRISM-294', title: 'Add tooltips to all icon-only buttons', category: 'Accessibility', priority: 'medium', status: 'todo', assignee: 'AK', hasPR: false }
  ],
  'in-progress': [
    { id: 'PRISM-247', title: 'Glass effect performance regression', category: 'Performance', priority: 'critical', status: 'in-progress', assignee: 'JD', hasPR: true },
    { id: 'PRISM-301', title: 'Motion animation stuck in reduced-motion mode', category: 'MotionVisuals', priority: 'high', status: 'in-progress', assignee: 'TR', hasPR: true },
    { id: 'PRISM-189', title: 'Focus ring missing on custom dropdown', category: 'Accessibility', priority: 'high', status: 'in-progress', assignee: 'AK', hasPR: false },
    { id: 'PRISM-278', title: 'Add telemetry for WIP breach events', category: 'MetricsAndTelemetry', priority: 'medium', status: 'in-progress', assignee: 'LC', hasPR: true }
  ],
  review: [
    { id: 'PRISM-256', title: 'Update error recovery documentation', category: 'DocumentationAndSpec', priority: 'medium', status: 'review', assignee: 'RM', hasPR: true },
    { id: 'PRISM-234', title: 'Standardize button taxonomy across app', category: 'TaxonomyAndNaming', priority: 'low', status: 'review', assignee: 'SL', hasPR: true },
    { id: 'PRISM-267', title: 'Implement skeleton loading for table', category: 'Performance', priority: 'high', status: 'review', assignee: 'JD', hasPR: true }
  ],
  done: []
};

export default function Board() {
  return (
    <div className="p-6 overflow-auto h-full">
      <div className="mb-6">
        <h2 style={{ color: 'var(--text-high)' }}>Board</h2>
        <p style={{ color: 'var(--text-med)', fontSize: 'var(--text-meta)', marginTop: '4px' }}>
          Kanban flow with WIP limits
        </p>
      </div>

      <div className="flex gap-4 pb-6" style={{ minWidth: 'fit-content' }}>
        {columns.map((column) => (
          <BoardColumn 
            key={column.id} 
            column={column}
            cards={cards[column.id as keyof typeof cards] || []}
          />
        ))}
      </div>
    </div>
  );
}

function BoardColumn({ column, cards }: { column: any; cards: any[] }) {
  const isOverLimit = column.wipLimit && cards.length > column.wipLimit;
  
  return (
    <div className="flex-shrink-0" style={{ width: '320px' }}>
      {/* Header */}
      <div 
        className="p-4 rounded-t-xl flex items-center justify-between"
        style={{ 
          background: 'var(--surface-1)',
          borderBottom: '1px solid var(--stroke-low)'
        }}
      >
        <div className="flex items-center gap-3">
          <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--text-high)' }}>
            {column.title}
          </h3>
          <span 
            className="px-2 py-0.5 rounded"
            style={{ 
              fontSize: 'var(--text-micro)',
              color: 'var(--text-subtle)',
              background: 'var(--surface-2)'
            }}
          >
            {cards.length}
          </span>
        </div>
        {column.wipLimit && (
          <div 
            className="px-2 py-0.5 rounded flex items-center gap-1"
            style={{ 
              fontSize: 'var(--text-micro)',
              background: isOverLimit ? 'rgba(239, 68, 68, 0.1)' : 'var(--surface-2)',
              border: `1px solid ${isOverLimit ? 'var(--accent-warning)' : 'var(--stroke-high)'}`,
              color: isOverLimit ? 'var(--accent-warning)' : 'var(--text-med)'
            }}
          >
            {isOverLimit && <AlertTriangle size={10} />}
            WIP {cards.length}/{column.wipLimit}
          </div>
        )}
      </div>

      {/* Cards */}
      <div 
        className="p-3 space-y-3 rounded-b-xl"
        style={{ 
          background: 'var(--surface-1)',
          minHeight: '400px'
        }}
      >
        {cards.map((card) => (
          <BoardCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

function BoardCard({ card }: { card: any }) {
  const priorityColors = {
    critical: 'var(--accent-danger)',
    high: 'var(--accent-warning)',
    medium: 'var(--accent-info)',
    low: 'var(--text-subtle)'
  };

  return (
    <div 
      className="p-4 rounded-xl cursor-pointer transition-all duration-200 hover:translate-y-[-2px] group"
      style={{ 
        background: 'var(--surface-2)',
        border: '1px solid var(--stroke-med)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
      }}
    >
      {/* ID & Menu */}
      <div className="flex items-center justify-between mb-3">
        <span style={{ fontSize: 'var(--text-micro)', color: 'var(--text-subtle)' }}>
          {card.id}
        </span>
        <button 
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-surface-3"
          style={{ color: 'var(--text-subtle)' }}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      {/* Title */}
      <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-high)', marginBottom: '12px', lineHeight: 1.4 }}>
        {card.title}
      </p>

      {/* Chips */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <div 
          className="px-2 py-1 rounded-md"
          style={{ 
            fontSize: 'var(--text-micro)',
            background: 'var(--surface-3)',
            color: 'var(--text-med)'
          }}
        >
          {card.category}
        </div>
        <div 
          className="px-2 py-1 rounded-md"
          style={{ 
            fontSize: 'var(--text-micro)',
            background: priorityColors[card.priority as keyof typeof priorityColors] + '20',
            color: priorityColors[card.priority as keyof typeof priorityColors],
            border: `1px solid ${priorityColors[card.priority as keyof typeof priorityColors]}40`
          }}
        >
          {card.priority}
        </div>
        {card.hasPR && (
          <div 
            className="px-2 py-1 rounded-md"
            style={{ 
              fontSize: 'var(--text-micro)',
              background: 'var(--brand-cyan)20',
              color: 'var(--brand-cyan)',
              border: '1px solid var(--brand-cyan)40'
            }}
          >
            PR
          </div>
        )}
      </div>

      {/* Assignee */}
      {card.assignee && (
        <div className="flex items-center gap-2">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ 
              background: 'linear-gradient(135deg, var(--brand-cyan), var(--brand-violet))',
              fontSize: 'var(--text-micro)',
              color: 'var(--surface-0)'
            }}
          >
            {card.assignee}
          </div>
        </div>
      )}
    </div>
  );
}
