import { X, FileText, GitBranch, Activity, Paperclip } from 'lucide-react';
import { useState } from 'react';

const mockIssue = {
  id: 'PRISM-247',
  title: 'Glass effect performance regression',
  category: 'Performance',
  priority: 'critical',
  status: 'In Progress',
  assignee: 'JD',
  created: 'Oct 15, 2025',
  updated: '1 hour ago',
  description: 'The glass morphism effect on the command palette is causing frame drops on lower-end devices. Need to investigate backdrop-filter performance.',
  notesForAgents: {
    details: 'Focus on backdrop-filter optimization. Consider feature detection and fallback to matte surface/2 variant on devices with poor GPU performance.',
    testStrategy: 'Test on various devices with Chrome DevTools Performance monitor. Target 60fps minimum. Use reduced-motion as fallback.'
  },
  dependencies: [
    { id: 'PRISM-189', title: 'Focus ring missing on custom dropdown', status: 'In Progress' },
    { id: 'PRISM-301', title: 'Motion animation stuck in reduced-motion mode', status: 'In Progress' }
  ],
  activity: [
    { user: 'JD', action: 'Updated status to In Progress', time: '1 hour ago' },
    { user: 'TR', action: 'Added comment about GPU detection', time: '2 hours ago' },
    { user: 'AK', action: 'Linked PR #342', time: '3 hours ago' }
  ]
};

export default function Inspector({ onClose, useGlass = false }: { onClose?: () => void; useGlass?: boolean }) {
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div 
      className="w-full h-full flex flex-col"
      style={{ 
        background: useGlass ? 'var(--glass-bg)' : 'var(--surface-1)',
        border: `1px solid ${useGlass ? 'var(--glass-stroke)' : 'var(--stroke-low)'}`,
        backdropFilter: useGlass ? 'blur(16px)' : 'none'
      }}
    >
      {/* Header */}
      <div 
        className="p-6 flex items-start justify-between sticky top-0 z-10"
        style={{ 
          background: useGlass ? 'var(--glass-bg)' : 'var(--surface-2)',
          borderBottom: `1px solid ${useGlass ? 'var(--glass-stroke)' : 'var(--stroke-med)'}`,
          backdropFilter: useGlass ? 'blur(16px)' : 'none'
        }}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span style={{ fontSize: 'var(--text-meta)', color: 'var(--text-subtle)' }}>
              {mockIssue.id}
            </span>
            <PriorityBadge priority={mockIssue.priority} />
            <StatusBadge status={mockIssue.status} />
          </div>
          <h3 style={{ color: 'var(--text-high)', marginBottom: '8px' }}>{mockIssue.title}</h3>
          <div className="flex items-center gap-4" style={{ fontSize: 'var(--text-meta)', color: 'var(--text-subtle)' }}>
            <span>Created {mockIssue.created}</span>
            <span>•</span>
            <span>Updated {mockIssue.updated}</span>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-surface-2 transition-colors"
            style={{ color: 'var(--text-subtle)' }}
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div 
        className="flex gap-1 px-6 pt-4"
        style={{ borderBottom: '1px solid var(--stroke-low)' }}
      >
        <Tab icon={FileText} label="Summary" id="summary" active={activeTab === 'summary'} onClick={setActiveTab} />
        <Tab icon={FileText} label="Notes for Agents" id="notes" active={activeTab === 'notes'} onClick={setActiveTab} />
        <Tab icon={GitBranch} label="Dependencies" id="dependencies" active={activeTab === 'dependencies'} onClick={setActiveTab} />
        <Tab icon={Activity} label="Activity" id="activity" active={activeTab === 'activity'} onClick={setActiveTab} />
        <Tab icon={Paperclip} label="Attachments" id="attachments" active={activeTab === 'attachments'} onClick={setActiveTab} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'summary' && <SummaryTab issue={mockIssue} />}
        {activeTab === 'notes' && <NotesTab notes={mockIssue.notesForAgents} />}
        {activeTab === 'dependencies' && <DependenciesTab dependencies={mockIssue.dependencies} />}
        {activeTab === 'activity' && <ActivityTab activity={mockIssue.activity} />}
        {activeTab === 'attachments' && <EmptyTab message="No attachments yet" />}
      </div>
    </div>
  );
}

