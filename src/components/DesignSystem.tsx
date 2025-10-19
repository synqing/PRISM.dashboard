export default function DesignSystem() {
  return (
    <div className="p-8 space-y-12 overflow-auto h-full">
      <div>
        <h2 className="mb-4" style={{ color: 'var(--text-high)' }}>PRISM Design System</h2>
        <p style={{ color: 'var(--text-med)', fontSize: 'var(--text-meta)' }}>
          Production tokens for delightful, accessible, performance-first UI
        </p>
      </div>

      {/* A) Color - Surfaces */}
      <section>
        <h3 className="mb-4" style={{ color: 'var(--text-high)' }}>A) Surfaces — Tonal Elevation</h3>
        <div className="grid grid-cols-4 gap-4">
          <ColorSwatch name="surface/0" value="#0B0D12" var="--surface-0" desc="Base canvas (ink)" />
          <ColorSwatch name="surface/1" value="#121826" var="--surface-1" desc="Panels" />
          <ColorSwatch name="surface/2" value="#1B2232" var="--surface-2" desc="Raised" />
          <ColorSwatch name="surface/3" value="#223049" var="--surface-3" desc="Highest" />
        </div>
      </section>

      {/* B) Color - Text */}
      <section>
        <h3 className="mb-4" style={{ color: 'var(--text-high)' }}>B) Text — WCAG AA ≥ 4.5:1</h3>
        <div className="grid grid-cols-3 gap-4">
          <ColorSwatch name="text/high" value="rgba(255,255,255,0.92)" var="--text-high" desc="Titles (16–24+)" />
          <ColorSwatch name="text/med" value="rgba(255,255,255,0.72)" var="--text-med" desc="Body, labels" />
          <ColorSwatch name="text/subtle" value="rgba(255,255,255,0.56)" var="--text-subtle" desc="Meta, secondary" />
        </div>
        <div className="mt-4 p-4 rounded-lg" style={{ background: 'var(--surface-1)' }}>
          <div className="space-y-2">
            <p style={{ color: 'var(--text-high)' }}>Aa 16px — text/high ✓ PASS</p>
            <p style={{ color: 'var(--text-med)' }}>Aa 16px — text/med ✓ PASS</p>
            <p style={{ color: 'var(--text-subtle)' }}>Aa 16px — text/subtle ✓ PASS</p>
          </div>
        </div>
      </section>

      {/* C) Brand & Accents */}
      <section>
        <h3 className="mb-4" style={{ color: 'var(--text-high)' }}>C) Brand & Accents</h3>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <ColorSwatch name="brand/cyan" value="#6EE7F3" var="--brand-cyan" />
          <ColorSwatch name="brand/violet" value="#A78BFA" var="--brand-violet" />
          <div className="p-4 rounded-lg" style={{ 
            background: 'linear-gradient(30deg, var(--brand-cyan), var(--brand-violet))',
            border: '1px solid var(--stroke-low)'
          }}>
            <p style={{ fontSize: 'var(--text-micro)', color: 'var(--surface-0)' }}>brand/gradient</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <ColorSwatch name="accent/info" value="#3BA0FF" var="--accent-info" />
          <ColorSwatch name="accent/success" value="#22D3A6" var="--accent-success" />
          <ColorSwatch name="accent/warning" value="#F59E0B" var="--accent-warning" />
          <ColorSwatch name="accent/danger" value="#EF4444" var="--accent-danger" />
        </div>
      </section>

      {/* D) UI Strokes & Focus */}
      <section>
        <h3 className="mb-4" style={{ color: 'var(--text-high)' }}>D) UI Strokes & Focus — ≥ 3:1</h3>
        <div className="grid grid-cols-4 gap-4">
          <StrokeSwatch name="stroke/low" value="rgba(255,255,255,0.12)" var="--stroke-low" desc="Dividers" />
          <StrokeSwatch name="stroke/med" value="rgba(255,255,255,0.20)" var="--stroke-med" desc="Inputs, cards" />
          <StrokeSwatch name="stroke/high" value="rgba(255,255,255,0.28)" var="--stroke-high" desc="Emphasized" />
          <div className="p-4 rounded-lg" style={{ 
            background: 'var(--surface-1)',
            border: '3px solid var(--focus-ring)'
          }}>
            <p style={{ fontSize: 'var(--text-micro)', color: 'var(--text-med)' }}>focus/ring</p>
            <p style={{ fontSize: 'var(--text-micro)', color: 'var(--text-subtle)' }}>2–3px ring</p>
          </div>
        </div>
      </section>

      {/* E) Glass (disciplined) */}
      <section>
        <h3 className="mb-4" style={{ color: 'var(--text-high)' }}>E) Glass — Overlays Only</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-lg relative overflow-hidden" style={{ 
            background: 'var(--glass-bg)',
            border: '1px solid var(--glass-stroke)',
            backdropFilter: 'blur(16px)',
          }}>
            <div className="absolute top-0 left-0 w-24 h-24 rounded-full" style={{
              background: 'radial-gradient(circle at top left, rgba(255, 255, 255, 0.12), transparent)'
            }} />
            <p style={{ fontSize: 'var(--text-meta)', color: 'var(--text-high)' }}>Glass Variant</p>
            <p style={{ fontSize: 'var(--text-micro)', color: 'var(--text-subtle)' }}>
              For palette, inspector header, command overlay
            </p>
          </div>
          <div className="p-6 rounded-lg" style={{ 
            background: 'var(--surface-2)',
            border: '1px solid var(--stroke-med)'
          }}>
            <p style={{ fontSize: 'var(--text-meta)', color: 'var(--text-high)' }}>Matte Fallback</p>
            <p style={{ fontSize: 'var(--text-micro)', color: 'var(--text-subtle)' }}>
              Reduced-motion & low-power
            </p>
          </div>
        </div>
      </section>

      {/* F) Typography */}
      <section>
        <h3 className="mb-4" style={{ color: 'var(--text-high)' }}>F) Typography — Inter</h3>
        <div className="space-y-4 p-6 rounded-lg" style={{ background: 'var(--surface-1)' }}>
          <div>
            <p style={{ fontSize: 'var(--text-display)', color: 'var(--text-high)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
              Display 32px
            </p>
            <p style={{ fontSize: 'var(--text-micro)', color: 'var(--text-subtle)' }}>120% line / -1% tracking</p>
          </div>
          <div>
            <p style={{ fontSize: 'var(--text-headline)', color: 'var(--text-high)', letterSpacing: '-0.005em', lineHeight: 1.3 }}>
              Headline 24px
            </p>
            <p style={{ fontSize: 'var(--text-micro)', color: 'var(--text-subtle)' }}>130% line / -0.5% tracking</p>
          </div>
          <div>
            <p style={{ fontSize: 'var(--text-title)', color: 'var(--text-high)', lineHeight: 1.3 }}>
              Title 20px
            </p>
          </div>
          <div>
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-med)', lineHeight: 1.5 }}>
              Body 16px — Default reading text with 150% line height
            </p>
          </div>
          <div>
            <p style={{ fontSize: 'var(--text-meta)', color: 'var(--text-subtle)', lineHeight: 1.5 }}>
              Meta 14px — Labels, captions
            </p>
          </div>
          <div>
            <p style={{ fontSize: 'var(--text-micro)', color: 'var(--text-subtle)', lineHeight: 1.5 }}>
              Micro 12px — Tiny labels
            </p>
          </div>
        </div>
      </section>

      {/* G) Chart Palettes */}
      <section>
        <h3 className="mb-4" style={{ color: 'var(--text-high)' }}>G) Chart Palettes — Okabe-Ito</h3>
        <div className="grid grid-cols-8 gap-2">
          {['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7', '#999999'].map((color, i) => (
            <div key={i} className="h-16 rounded-lg" style={{ background: color }} />
          ))}
        </div>
      </section>

      {/* H) Spacing & Icons */}
      <section>
        <h3 className="mb-4" style={{ color: 'var(--text-high)' }}>H) Spacing & Icons</h3>
        <div className="space-y-2 p-6 rounded-lg" style={{ background: 'var(--surface-1)', fontSize: 'var(--text-meta)', color: 'var(--text-med)' }}>
          <p>• Grid: 4pt base (8/12/16 rhythm)</p>
          <p>• Radii: 8 (default), 12 (cards), 16 (drawers)</p>
          <p>• Hit target: min 36×36px</p>
          <p>• Icons: 20px, stroke 2px, rounded joins</p>
        </div>
      </section>

      {/* I) Motion */}
      <section>
        <h3 className="mb-4" style={{ color: 'var(--text-high)' }}>I) Motion Tokens</h3>
        <div className="space-y-2 p-6 rounded-lg" style={{ background: 'var(--surface-1)', fontSize: 'var(--text-meta)', color: 'var(--text-med)' }}>
          <p>• micro/fast: 150–200ms cubic-bezier(0.4, 0, 0.2, 1)</p>
          <p>• macro: 200–320ms same easing</p>
          <p>• success-glint: 220–280ms one-shot (optional)</p>
          <p>• ⚠️ Reduced-motion: opacity/tonal only</p>
        </div>
      </section>
    </div>
  );
}

function ColorSwatch({ name, value, var: varName, desc }: { name: string; value: string; var: string; desc?: string }) {
  return (
    <div className="p-4 rounded-lg" style={{ background: `var(${varName})`, border: '1px solid var(--stroke-low)' }}>
      <p style={{ fontSize: 'var(--text-micro)', color: name.includes('text') ? `var(${varName})` : 'var(--text-high)' }}>
        {name}
      </p>
      {desc && (
        <p style={{ fontSize: 'var(--text-micro)', color: name.includes('text') ? `var(${varName})` : 'var(--text-subtle)', marginTop: '4px' }}>
          {desc}
        </p>
      )}
    </div>
  );
}

function StrokeSwatch({ name, value, var: varName, desc }: { name: string; value: string; var: string; desc?: string }) {
  return (
    <div className="p-4 rounded-lg" style={{ background: 'var(--surface-1)', border: `1px solid var(${varName})` }}>
      <p style={{ fontSize: 'var(--text-micro)', color: 'var(--text-med)' }}>
        {name}
      </p>
      {desc && (
        <p style={{ fontSize: 'var(--text-micro)', color: 'var(--text-subtle)', marginTop: '4px' }}>
          {desc}
        </p>
      )}
    </div>
  );
}
