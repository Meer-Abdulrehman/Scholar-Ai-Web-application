import ShapChart      from './ShapChart'
import CareerChart    from './CareerChart'

export default function HistoryDetailModal({ item, onClose }) {
  if (!item) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#1d1f27] border border-outline-variant rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <div>
            <h2 className="text-xl font-bold text-white">Analysis #{item.index}</h2>
            <p className="text-sm text-slate-400 mt-1">{item.created_at}</p>
          </div>
          <button onClick={onClose}
            className="p-2 hover:bg-[#2D3748] rounded-lg transition-colors">
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Grade + Status */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Grade',  value: `${item.avg_grade}%`, color: 'text-secondary' },
              { label: 'Status', value: item.status, color: item.status === 'Pass' ? 'text-emerald-400' : 'text-red-400' },
              { label: 'Level',  value: item.level,  color: 'text-white' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-surface-container-high rounded-xl p-4 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                <p className={`text-xl font-bold ${color}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Careers */}
          {item.careers?.length > 0 && <CareerChart careers={item.careers} />}

          {/* SHAP */}
          {item.shap?.contributions?.length > 0 && <ShapChart shap={item.shap} />}

          {/* AI Advice */}
          {item.advice && (
            <div className="bg-surface-container border border-outline-variant rounded-xl p-5">
              <p className="text-label-caps text-xs text-on-surface-variant tracking-widest mb-3">AI ADVICE</p>
              <p className="text-body-sm text-on-surface italic border-l-2 border-primary-container pl-4 leading-relaxed">
                "{item.advice}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
