import { Search, FileText, Layers, Table, Settings, Plus, Link, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const commands = [
  { id: '1', icon: Layers, label: 'Go to Board', category: 'Navigate', action: 'board' },
  { id: '2', icon: Table, label: 'Go to Table', category: 'Navigate', action: 'table' },
  { id: '3', icon: FileText, label: 'Go to Overview', category: 'Navigate', action: 'overview' },
  { id: '4', icon: Settings, label: 'Go to Automations', category: 'Navigate', action: 'automations' },
  { id: '5', icon: Plus, label: 'Create New Issue', category: 'Actions', action: 'create' },
  { id: '6', icon: Link, label: 'Link PR', category: 'Actions', action: 'link-pr' },
  { id: '7', icon: ArrowRight, label: 'Run TM Parse', category: 'TM', action: 'tm-parse' },
  { id: '8', icon: ArrowRight, label: 'Run TM Expand', category: 'TM', action: 'tm-expand' },
];

export default function SearchPalette({ isOpen, onClose, useGlass = true }: { isOpen: boolean; onClose: () => void; useGlass?: boolean }) {
  const [search, setSearch] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch('');
      setFocusedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        // Execute command
        onClose();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands.length, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-32"
      style={{ background: 'var(--overlay-scrim)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-xl overflow-hidden animate-in"
        style={{
          background: useGlass ? 'var(--glass-bg)' : 'var(--surface-2)',
          border: `1px solid ${useGlass ? 'var(--glass-stroke)' : 'var(--stroke-med)'}`,
          backdropFilter: useGlass ? 'blur(16px)' : 'none',
          boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
          animation: 'slideIn 200ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glass highlight */}
        {useGlass && (
          <div
            className="absolute top-0 left-0 w-48 h-48 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle at top left, rgba(255, 255, 255, 0.12), transparent)'
            }}
          />
        )}

        {/* Search Input */}
        <div className="p-4 flex items-center gap-3" style={{ borderBottom: '1px solid var(--stroke-low)' }}>
          <Search size={20} style={{ color: 'var(--text-subtle)' }} />
          <input
            type="text"
            placeholder="Search commands or jump to..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent outline-none"
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--text-high)',
              border: 'none'
            }}
          />
          <div
            className="px-2 py-1 rounded"
            style={{
              background: 'var(--surface-3)',
              fontSize: 'var(--text-micro)',
              color: 'var(--text-subtle)'
            }}
          >
            ESC
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center">
              <p style={{ color: 'var(--text-subtle)', fontSize: 'var(--text-meta)' }}>
                No commands found
              </p>
            </div>
          ) : (
            <div className="p-2">
              {filteredCommands.map((cmd, index) => (
                <CommandItem
                  key={cmd.id}
                  command={cmd}
                  isFocused={index === focusedIndex}
                  onClick={onClose}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-3 flex items-center justify-between"
          style={{
            borderTop: '1px solid var(--stroke-low)',
            fontSize: 'var(--text-micro)',
            color: 'var(--text-subtle)'
          }}
        >
          <div className="flex items-center gap-4">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd
              className="px-2 py-1 rounded"
              style={{ background: 'var(--surface-3)' }}
            >
              ⌘K
            </kbd>
            <span>to toggle</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

function CommandItem({ command, isFocused, onClick }: any) {
  const Icon = command.icon;

  return (
    <div
      className="p-3 rounded-lg cursor-pointer transition-all duration-150 flex items-center gap-3"
      style={{
        background: isFocused ? 'var(--surface-3)' : 'transparent',
        outline: isFocused ? '2px solid var(--focus-ring)' : 'none',
        outlineOffset: '-2px'
      }}
      onClick={onClick}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{
          background: 'var(--brand-cyan)20',
          color: 'var(--brand-cyan)'
        }}
      >
        <Icon size={16} />
      </div>
      <div className="flex-1">
        <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-high)' }}>
          {command.label}
        </p>
        <p style={{ fontSize: 'var(--text-micro)', color: 'var(--text-subtle)' }}>
          {command.category}
        </p>
      </div>
    </div>
  );
}
