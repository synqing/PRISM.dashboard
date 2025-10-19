import { Check, ChevronRight, Play } from 'lucide-react';
import { useState } from 'react';

const steps = [
  {
    id: 'parse',
    title: 'Parse PRD',
    description: 'Extract requirements and user stories',
    status: 'completed',
    diff: {
      before: '// No structured data',
      after: '{\n  "features": ["Glass morphism", "Dark theme"],\n  "constraints": ["WCAG AA", "60fps"]\n}'
    }
  },
  {
    id: 'analyze',
    title: 'Analyze Complexity',
    description: 'Estimate effort and identify risks',
    status: 'completed',
    diff: {
      before: '// No analysis',
      after: '{\n  "complexity": "medium",\n  "risks": ["Performance on low-end devices"],\n  "estimate": "8 story points"\n}'
    }
  },
  {
    id: 'expand',
    title: 'Expand',
    description: 'Generate detailed implementation plan',
    status: 'in-progress',
    useResearch: false,
    diff: {
      before: '// Basic plan',
      after: '{\n  "tasks": [\n    "Implement glass tokens",\n    "Add backdrop-filter with fallback",\n    "Test on target devices"\n  ]\n}'
    }
  },
  {
    id: 'validate',
    title: 'Validate Dependencies',
    description: 'Check for conflicts and blockers',
    status: 'pending',
    diff: null
  },
  {
    id: 'generate',
    title: 'Generate Files',
    description: 'Create implementation files',
    status: 'pending',
    diff: null
  }
];

export default function PlanTM() {
  const [stepStates, setStepStates] = useState(steps);
  const [expandedStep, setExpandedStep] = useState<string | null>('expand');

  const applyStep = (id: string) => {
    // Success glint animation would trigger here
    setStepStates(stepStates.map(step => 
      step.id === id ? { ...step, status: 'completed' } : step
    ));
  };

  return (
    <div className="p-8 overflow-auto h-full">
      <div className="mb-6">
        <h2 style={{ color: 'var(--text-high)' }}>Plan — TM Chain</h2>
        <p style={{ color: 'var(--text-med)', fontSize: 'var(--text-meta)', marginTop: '4px' }}>
          Safe application of temporal sequencing model
        </p>
      </div>

      <div className="max-w-4xl space-y-4">
        {stepStates.map((step, index) => (
          <Step 
            key={step.id}
            step={step}
            index={index + 1}
            isExpanded={expandedStep === step.id}
            onToggle={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
            onApply={() => applyStep(step.id)}
          />
        ))}
      </div>
    </div>
  );
}

function Step({ step, index, isExpanded, onToggle, onApply }: any) {
  const statusColors = {
    completed: 'var(--accent-success)',
    'in-progress': 'var(--brand-cyan)',
    pending: 'var(--text-subtle)'
  };

  const statusColor = statusColors[step.status as keyof typeof statusColors];

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: 'var(--surface-1)',
        border: `1px solid ${step.status === 'in-progress' ? 'var(--brand-cyan)' : 'var(--stroke-low)'}`
      }}
    >
      {/* Step Header */}
      <div
        className="p-5 flex items-center gap-4 cursor-pointer"
        onClick={onToggle}
      >
        {/* Status Circle */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background: statusColor + '20',
            border: `2px solid ${statusColor}`
          }}
        >
          {step.status === 'completed' ? (
            <Check size={16} style={{ color: statusColor }} />
          ) : (
            <span style={{ fontSize: 'var(--text-meta)', color: statusColor }}>
              {index}
            </span>
          )}
        </div>

        {/* Step Info */}
        <div className="flex-1">
          <h4 style={{ color: 'var(--text-high)', marginBottom: '4px' }}>
            {step.title}
          </h4>
          <p style={{ fontSize: 'var(--text-meta)', color: 'var(--text-subtle)' }}>
            {step.description}
          </p>
        </div>

        {/* Expand Icon */}
        <ChevronRight
          size={20}
          style={{
            color: 'var(--text-subtle)',
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)',
            transition: 'transform 200ms'
          }}
        />
      </div>

      {/* Expanded Content */}
      {isExpanded && step.diff && (
        <div className="px-5 pb-5 space-y-4">
          {/* Toggle for research model */}
          {step.id === 'expand' && (
            <div className="flex items-center gap-3 p-3 rounded-lg" style={{ background: 'var(--surface-2)' }}>
              <input
                type="checkbox"
                id="use-research"
                className="w-4 h-4"
                checked={step.useResearch}
                onChange={() => {}}
              />
              <label
                htmlFor="use-research"
                style={{ fontSize: 'var(--text-meta)', color: 'var(--text-med)', cursor: 'pointer' }}
              >
                Use research model (slower, higher quality)
              </label>
            </div>
          )}

          {/* Diff Preview */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p style={{ fontSize: 'var(--text-meta)', color: 'var(--text-subtle)', marginBottom: '8px' }}>
                Before
              </p>
              <pre
                className="p-4 rounded-lg overflow-auto"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--stroke-low)',
                  fontSize: 'var(--text-meta)',
                  color: 'var(--text-med)',
                  fontFamily: 'monospace'
                }}
              >
                {step.diff.before}
              </pre>
            </div>
            <div>
              <p style={{ fontSize: 'var(--text-meta)', color: 'var(--text-subtle)', marginBottom: '8px' }}>
                After
              </p>
              <pre
                className="p-4 rounded-lg overflow-auto"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--accent-success)40',
                  fontSize: 'var(--text-meta)',
                  color: 'var(--text-med)',
                  fontFamily: 'monospace'
                }}
              >
                {step.diff.after}
              </pre>
            </div>
          </div>

          {/* Apply Button */}
          {step.status !== 'completed' && (
            <div className="flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApply();
                }}
                className="px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 hover:translate-y-[-1px]"
                style={{
                  background: 'var(--brand-cyan)',
                  color: 'var(--surface-0)',
                  fontSize: 'var(--text-base)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Play size={16} />
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
