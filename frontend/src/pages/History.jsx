import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HistoryCard        from '../components/HistoryCard'
import HistoryDetailModal from '../components/HistoryDetailModal'
import { fetchHistory, fetchStats } from '../utils/api'
import { toast } from 'react-toastify'

export default function History() {
  const [history,  setHistory]  = useState([])
  const [stats,    setStats]    = useState({ total: 0, avg_grade: 0, pass_rate: 0 })
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)
  const [selected, setSelected] = useState(null)
  const [limit,    setLimit]    = useState(10)
  const [sideOpen, setSideOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [hRes, sRes] = await Promise.all([fetchHistory(limit), fetchStats()])
        setHistory(hRes.data.data)
        setStats(sRes.data.data)
      } catch {
        setError('Could not load history. Make sure backend is running.')
        toast.error('Failed to load history. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [limit])

  const navItems = [
    { icon: 'query_stats',  label: 'Analyzer', path: '/' },
    { icon: 'bar_chart',    label: 'Overview',  path: '/overview' },
    { icon: 'work',         label: 'Careers',   path: '/careers' },
  ]

  return (
    <div className="flex min-h-screen">

      {/* Mobile sidebar overlay */}
      {sideOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSideOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-[#0F172A] w-64 border-r border-[#1F2937] z-40 flex flex-col
        transition-transform duration-300
        ${sideOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 sm:p-6">
          <span className="text-base sm:text-lg font-bold text-on-surface">Performance Advisor</span>
          <p className="font-inter text-xs text-slate-500 mt-1">Analytical Insights</p>
        </div>
        <nav className="flex-1 flex flex-col mt-2">
          {navItems.map(({ icon, label, path }) => (
            <button key={label} onClick={() => { navigate(path); setSideOpen(false) }}
              className="text-on-surface-variant px-4 py-3 flex items-center gap-3 hover:bg-surface-container-high hover:text-on-surface transition-all hover:translate-x-1 duration-200 w-full text-left">
              <span className="material-symbols-outlined">{icon}</span>
              <span className="font-inter text-sm">{label}</span>
            </button>
          ))}
          <div className="bg-blue-600/10 text-cyan-400 border-r-4 border-cyan-400 px-4 py-3 flex items-center gap-3">
            <span className="material-symbols-outlined">manage_search</span>
            <span className="font-inter text-sm">Records</span>
          </div>
        </nav>
        <div className="p-4">
          <button onClick={() => { navigate('/'); setSideOpen(false) }}
            className="w-full py-3 bg-primary-container text-on-primary-container rounded-xl font-semibold text-sm active:scale-95 transition-transform">
            New Analysis
          </button>
        </div>
        <div className="p-4 mt-auto border-t border-[#1F2937]">
          <a href="/about" className="text-on-surface-variant px-4 py-2 flex items-center gap-3 hover:text-on-surface transition-all text-xs">
            <span className="material-symbols-outlined text-sm">help_outline</span>
            <span>Help</span>
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-10 min-h-screen">
        <div className="max-w-5xl mx-auto">

          {/* Mobile sidebar toggle */}
          <button
            onClick={() => setSideOpen(true)}
            className="lg:hidden mb-4 flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined">menu</span>
            Menu
          </button>

          {/* Header + Stats */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <div>
              <h1 className="text-2xl sm:text-h1 font-bold text-on-background mb-1 sm:mb-2 font-inter">My Analysis History</h1>
              <p className="text-on-surface-variant text-sm sm:text-body-md">Track your academic evolution and AI-driven career projections.</p>
            </div>
            <div className="flex gap-3">
              {[
                { label: 'Total Analyses', value: stats.total },
                { label: 'Average Grade',  value: `${stats.avg_grade}%` },
              ].map(({ label, value }) => (
                <div key={label} className="glass-card px-4 py-3 rounded-xl flex flex-col min-w-0">
                  <span className="text-[10px] text-cyan-400 uppercase tracking-widest mb-1 whitespace-nowrap">{label}</span>
                  <span className="text-2xl sm:text-3xl font-bold text-on-surface">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm mb-6">{error}</div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-24">
              <svg className="animate-spin h-10 w-10 text-secondary" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          )}

          {/* Empty */}
          {!loading && history.length === 0 && !error && (
            <div className="glass-card rounded-2xl p-8 sm:p-16 flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-5xl text-slate-500 mb-4">history</span>
              <h3 className="text-xl font-bold text-white mb-2">No analyses yet</h3>
              <p className="text-slate-400 text-sm mb-6">Go to Dashboard and run your first analysis.</p>
              <button onClick={() => navigate('/')}
                className="px-6 py-3 bg-primary-container text-white rounded-xl font-semibold text-sm">
                Start Analysis
              </button>
            </div>
          )}

          {/* Cards */}
          {!loading && history.length > 0 && (
            <>
              <div className="space-y-4 sm:space-y-6">
                {history.map((item, i) => (
                  <div key={item.id} className="anim-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                    <HistoryCard item={item} index={i} onViewDetails={setSelected} />
                  </div>
                ))}
              </div>

              <div className="mt-8 sm:mt-12 flex justify-center">
                <button onClick={() => setLimit(l => l + 10)}
                  className="px-6 sm:px-8 py-3 rounded-full border border-[#1F2937] text-slate-400 hover:text-white hover:bg-[#1F2937] transition-all flex items-center gap-2 font-semibold text-sm">
                  Load Older Analyses
                  <span className="material-symbols-outlined">expand_more</span>
                </button>
              </div>
            </>
          )}

        </div>
      </main>

      <HistoryDetailModal item={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
