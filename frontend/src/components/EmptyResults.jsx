export default function EmptyResults() {
  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-12 flex flex-col items-center justify-center text-center min-h-[400px] anim-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-surface-container-high flex items-center justify-center mb-6 anim-float">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>
          query_stats
        </span>
      </div>
      <h3 className="text-h3 font-semibold text-on-surface mb-2 anim-fade-up delay-200">Ready to Analyze</h3>
      <p className="text-on-surface-variant text-body-sm max-w-xs anim-fade-up delay-300">
        Fill in your student details on the left and click <strong className="text-secondary">Analyze & Recommend</strong> to see your results here.
      </p>
    </div>
  )
}
