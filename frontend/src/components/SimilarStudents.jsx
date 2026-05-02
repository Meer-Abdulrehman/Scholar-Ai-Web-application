import { useEffect, useState } from 'react'
import { findSimilar } from '../utils/api'

const STATUS_COLOR = {
  Pass:       'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  Fail:       'text-red-400 bg-red-400/10 border-red-400/20',
  Probation:  'text-amber-400 bg-amber-400/10 border-amber-400/20',
}

function Header() {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="material-symbols-outlined text-cyan-400" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
      <h3 className="text-sm font-semibold text-on-surface">Students Like You</h3>
      <span className="text-[10px] text-cyan-400 border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 rounded-full ml-auto">
        Vector Search
      </span>
    </div>
  )
}

export default function SimilarStudents({ formData }) {
  const [similar, setSimilar] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!formData) return
    setLoading(true)
    findSimilar(formData)
      .then(res => setSimilar(res.data.data ?? []))
      .catch(() => setSimilar([]))
      .finally(() => setLoading(false))
  }, [formData])

  if (loading) return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-4 sm:p-6">
      <Header />
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-14 sm:h-16 bg-surface-container-high rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  )

  if (similar.length === 0) return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-4 sm:p-6">
      <Header />
      <p className="text-xs text-on-surface-variant text-center py-6">
        No similar students found yet. Be the first — run more analyses!
      </p>
    </div>
  )

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-4 sm:p-6">
      <Header />
      <p className="text-xs text-on-surface-variant mb-4">
        Past students with similar academic profiles — see what they achieved.
      </p>

      <div className="space-y-3">
        {similar.map((s, i) => (
          <div key={s.id ?? i}
            className="bg-surface-container-high border border-outline-variant rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">

            {/* Similarity badge */}
            <div className="flex-shrink-0 text-center w-12 sm:w-14">
              <div className="text-base sm:text-lg font-black text-cyan-400">{s.similarity}%</div>
              <div className="text-[9px] text-on-surface-variant uppercase tracking-wider">match</div>
            </div>

            <div className="w-px h-8 bg-outline-variant flex-shrink-0" />

            {/* Stats — responsive grid */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              <div>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Grade</p>
                <p className="text-sm font-bold text-on-surface">{s.avg_grade ?? '—'}%</p>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Status</p>
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full border ${STATUS_COLOR[s.status] ?? 'text-on-surface-variant'}`}>
                  {s.status ?? '—'}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-0.5">Career</p>
                <p className="text-[11px] text-cyan-400 font-medium truncate">{s.top_career ?? '—'}</p>
              </div>
            </div>

            {/* Profile hints — hidden on xs */}
            <div className="flex-shrink-0 text-right hidden sm:block">
              <p className="text-[10px] text-on-surface-variant">{s.study_hours}h study · {s.attendance}% attend</p>
              <p className="text-[10px] text-on-surface-variant">{s.created_at}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