function Tab({ icon: Icon, label, id, active, onClick }: any) {
  return (
    <button
      onClick={() => onClick(id)}
      className="px-4 py-2 rounded-t-lg transition-colors flex items-center gap-2"
      style={{
        background: active ? 'var(--surface-2)' : 'transparent',
        borderBottom: active ? '2px solid var(--brand-cyan)' : '2px solid transparent',
        color: active ? 'var(--text-high)' : 'var(--text-med)',
        fontSize: 'var(--text-meta)'
      }}
    >
      <Icon size={16} />
      {label}
    </button>
  );
}

function SummaryTab({ issue }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h4 style={{ color: 'var(--text-high)', marginBottom: '12px' }}>Description</h4>
        <p style={{ color: 'var(--text-med)', fontSize: 'var(--text-base)', lineHeight: 1.6 }}>
          {issue.description}
        </p>
      </div>

      <div>
        <h4 style={{ color: 'var(--text-high)', marginBottom: '12px' }}>Details</h4>
        <div className="space-y-3">
          <DetailRow label="Category" value={issue.category} />
          <DetailRow label="Assignee" value={issue.assignee} />
          <DetailRow label="Priority" value={issue.priority} />
          <DetailRow label="Status" value={issue.status} />
        </div>
      </div>
    </div>
  );
}

function NotesTab({ notes }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h4 style={{ color: 'var(--text-high)', marginBottom: '12px' }}>Details</h4>
        <div 
          className="p-4 rounded-lg"
          style={{ 
            background: 'var(--surface-2)',
            border: '1px solid var(--stroke-low)',
            fontSize: 'var(--text-base)',
            color: 'var(--text-med)',
            lineHeight: 1.6
          }}
        >
          {notes.details}
        </div>
      </div>

      <div>
        <h4 style={{ color: 'var(--text-high)', marginBottom: '12px' }}>Test Strategy</h4>
        <div 
          className="p-4 rounded-lg font-mono"
          style={{ 
            background: 'var(--surface-2)',
            border: '1px solid var(--stroke-low)',
            fontSize: 'var(--text-meta)',
            color: 'var(--text-med)',
            lineHeight: 1.6
          }}
        >
          {notes.testStrategy}
        </div>
      </div>
    </div>
  );
}

function DependenciesTab({ dependencies }: any) {
  return (
    <div className="space-y-3">
      {dependencies.map((dep: any) => (
        <div
          key={dep.id}
          className="p-4 rounded-lg cursor-pointer hover:translate-y-[-1px] transition-all"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--stroke-med)'
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span style={{ fontSize: 'var(--text-meta)', color: 'var(--text-subtle)' }}>
              {dep.id}
            </span>
            <StatusBadge status={dep.status} />
          </div>
          <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-high)' }}>
            {dep.title}
          </p>
        </div>
      ))}
    </div>
  );
}

function ActivityTab({ activity }: any) {
  return (
    <div className="space-y-4">
      {activity.map((item: any, index: number) => (
        <div key={index} className="flex gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, var(--brand-cyan), var(--brand-violet))',
              fontSize: 'var(--text-micro)',
              color: 'var(--surface-0)'
            }}
          >
            {item.user}
          </div>
          <div className="flex-1">
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-high)' }}>
              <span style={{ fontWeight: 500 }}>{item.user}</span> {item.action}
            </p>
            <p style={{ fontSize: 'var(--text-meta)', color: 'var(--text-subtle)', marginTop: '4px' }}>
              {item.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyTab({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <p style={{ color: 'var(--text-subtle)', fontSize: 'var(--text-meta)' }}>
        {message}
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-4">
      <span style={{ fontSize: 'var(--text-meta)', color: 'var(--text-subtle)', minWidth: '100px' }}>
        {label}
      </span>
      <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-med)' }}>
        {value}
      </span>
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
      className="px-2 py-1 rounded-md"
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
