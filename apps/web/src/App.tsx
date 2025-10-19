import { useState, useEffect } from 'react';
import { Layers, Table, FileText, Zap, GitBranch, Palette, Inbox, Search, Command } from 'lucide-react';
import DesignSystem from './components/DesignSystem';
import Overview from './components/Overview';
import Board from './components/Board';
import TableView from './components/Table';
import Inspector from './components/Inspector';
import PlanTM from './components/PlanTM';
import SearchPalette from './components/SearchPalette';
import Automations from './components/Automations';
import EmptyStates from './components/EmptyStates';

type View = 'design-system' | 'overview' | 'board' | 'table' | 'inspector' | 'plan-tm' | 'search-palette' | 'automations' | 'empty-states';

export default function App() {
  const [activeView, setActiveView] = useState<View>('design-system');
  const [showInspector, setShowInspector] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [useGlass, setUseGlass] = useState(true);

  // Command palette keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowPalette(!showPalette);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPalette]);

  return (
    <div className="flex h-screen" style={{ background: 'var(--surface-0)' }}>
      {/* Left Navigation */}
      <nav 
        className="w-64 flex flex-col"
        style={{ 
          background: 'var(--surface-1)',
          borderRight: '1px solid var(--stroke-low)'
        }}
      >
        {/* Logo */}
        <div className="p-6" style={{ borderBottom: '1px solid var(--stroke-low)' }}>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ 
                background: 'linear-gradient(135deg, var(--brand-cyan), var(--brand-violet))'
              }}
            >
              <Palette size={20} style={{ color: 'var(--surface-0)' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--text-title)', color: 'var(--text-high)' }}>
                PRISM
              </h1>
              <p style={{ fontSize: 'var(--text-micro)', color: 'var(--text-subtle)' }}>
                v1 Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-4 space-y-1 overflow-auto">
          <NavItem 
            icon={Palette} 
            label="Design System" 
            active={activeView === 'design-system'}
            onClick={() => setActiveView('design-system')}
          />
          <NavItem 
            icon={FileText} 
            label="Overview" 
            active={activeView === 'overview'}
            onClick={() => setActiveView('overview')}
          />
          <NavItem 
            icon={Layers} 
            label="Board" 
            active={activeView === 'board'}
            onClick={() => setActiveView('board')}
          />
          <NavItem 
            icon={Table} 
            label="Table" 
            active={activeView === 'table'}
            onClick={() => setActiveView('table')}
          />
          <NavItem 
            icon={Search} 
            label="Inspector" 
            active={activeView === 'inspector'}
            onClick={() => setActiveView('inspector')}
          />
          <NavItem 
            icon={GitBranch} 
            label="Plan — TM" 
            active={activeView === 'plan-tm'}
            onClick={() => setActiveView('plan-tm')}
          />
          <NavItem 
            icon={Command} 
            label="Search + Palette" 
            active={activeView === 'search-palette'}
            onClick={() => setActiveView('search-palette')}
          />
          <NavItem 
            icon={Zap} 
            label="Automations" 
            active={activeView === 'automations'}
            onClick={() => setActiveView('automations')}
          />
          <NavItem 
            icon={Inbox} 
            label="Empty States" 
            active={activeView === 'empty-states'}
            onClick={() => setActiveView('empty-states')}
          />
        </div>

        {/* Settings */}
        <div className="p-4 space-y-3" style={{ borderTop: '1px solid var(--stroke-low)' }}>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 'var(--text-meta)', color: 'var(--text-med)' }}>
              Glass Effects
            </span>
            <button
              onClick={() => setUseGlass(!useGlass)}
              className="relative w-11 h-6 rounded-full transition-colors"
              style={{ 
                background: useGlass ? 'var(--brand-cyan)' : 'var(--surface-3)' 
              }}
            >
              <div
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform"
                style={{
                  transform: useGlass ? 'translateX(22px)' : 'translateX(2px)'
                }}
              />
            </button>
          </div>
          <button
            onClick={() => setShowPalette(true)}
            className="w-full p-2 rounded-lg flex items-center justify-between transition-colors hover:bg-surface-2"
            style={{ 
              border: '1px solid var(--stroke-low)',
              fontSize: 'var(--text-meta)',
              color: 'var(--text-med)'
            }}
          >
            <span>Command Palette</span>
            <kbd
              className="px-2 py-0.5 rounded"
              style={{ 
                background: 'var(--surface-2)',
                fontSize: 'var(--text-micro)',
                color: 'var(--text-subtle)'
              }}
            >
              ⌘K
            </kbd>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {activeView === 'design-system' && <DesignSystem />}
        {activeView === 'overview' && <Overview />}
        {activeView === 'board' && <Board />}
        {activeView === 'table' && <TableView />}
        {activeView === 'inspector' && (
          <div className="h-full p-8">
            <div className="h-full max-w-2xl mx-auto">
              <Inspector useGlass={useGlass} />
            </div>
          </div>
        )}
        {activeView === 'plan-tm' && <PlanTM />}
        {activeView === 'search-palette' && (
          <div className="h-full flex items-center justify-center p-8">
            <div
              className="max-w-2xl p-12 rounded-xl text-center"
              style={{
                background: 'var(--surface-1)',
                border: '1px solid var(--stroke-low)'
              }}
            >
              <h3 style={{ color: 'var(--text-high)', marginBottom: '12px' }}>
                Command Palette
              </h3>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-med)', marginBottom: '24px' }}>
                Press <kbd className="px-2 py-1 rounded mx-1" style={{ background: 'var(--surface-2)' }}>⌘K</kbd> or <kbd className="px-2 py-1 rounded mx-1" style={{ background: 'var(--surface-2)' }}>Ctrl+K</kbd> to open the command palette overlay
              </p>
              <button
                onClick={() => setShowPalette(true)}
                className="px-6 py-3 rounded-lg transition-all duration-200 hover:translate-y-[-1px]"
                style={{
                  background: 'var(--brand-cyan)',
                  color: 'var(--surface-0)',
                  fontSize: 'var(--text-base)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Open Command Palette
              </button>
            </div>
          </div>
        )}
        {activeView === 'automations' && <Automations />}
        {activeView === 'empty-states' && <EmptyStates />}
      </main>

      {/* Command Palette Overlay */}
      <SearchPalette 
        isOpen={showPalette} 
        onClose={() => setShowPalette(false)}
        useGlass={useGlass}
      />
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full px-3 py-2 rounded-lg flex items-center gap-3 transition-all duration-200 hover:translate-x-1"
      style={{
        background: active ? 'var(--surface-2)' : 'transparent',
        color: active ? 'var(--text-high)' : 'var(--text-med)',
        border: active ? '1px solid var(--stroke-high)' : '1px solid transparent',
        fontSize: 'var(--text-base)',
        textAlign: 'left'
      }}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}
