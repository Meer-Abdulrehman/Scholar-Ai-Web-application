export default function ShapChart({ shap }) {
  const { base_value, predicted, contributions } = shap
  const maxAbs = Math.max(...contributions.map(c => Math.abs(c.shap_value)), 1)

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-4 sm:p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold text-on-surface">Feature Impact</h3>
        <span className="material-symbols-outlined text-slate-500 text-sm">info</span>
      </div>

      <div className="space-y-4 flex-1">
        {contributions.map(({ feature, shap_value }) => {
          const isPos  = shap_value >= 0
          const pct    = Math.round((Math.abs(shap_value) / maxAbs) * 45)
          const label  = feature.replace(/_/g, ' ')
          return (
            <div key={feature} className="flex items-center gap-3">
              <span className="text-[11px] sm:text-xs text-on-surface-variant w-20 sm:w-24 capitalize truncate">{label}</span>
              <div className="flex-1 flex items-center">
                {isPos ? (
                  <>
                    <div className="w-1/2 flex justify-end" />
                    <div className="h-4 bg-[#10B981] rounded-r-sm transition-all duration-500" style={{ width: `${pct}%` }} />
                    <span className="text-[10px] ml-2 text-green-400 whitespace-nowrap">+{shap_value}</span>
                  </>
                ) : (
                  <>
                    <div className="w-1/2 flex justify-end">
                      <span className="text-[10px] mr-2 text-red-400 whitespace-nowrap">{shap_value}</span>
                      <div className="h-4 bg-[#EF4444] rounded-l-sm transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex-1" />
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-xs text-on-surface-variant mt-4">
        Base {base_value}% → Predicted {predicted}%
      </p>
    </div>
  )
}
