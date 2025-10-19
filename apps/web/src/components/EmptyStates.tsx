import { Inbox, Loader2 } from 'lucide-react';

export default function EmptyStates() {
  return (
    <div className="p-8 overflow-auto h-full">
      <div className="mb-6">
        <h2 style={{ color: 'var(--text-high)' }}>Empty States & Loading</h2>
        <p style={{ color: 'var(--text-med)', fontSize: 'var(--text-meta)', marginTop: '4px' }}>
          Clear guidance and predictable skeletons
        </p>
      </div>

      <div className="space-y-12 max-w-5xl">
        {/* Empty State */}
        <section>
          <h3 style={{ color: 'var(--text-high)', marginBottom: '16px' }}>Empty State</h3>
          <div
            className="p-12 rounded-xl flex flex-col items-center justify-center text-center"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--stroke-low)',
              minHeight: '320px'
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text-subtle)'
              }}
            >
              <Inbox size={32} />
            </div>
            <h3 style={{ color: 'var(--text-high)', marginBottom: '8px' }}>
              No issues yet
            </h3>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-med)', marginBottom: '24px', maxWidth: '400px' }}>
              Get started by creating your first issue or importing from another tool
            </p>
            <div className="flex gap-3">
              <button
                className="px-4 py-2 rounded-lg transition-all duration-200 hover:translate-y-[-1px]"
                style={{
                  background: 'var(--brand-cyan)',
                  color: 'var(--surface-0)',
                  fontSize: 'var(--text-base)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Create Issue
              </button>
              <button
                className="px-4 py-2 rounded-lg transition-all duration-200 hover:translate-y-[-1px]"
                style={{
                  background: 'var(--surface-2)',
                  color: 'var(--text-high)',
                  fontSize: 'var(--text-base)',
                  border: '1px solid var(--stroke-med)',
                  cursor: 'pointer'
                }}
              >
                Import Issues
              </button>
            </div>
          </div>
        </section>

        {/* Skeleton Loading - Cards */}
        <section>
          <h3 style={{ color: 'var(--text-high)', marginBottom: '16px' }}>Skeleton — Card List</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </section>

        {/* Skeleton Loading - Table */}
        <section>
          <h3 style={{ color: 'var(--text-high)', marginBottom: '16px' }}>Skeleton — Table Rows</h3>
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--stroke-low)' }}
          >
            <div className="p-4 flex gap-4" style={{ borderBottom: '1px solid var(--stroke-low)' }}>
              <div className="h-4 w-20 rounded" style={{ background: 'var(--surface-2)' }} />
              <div className="h-4 flex-1 rounded" style={{ background: 'var(--surface-2)' }} />
              <div className="h-4 w-32 rounded" style={{ background: 'var(--surface-2)' }} />
              <div className="h-4 w-24 rounded" style={{ background: 'var(--surface-2)' }} />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 flex gap-4" style={{ borderBottom: '1px solid var(--stroke-low)' }}>
                <div className="h-4 w-20 rounded" style={{ background: 'var(--surface-2)' }} />
                <div className="h-4 flex-1 rounded" style={{ background: 'var(--surface-2)' }} />
                <div className="h-4 w-32 rounded" style={{ background: 'var(--surface-2)' }} />
                <div className="h-4 w-24 rounded" style={{ background: 'var(--surface-2)' }} />
              </div>
            ))}
          </div>
        </section>

        {/* Spinner */}
        <section>
          <h3 style={{ color: 'var(--text-high)', marginBottom: '16px' }}>Spinner — Element Level</h3>
          <div
            className="p-12 rounded-xl flex items-center justify-center"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--stroke-low)'
            }}
          >
            <Loader2 className="animate-spin" size={32} style={{ color: 'var(--brand-cyan)' }} />
          </div>
        </section>

        {/* Progress */}
        <section>
          <h3 style={{ color: 'var(--text-high)', marginBottom: '16px' }}>Progress Bar</h3>
          <div
            className="p-6 rounded-xl"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--stroke-low)'
            }}
          >
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 'var(--text-meta)', color: 'var(--text-med)' }}>
                    Processing files...
                  </span>
                  <span style={{ fontSize: 'var(--text-meta)', color: 'var(--text-subtle)' }}>
                    67%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: 'var(--surface-2)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: '67%',
                      background: 'linear-gradient(90deg, var(--brand-cyan), var(--brand-violet))'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reduced Motion Note */}
        <section
          className="p-6 rounded-xl"
          style={{
            background: 'var(--accent-info)10',
            border: '1px solid var(--accent-info)40'
          }}
        >
          <h4 style={{ color: 'var(--accent-info)', marginBottom: '8px' }}>
            Reduced Motion
          </h4>
          <p style={{ fontSize: 'var(--text-meta)', color: 'var(--text-med)', lineHeight: 1.6 }}>
            Under <code style={{ background: 'var(--surface-2)', padding: '2px 6px', borderRadius: '4px' }}>prefers-reduced-motion</code>, 
            shimmer animations are disabled and replaced with opacity reveals. Skeletons remain static.
          </p>
        </section>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="p-5 rounded-xl"
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--stroke-low)'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="h-3 w-24 rounded" style={{ background: 'var(--surface-3)' }} />
        <div className="h-6 w-16 rounded" style={{ background: 'var(--surface-3)' }} />
      </div>
      <div className="h-4 w-full rounded mb-2" style={{ background: 'var(--surface-3)' }} />
      <div className="h-4 w-2/3 rounded mb-4" style={{ background: 'var(--surface-3)' }} />
      <div className="flex gap-2">
        <div className="h-6 w-20 rounded" style={{ background: 'var(--surface-3)' }} />
        <div className="h-6 w-16 rounded" style={{ background: 'var(--surface-3)' }} />
      </div>
    </div>
  );
}
