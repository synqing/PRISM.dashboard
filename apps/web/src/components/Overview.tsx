import { TrendingUp, TrendingDown, Clock, GitPullRequest, AlertCircle, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const kpis = [
  {
    id: 'ttfv',
    title: 'TTFV',
    subtitle: 'North Star',
    value: '2.8s',
    delta: -12,
    trend: 'down',
    sparklineData: [3.2, 3.1, 3.0, 2.9, 2.8, 2.8, 2.7],
    chipColor: 'var(--accent-success)'
  },
  {
    id: 'cycle',
    title: 'Cycle Time',
    subtitle: 'Avg completion',
    value: '4.2d',
    delta: 8,
    trend: 'up',
    sparklineData: [3.8, 3.9, 4.0, 4.1, 4.2, 4.3, 4.2],
    chipColor: 'var(--accent-warning)'
  },
  {
    id: 'lead',
    title: 'Lead Time',
    subtitle: 'Idea → Done',
    value: '12.5d',
    delta: -5,
    trend: 'down',
    sparklineData: [13.2, 13.0, 12.8, 12.7, 12.6, 12.5, 12.5],
    chipColor: 'var(--accent-success)'
  },
  {
    id: 'pr-aging',
    title: 'PR Aging',
    subtitle: 'Open > 48h',
    value: '3',
    delta: 0,
    trend: 'neutral',
    sparklineData: [4, 3, 3, 4, 3, 3, 3],
    chipColor: 'var(--accent-info)'
  },
  {
    id: 'wip',
    title: 'WIP Breaches',
    subtitle: 'Over limit',
    value: '2',
    delta: -1,
    trend: 'down',
    sparklineData: [3, 3, 2, 2, 3, 2, 2],
    chipColor: 'var(--accent-success)'
  },
  {
    id: 'error',
    title: 'Error Budget',
    subtitle: 'Remaining',
    value: '87%',
    delta: -3,
    trend: 'down',
    sparklineData: [90, 89, 88, 88, 87, 87, 87],
    chipColor: 'var(--accent-success)'
  }
];

const trendsData = [
  { name: 'Mon', velocity: 12, quality: 95 },
  { name: 'Tue', velocity: 15, quality: 93 },
  { name: 'Wed', velocity: 11, quality: 97 },
  { name: 'Thu', velocity: 18, quality: 94 },
  { name: 'Fri', velocity: 14, quality: 96 },
  { name: 'Sat', velocity: 8, quality: 98 },
  { name: 'Sun', velocity: 6, quality: 99 }
];

const exceptions = [
  { id: 'PRISM-247', title: 'Glass effect performance regression', severity: 'high', category: 'Performance' },
  { id: 'PRISM-189', title: 'Focus ring missing on custom dropdown', severity: 'medium', category: 'Accessibility' },
  { id: 'PRISM-301', title: 'Motion animation stuck in reduced-motion mode', severity: 'high', category: 'MotionVisuals' },
  { id: 'PRISM-156', title: 'Table virtualization not activating > 100 rows', severity: 'medium', category: 'Performance' }
];

export default function Overview() {
  return (
    <div className="p-8 space-y-8 overflow-auto h-full">
      <div>
        <h2 style={{ color: 'var(--text-high)' }}>Overview</h2>
        <p style={{ color: 'var(--text-med)', fontSize: 'var(--text-meta)', marginTop: '4px' }}>
          Glanceable health & key metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.id} {...kpi} />
        ))}
      </div>

      {/* Trends */}
      <section className="p-6 rounded-xl transition-all duration-200" style={{ 
        background: 'var(--surface-2)',
        border: '1px solid var(--stroke-low)'
      }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 style={{ color: 'var(--text-high)' }}>Trends — Last 7 Days</h3>
            <p style={{ color: 'var(--text-subtle)', fontSize: 'var(--text-meta)', marginTop: '4px' }}>
              Velocity & quality score
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p style={{ fontSize: 'var(--text-meta)', color: 'var(--text-med)', marginBottom: '12px' }}>Velocity (points/day)</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={trendsData}>
                <XAxis 
                  dataKey="name" 
                  stroke="var(--text-subtle)"
                  style={{ fontSize: 'var(--text-micro)' }}
                />
                <YAxis 
                  stroke="var(--text-subtle)"
                  style={{ fontSize: 'var(--text-micro)' }}
                />
                <Bar dataKey="velocity" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <p style={{ fontSize: 'var(--text-meta)', color: 'var(--text-med)', marginBottom: '12px' }}>Quality Score (%)</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={trendsData}>
                <XAxis 
                  dataKey="name" 
                  stroke="var(--text-subtle)"
                  style={{ fontSize: 'var(--text-micro)' }}
                />
                <YAxis 
                  stroke="var(--text-subtle)"
                  style={{ fontSize: 'var(--text-micro)' }}
                  domain={[90, 100]}
                />
                <Line 
                  type="monotone" 
                  dataKey="quality" 
                  stroke="var(--accent-success)" 
                  strokeWidth={2}
                  dot={{ fill: 'var(--accent-success)', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Exceptions */}
      <section className="p-6 rounded-xl" style={{ 
        background: 'var(--surface-2)',
        border: '1px solid var(--stroke-low)'
      }}>
        <h3 style={{ color: 'var(--text-high)', marginBottom: '16px' }}>Exceptions</h3>
        <div className="space-y-3">
          {exceptions.map((exception) => (
            <div 
              key={exception.id}
              className="p-4 rounded-lg flex items-center gap-4 cursor-pointer transition-all duration-200 hover:translate-y-[-1px]"
              style={{ 
                background: 'var(--surface-1)',
                border: '1px solid var(--stroke-med)'
              }}
            >
              <div 
                className="w-2 h-2 rounded-full flex-shrink-0" 
                style={{ 
                  background: exception.severity === 'high' ? 'var(--accent-danger)' : 'var(--accent-warning)' 
                }} 
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 'var(--text-meta)', color: 'var(--text-subtle)' }}>
                    {exception.id}
                  </span>
                  <span style={{ fontSize: 'var(--text-base)', color: 'var(--text-high)' }}>
                    {exception.title}
                  </span>
                </div>
              </div>
              <div 
                className="px-3 py-1 rounded-md"
                style={{ 
                  background: 'var(--surface-3)',
                  fontSize: 'var(--text-micro)',
                  color: 'var(--text-med)'
                }}
              >
                {exception.category}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function KPICard({ title, subtitle, value, delta, trend, sparklineData, chipColor }: any) {
  const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Target;
  
  return (
    <div 
      className="p-5 rounded-xl transition-all duration-200 hover:translate-y-[-2px] cursor-pointer group"
      style={{ 
        background: 'var(--surface-2)',
        border: '1px solid var(--stroke-low)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p style={{ fontSize: 'var(--text-meta)', color: 'var(--text-med)' }}>{title}</p>
          <p style={{ fontSize: 'var(--text-micro)', color: 'var(--text-subtle)', marginTop: '2px' }}>{subtitle}</p>
        </div>
        <div 
          className="px-2 py-1 rounded flex items-center gap-1"
          style={{ 
            background: chipColor + '20',
            border: `1px solid ${chipColor}40`
          }}
        >
          <Icon size={12} style={{ color: chipColor }} />
          <span style={{ fontSize: 'var(--text-micro)', color: chipColor }}>
            {delta > 0 ? '+' : ''}{delta}%
          </span>
        </div>
      </div>
      
      <div style={{ fontSize: 'var(--text-headline)', color: 'var(--text-high)', marginBottom: '12px' }}>
        {value}
      </div>
      
      <div className="h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparklineData.map((v: number, i: number) => ({ value: v }))}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="var(--brand-cyan)" 
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
