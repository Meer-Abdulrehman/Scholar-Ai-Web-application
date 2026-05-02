export default function ResultCard({ prediction }) {
  const { avg_grade, status, level } = prediction
  const isPass = status === 'Pass'

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center text-center anim-scale-in h-full">
      <div className="text-label-caps font-bold text-on-surface-variant tracking-widest mb-2 anim-fade-in delay-100">PREDICTED PERFORMANCE</div>
      <div className="text-6xl font-black text-secondary mb-2 anim-glow anim-scale-in delay-200">
        {avg_grade}<span className="text-3xl">%</span>
      </div>
      <span className={`px-4 py-1 rounded-full text-sm font-bold border anim-fade-up delay-300 ${isPass ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
        {isPass ? 'PASS' : 'FAIL'}
      </span>
      <p className="text-on-surface-variant text-xs mt-2 anim-fade-in delay-400">{level}</p>
      <div className="w-full mt-4 h-1.5 bg-outline-variant rounded-full overflow-hidden anim-fade-in delay-400">
        <div className="bg-gradient-to-r from-primary-container to-secondary h-full rounded-full"
          style={{ width: `${avg_grade}%`, animation: 'bar-fill 1s ease 0.5s both' }} />
      </div>
    </div>
  )
}
