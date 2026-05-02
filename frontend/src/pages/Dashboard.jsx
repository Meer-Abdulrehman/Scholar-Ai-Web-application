import { useState } from 'react'
import StudentForm    from '../components/StudentForm'
import ResultCard     from '../components/ResultCard'
import CareerChart    from '../components/CareerChart'
import ShapChart      from '../components/ShapChart'
import RadarChartCard from '../components/RadarChartCard'
import AIAdviceBox    from '../components/AIAdviceBox'
import EmptyResults      from '../components/EmptyResults'
import SimilarStudents   from '../components/SimilarStudents'
import { analyzeStudent } from '../utils/api'
import { toast } from 'react-toastify'

function _doSpeak(text) {
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang  = 'en-US'
  u.rate  = 0.95
  u.pitch = 1.0

  const voices  = window.speechSynthesis.getVoices()
  const female  = voices.find(v =>
    v.lang.startsWith('en') &&
    (v.name.toLowerCase().includes('zira')    ||
     v.name.toLowerCase().includes('susan')   ||
     v.name.toLowerCase().includes('samantha')||
     v.name.toLowerCase().includes('karen')   ||
     v.name.toLowerCase().includes('victoria')||
     v.name.toLowerCase().includes('female'))
  )
  const english = voices.find(v => v.lang === 'en-US' || v.lang === 'en-GB')
  if (female)       u.voice = female
  else if (english) u.voice = english

  window.speechSynthesis.speak(u)
}

function speak(text) {
  try {
    const voices = window.speechSynthesis.getVoices()
    if (voices.length > 0) {
      _doSpeak(text)
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.onvoiceschanged = null
        _doSpeak(text)
      }
    }
  } catch { /* ignore */ }
}

export default function Dashboard() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [form,    setForm]    = useState(null)

  const handleSubmit = async (formData) => {
    setLoading(true)
    setError(null)
    setForm(formData)
    const tid = toast.loading('Analyzing student data...')

    speak('Please wait. Analyzing your academic performance. We apologize for the inconvenience.')

    try {
      const res = await analyzeStudent(formData)
      const data = res.data.data
      setResults(data)

      const grade  = data?.prediction?.avg_grade ?? '—'
      const status = data?.prediction?.status    ?? ''
      const level  = data?.prediction?.level     ?? ''
      const career = data?.careers?.[0]?.name    ?? '—'
      const match  = data?.careers?.[0]?.match   ?? '—'

      toast.update(tid, {
        render: `Grade: ${grade}% (${status}) — Top Career: ${career}`,
        type: 'success', isLoading: false, autoClose: 4000,
      })

      window.speechSynthesis.cancel()

      const shapTop = data?.shap?.contributions?.[0]
      const shapLine = shapTop
        ? `Key factor: ${shapTop.feature.replace(/_/g,' ')} had the highest impact.`
        : ''

      const topCareerLine = (data?.careers ?? [])
        .slice(0, 3)
        .map((c, i) => `${i + 1}: ${c?.name ?? 'Unknown'} at ${c?.match ?? 0} percent`)
        .join(', ')

      const summary =
        `Results are ready. Predicted grade: ${grade} percent. Status: ${status}. Level: ${level}. ` +
        `Top careers: ${topCareerLine || `${career} at ${match} percent`}. ` +
        shapLine

      speak(summary)

    } catch (e) {
      window.speechSynthesis.cancel()
      const msg = e?.response?.data?.detail || 'Server error. Make sure backend is running.'
      setError(msg)
      toast.update(tid, { render: msg, type: 'error', isLoading: false, autoClose: 5000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="relative rounded-xl overflow-hidden mb-6 border border-outline-variant bg-gradient-to-r from-primary-container to-secondary-container p-6 sm:p-8 md:p-10 mx-3 sm:mx-4 md:mx-6 mt-4 md:mt-6 anim-fade-in">
        <div className="relative z-10 grid md:grid-cols-2 items-center gap-6">
          <div className="anim-slide-right">
            <h1 className="text-2xl sm:text-3xl md:text-h1 font-bold mb-3 font-inter" style={{ color: '#ffffff' }}>AI Student Performance Advisor</h1>
            <p className="text-sm sm:text-base max-w-md" style={{ color: 'rgba(255,255,255,0.9)' }}>
              Predict your grades with ML models. Discover your optimal career path through deep behavioral analysis.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 anim-slide-left">
            <div className="hero-card p-4 sm:p-6 rounded-xl anim-scale-in delay-200">
              <span className="material-symbols-outlined mb-1 text-xl" style={{ color: '#ffffff', fontVariationSettings: "'FILL' 1" }}>trending_up</span>
              <div className="text-xl sm:text-h3 font-bold" style={{ color: '#ffffff' }}>{results?.prediction?.avg_grade ?? '—'}%</div>
              <div className="text-[10px] sm:text-label-caps tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>GRADE PREDICTION</div>
            </div>
            <div className="hero-card p-4 sm:p-6 rounded-xl anim-scale-in delay-300">
              <span className="material-symbols-outlined mb-1 text-xl" style={{ color: '#ffffff', fontVariationSettings: "'FILL' 1" }}>work</span>
              <div className="text-xl sm:text-h3 font-bold truncate" style={{ color: '#ffffff' }}>{results?.careers?.[0]?.name?.split(' ')[0] ?? '—'}</div>
              <div className="text-[10px] sm:text-label-caps tracking-widest" style={{ color: 'rgba(255,255,255,0.7)' }}>TOP CAREER MATCH</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-[1280px] mx-auto px-3 sm:px-4 md:px-6 pb-10">
        <div className="grid lg:grid-cols-12 gap-6">

          {/* Left: Form */}
          <div className="lg:col-span-5">
            <StudentForm onSubmit={handleSubmit} loading={loading} />
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm">
                {error}
              </div>
            )}

            {!results && !loading && <EmptyResults />}

            {loading && (
              <div className="bg-surface-container border border-outline-variant rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] gap-4">
                <svg className="animate-spin h-10 w-10 sm:h-12 sm:w-12 text-secondary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <p className="text-on-surface-variant text-sm">Analyzing student data...</p>
              </div>
            )}

            {results && !loading && (
              <>
                {/* Grade + Career */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
                  <div className="anim-fade-up h-full"><ResultCard prediction={results.prediction} /></div>
                  <div className="anim-fade-up delay-150 h-full"><CareerChart careers={results.careers} /></div>
                </div>

                {/* SHAP + Radar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
                  <div className="anim-fade-up delay-200 h-full"><ShapChart shap={results.shap} /></div>
                  <div className="anim-fade-up delay-300 h-full"><RadarChartCard
                    math={form.math} science={form.science}
                    english={form.english} computer={form.computer}
                  /></div>
                </div>

                {/* AI Advice */}
                {results.advice && <div className="anim-fade-up delay-400"><AIAdviceBox advice={results.advice} /></div>}

                {/* Similar Students */}
                <div className="anim-fade-up delay-500"><SimilarStudents formData={form} /></div>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0B1120] w-full py-8 sm:py-12 border-t border-[#1F2937] mt-8">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-bold text-slate-300 text-base sm:text-lg mb-1">ScholarAI Advisor</span>
            <p className="font-inter text-xs text-slate-500 text-center md:text-left">© 2025 ScholarAI Advisor. University of South Asia, Lahore.</p>
          </div>
          <div className="flex gap-4 sm:gap-8">
            {['Tech Stack', 'Team', 'Documentation'].map(link => (
              <a key={link} href="/about" className="font-inter text-xs text-slate-500 hover:text-slate-300 transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </>
  )
}
