import { Zap, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react';
import { useState } from 'react';

const automations = [
  {
    id: '1',
    name: 'PR Merged → Update Issues',
    description: 'When a PR is merged, transition all linked issues to Done',
    enabled: true,
    trigger: 'PR merged',
    conditions: ['Has linked issues', 'PR approved'],
    actions: ['Transition to Done', 'Add comment', 'Notify watchers'],
    scope: 'All projects'
  },
  {
    id: '2',
    name: 'Blocked > 48h → Alert',
    description: 'Send notification when an issue is blocked for more than 48 hours',
    enabled: true,
    trigger: 'Issue blocked',
    conditions: ['Duration > 48h', 'Has assignee'],
    actions: ['Notify owner', 'Notify watchers', 'Add to exceptions'],
    scope: 'Active sprints'
  },
  {
    id: '3',
    name: 'WIP Breach → Warn',
    description: 'Warn team when a column exceeds WIP limit',
    enabled: true,
    trigger: 'Card moved',
    conditions: ['Column over WIP limit'],
    actions: ['Slack notification', 'Dashboard alert'],
    scope: 'Board view'
  },
  {
    id: '4',
    name: 'Critical Priority → Escalate',
    description: 'Auto-escalate critical priority issues to team leads',
    enabled: false,
    trigger: 'Priority changed',
    conditions: ['Priority = Critical', 'Status ≠ Done'],
    actions: ['Notify tech lead', 'Pin to top', 'Add urgent label'],
    scope: 'All projects'
  }
];

export default function Automations() {
  const [automationStates, setAutomationStates] = useState(automations);

  const toggleAutomation = (id: string) => {
    setAutomationStates(automationStates.map(auto =>
      auto.id === id ? { ...auto, enabled: !auto.enabled } : auto
    ));
  };

  return (
    <div className="p-8 overflow-auto h-full">
      <div className="mb-6">
        <h2 style={{ color: 'var(--text-high)' }}>Automations</h2>
        <p style={{ color: 'var(--text-med)', fontSize: 'var(--text-meta)', marginTop: '4px' }}>
          Trigger → Conditions → Actions
        </p>
      </div>

      <div className="max-w-5xl space-y-4">
        {automationStates.map((automation) => (
          <AutomationCard
            key={automation.id}
            automation={automation}
            onToggle={() => toggleAutomation(automation.id)}
          />
        ))}
      </div>
    </div>
  );
}

function AutomationCard({ automation, onToggle }: any) {
  return (
    <div
      className="p-6 rounded-xl transition-all duration-200"
      style={{
        background: 'var(--surface-1)',
        border: `1px solid ${automation.enabled ? 'var(--brand-cyan)40' : 'var(--stroke-low)'}`,
        opacity: automation.enabled ? 1 : 0.7
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: automation.enabled ? 'var(--brand-cyan)20' : 'var(--surface-2)',
              color: automation.enabled ? 'var(--brand-cyan)' : 'var(--text-subtle)'
            }}
          >
            <Zap size={20} />
          </div>
          <div className="flex-1">
            <h3 style={{ color: 'var(--text-high)', marginBottom: '4px' }}>
              {automation.name}
            </h3>
            <p style={{ fontSize: 'var(--text-meta)', color: 'var(--text-med)', lineHeight: 1.5 }}>
              {automation.description}
            </p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="flex-shrink-0 ml-4"
          style={{ color: automation.enabled ? 'var(--brand-cyan)' : 'var(--text-subtle)' }}
        >
          {automation.enabled ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
        </button>
      </div>

      {/* Flow */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Trigger */}
        <Chip label={automation.trigger} color="var(--accent-info)" icon="trigger" />
        
        <ChevronRight size={16} style={{ color: 'var(--text-subtle)' }} />
        
        {/* Conditions */}
        <div className="flex items-center gap-2 flex-wrap">
          {automation.conditions.map((condition: string, index: number) => (
            <Chip key={index} label={condition} color="var(--accent-warning)" icon="condition" />
          ))}
        </div>
        
        <ChevronRight size={16} style={{ color: 'var(--text-subtle)' }} />
        
        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {automation.actions.map((action: string, index: number) => (
            <Chip key={index} label={action} color="var(--accent-success)" icon="action" />
          ))}
        </div>
      </div>

      {/* Scope */}
      <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--stroke-low)' }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 'var(--text-meta)', color: 'var(--text-subtle)' }}>
            Scope:
          </span>
          <span
            className="px-2 py-1 rounded-md"
            style={{
              background: 'var(--surface-2)',
              fontSize: 'var(--text-meta)',
              color: 'var(--text-med)'
            }}
          >
            {automation.scope}
          </span>
        </div>
      </div>
    </div>
  );
}

function Chip({ label, color, icon }: { label: string; color: string; icon: string }) {
  return (
    <div
      className="px-3 py-1.5 rounded-md"
      style={{
        background: color + '20',
        border: `1px solid ${color}40`,
        fontSize: 'var(--text-meta)',
        color: color
      }}
    >
      {label}
    </div>
  );
}
