function StatusBadge({ status }) {
  const s = status?.toLowerCase()
  if (s === 'pass')
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
        PASS
      </span>
    )
  if (s === 'probation')
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border bg-amber-500/10 text-amber-400 border-amber-500/20">
        PROB
      </span>
    )
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase border bg-red-500/10 text-red-400 border-red-500/20">
      {status ?? 'FAIL'}
    </span>
  )
}

export default function HistoryCard({ item, index, onViewDetails }) {
  const isLatest   = index === 0
  const confidence = item.careers?.[0]?.match ?? 0

  return (
    <div className="glass-card p-4 sm:p-6 rounded-2xl group hover:border-cyan-400/50 transition-all duration-300"
      style={{ opacity: index > 4 ? 0.85 : 1 }}>
      <div className="flex flex-col gap-4">

        {/* Top row: Icon + Title + Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`h-12 w-12 sm:h-16 sm:w-16 rounded-xl flex items-center justify-center flex-shrink-0 border
            ${isLatest
              ? 'bg-primary-container/20 border-primary-container/30 text-cyan-400'
              : 'bg-surface-container-high border-outline-variant text-on-surface-variant'}`}>
            <span className="material-symbols-outlined text-2xl sm:text-3xl">analytics</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-base sm:text-xl font-bold text-on-surface">Analysis #{item.index}</h3>
              <StatusBadge status={item.status} />
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-xs sm:text-sm">calendar_month</span>
              {item.created_at}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 border-t border-outline-variant pt-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Grade</span>
            <span className="text-lg sm:text-xl font-bold text-on-surface">{item.avg_grade}%</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Top Career</span>
            <span className="text-sm sm:text-base font-bold text-cyan-400 truncate">{item.top_career ?? '—'}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Confidence</span>
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="flex-1 h-1.5 bg-outline-variant rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${confidence}%` }} />
              </div>
              <span className="text-xs text-on-surface flex-shrink-0">{confidence}%</span>
            </div>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => onViewDetails(item)}
          className="w-full px-4 py-2.5 sm:py-3 bg-surface-container-high hover:bg-surface-variant text-on-surface rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 border border-outline-variant"
        >
          View Details
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>

      </div>
    </div>
  )
}
