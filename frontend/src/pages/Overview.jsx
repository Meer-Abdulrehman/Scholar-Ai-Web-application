import { useState, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  BarChart, Bar,
} from 'recharts'
import { fetchHistory, fetchStats } from '../utils/api'

const COLORS = { Pass: '#10b981', Probation: '#f59e0b', Fail: '#ef4444' }
const CAREER_BAR_COLORS = ['#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#111827']

function StatCard({ icon, label, value, sub, color = 'text-cyan-400' }) {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 flex items-center gap-3 sm:gap-5">
      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0">
        <span className={`material-symbols-outlined text-2xl sm:text-3xl ${color}`}
          style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs text-on-surface-variant uppercase tracking-widest font-bold truncate">{label}</p>
        <p className="text-2xl sm:text-3xl font-black text-on-surface">{value}</p>
        {sub && <p className="text-xs text-on-surface-variant mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-on-surface-variant mb-1">{label}</p>
      <p className="text-sm font-bold text-cyan-400">{payload[0].value}%</p>
    </div>
  )
}

export default function Overview() {
  const [history, setHistory] = useState([])
  const [stats,   setStats]   = useState({ total: 0, avg_grade: 0, pass_rate: 0 })
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [hRes, sRes] = await Promise.all([fetchHistory(50), fetchStats()])
        setHistory(hRes.data.data ?? [])
        setStats(sRes.data.data ?? { total: 0, avg_grade: 0, pass_rate: 0 })
      } catch {
        setError('Could not load data. Make sure backend is running.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const gradeTrend = [...history]
    .reverse()
    .map((item, i) => ({ name: `#${item.index ?? i + 1}`, grade: item.avg_grade }))

  const statusMap = history.reduce((acc, item) => {
    const s = item.status ?? 'Unknown'
    acc[s] = (acc[s] ?? 0) + 1
    return acc
  }, {})
  const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }))

  const careerMap = history.reduce((acc, item) => {
    const c = item.top_career
    if (c) acc[c] = (acc[c] ?? 0) + 1
    return acc
  }, {})
  const careerData = Object.entries(careerMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name: name.split(' ')[0], full: name, count }))

  const bestGrade = history.length ? Math.max(...history.map(h => h.avg_grade ?? 0)) : '—'
  const passCount = statusMap['Pass'] ?? 0

  return (
    <div className="max-w-[1280px] mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-10 space-y-6 sm:space-y-10">

      <div>
        <h1 className="text-2xl sm:text-h1 font-bold text-on-background font-inter">Overview</h1>
        <p className="text-on-surface-variant mt-1 text-sm sm:text-base">Your complete academic performance snapshot.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-32">
          <svg className="animate-spin h-10 w-10 text-secondary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      ) : (
        <>
          {/* Stat cards — 2 cols on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="anim-fade-up delay-100"><StatCard icon="analytics"   label="Total Analyses" value={stats.total}             sub="all time"                  color="text-cyan-400" /></div>
            <div className="anim-fade-up delay-200"><StatCard icon="grade"       label="Average Grade"  value={`${stats.avg_grade}%`}   sub="across all runs"           color="text-blue-400" /></div>
            <div className="anim-fade-up delay-300"><StatCard icon="trending_up" label="Best Grade"     value={`${bestGrade}%`}          sub="your peak"                 color="text-emerald-400" /></div>
            <div className="anim-fade-up delay-400"><StatCard icon="task_alt"    label="Passes"         value={passCount}                sub={`of ${stats.total} total`} color="text-violet-400" /></div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

            {/* Grade trend — full width on mobile, 2 cols on lg */}
            <div className="lg:col-span-2 glass-card rounded-2xl p-4 sm:p-6 anim-fade-up delay-200">
              <h2 className="text-sm font-semibold text-on-surface mb-1">Grade Trend</h2>
              <p className="text-xs text-on-surface-variant mb-4 sm:mb-6">How your predicted grade changed over analyses</p>
              {gradeTrend.length >= 2 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={gradeTrend}>
                    <CartesianGrid stroke="var(--c-outline-variant)" strokeDasharray="4 4" />
                    <XAxis dataKey="name" tick={{ fill: 'var(--c-on-surface-variant)', fontSize: 10 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: 'var(--c-on-surface-variant)', fontSize: 10 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="grade" stroke="#06b6d4" strokeWidth={2.5}
                      dot={{ fill: '#06b6d4', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-on-surface-variant text-sm text-center px-4">
                  Run at least 2 analyses to see the trend.
                </div>
              )}
            </div>

            {/* Status pie */}
            <div className="glass-card rounded-2xl p-4 sm:p-6 anim-fade-up delay-300">
              <h2 className="text-sm font-semibold text-on-surface mb-1">Result Distribution</h2>
              <p className="text-xs text-on-surface-variant mb-4">Pass / Probation / Fail breakdown</p>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={statusData} dataKey="value" nameKey="name"
                      cx="50%" cy="45%" outerRadius={70} innerRadius={40}
                      paddingAngle={3} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}>
                      {statusData.map((entry) => (
                        <Cell key={entry.name} fill={COLORS[entry.name] ?? '#8b5cf6'} />
                      ))}
                    </Pie>
                    <Legend wrapperStyle={{ fontSize: 11, color: 'var(--c-on-surface-variant)' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-on-surface-variant text-sm">
                  No data yet.
                </div>
              )}
            </div>
          </div>

          {/* Career frequency */}
          <div className="glass-card rounded-2xl p-4 sm:p-6 anim-fade-up delay-400">
            <h2 className="text-sm font-semibold text-on-surface mb-1">Most Recommended Careers</h2>
            <p className="text-xs text-on-surface-variant mb-4 sm:mb-6">Which careers the AI suggested most across your analyses</p>
            {careerData.length > 0 ? (
              <ResponsiveContainer width="100%" height={190}>
                <BarChart
                  data={careerData}
                  barSize={22}
                  barCategoryGap={72}
                  barGap={0}
                  margin={{ top: 4, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke="var(--c-outline-variant)" strokeDasharray="4 4" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'var(--c-on-surface-variant)', fontSize: 10 }}
                    axisLine={{ stroke: 'var(--c-outline)', strokeWidth: 2.5 }}
                    tickLine={{ stroke: 'var(--c-outline-variant)', strokeWidth: 1 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: 'var(--c-on-surface-variant)', fontSize: 10 }}
                    axisLine={{ stroke: 'var(--c-outline)', strokeWidth: 2.5 }}
                    tickLine={{ stroke: 'var(--c-outline-variant)', strokeWidth: 1 }}
                    width={28}
                  />
                  <Tooltip
                    formatter={(v, n, p) => [v, p.payload.full]}
                    contentStyle={{ background: 'var(--c-surface-container)', border: '1px solid var(--c-outline-variant)', borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {careerData.map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={CAREER_BAR_COLORS[idx % CAREER_BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-on-surface-variant text-sm">
                No career data yet. Run an analysis first.
              </div>
            )}
          </div>

          {/* Recent 3 */}
          {history.length > 0 && (
            <div className="glass-card rounded-2xl p-4 sm:p-6">
              <h2 className="text-sm font-semibold text-on-surface mb-4">Recent Analyses</h2>
              <div className="divide-y divide-outline-variant">
                {history.slice(0, 3).map(item => {
                  const s = item.status?.toLowerCase()
                  const color = s === 'pass' ? 'text-emerald-400' : s === 'probation' ? 'text-amber-400' : 'text-red-400'
                  return (
                    <div key={item.id} className="flex items-center justify-between py-3 gap-2">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <span className="material-symbols-outlined text-on-surface-variant flex-shrink-0">analytics</span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-on-surface">Analysis #{item.index}</p>
                          <p className="text-xs text-on-surface-variant hidden sm:block">{item.created_at}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0">
                        <span className="text-base sm:text-lg font-bold text-on-surface">{item.avg_grade}%</span>
                        <span className={`text-xs font-bold uppercase ${color}`}>{item.status}</span>
                        <span className="text-xs text-cyan-400 truncate max-w-[80px] sm:max-w-[100px] hidden sm:block">{item.top_career ?? '—'}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
