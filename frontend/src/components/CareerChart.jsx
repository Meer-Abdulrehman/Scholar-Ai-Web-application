const MEDAL_COLORS = ['text-yellow-500 bg-yellow-500/20', 'text-blue-400 bg-blue-400/20', 'text-orange-400 bg-orange-400/20']
const BAR_COLORS   = ['bg-yellow-500', 'bg-blue-400', 'bg-orange-400']

export default function CareerChart({ careers }) {
  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-4 sm:p-6 h-full flex flex-col">
      <div className="text-label-caps font-bold text-on-surface-variant tracking-widest mb-4">CAREER RECOMMENDATIONS</div>
      <div className="space-y-4 flex-1">
        {careers.map((c, i) => (
          <div key={c.name} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${MEDAL_COLORS[i]}`}>
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-on-surface font-medium">{c.name}</span>
                <span className="text-on-surface-variant">{c.match}% Match</span>
              </div>
              <div className="w-full h-1 bg-outline-variant rounded-full overflow-hidden mb-1">
                <div className={`${BAR_COLORS[i]} h-full rounded-full transition-all duration-700`} style={{ width: `${c.match}%` }} />
              </div>
              {c.reason && (
                <p className="text-[11px] text-on-surface-variant leading-snug">{c.reason}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
