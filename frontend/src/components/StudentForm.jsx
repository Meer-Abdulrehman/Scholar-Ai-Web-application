import { useState } from 'react'

const defaultForm = {
  study_hours: 5, attendance: 85, prev_grade: 70, sleep_hours: 7,
  extracurricular: 1, gender: 1,
  // Track: 'pre-engineering' or 'pre-medical'
  track: 'pre-engineering',
  math: 85, science: 78, english: 92, computer: 80, biology: 70,
}

export default function StudentForm({ onSubmit, loading }) {
  const [form, setForm] = useState(defaultForm)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const subjectsForTrack = (track) => {
    const base = [
      { key: 'math',     label: 'Mathematics' },
      { key: 'Physics',  label: 'Physics' },
      { key: 'chemistry',  label: 'Chemistry' },
    ]
    if (track === 'pre-medical') {
      return [...base, { key: 'biology', label: 'Biology' }]
    }
    return [...base, { key: 'computer', label: 'Computer ![1780323690741](image/StudentForm/1780323690741.png)![1780323692667](image/StudentForm/1780323692667.png)![1780323693215](image/StudentForm/1780323693215.png)![1780323703701](image/StudentForm/1780323703701.png)' }]
  }

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Student Information */}
      <div className="bg-surface-container border border-outline-variant rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>person_search</span>
          <h3 className="text-base sm:text-h3 font-semibold text-on-surface">Student Information</h3>
        </div>

        <div className="space-y-5">
          {/* Study Hours */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] sm:text-label-caps font-bold text-on-surface-variant tracking-widest">STUDY HOURS / DAY</label>
              <span className="text-secondary font-bold text-sm">{form.study_hours}h</span>
            </div>
            <input type="range" min="0" max="12" step="0.5" value={form.study_hours}
              onChange={e => set('study_hours', parseFloat(e.target.value))}
              className="w-full h-2 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-secondary" />
          </div>

          {/* Attendance */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] sm:text-label-caps font-bold text-on-surface-variant tracking-widest">ATTENDANCE RATE</label>
              <span className="text-secondary font-bold text-sm">{form.attendance}%</span>
            </div>
            <input type="range" min="0" max="100" step="1" value={form.attendance}
              onChange={e => set('attendance', parseInt(e.target.value))}
              className="w-full h-2 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-secondary" />
          </div>

          {/* Previous Grade */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] sm:text-label-caps font-bold text-on-surface-variant tracking-widest">PREVIOUS GRADE</label>
              <span className="text-secondary font-bold text-sm">{form.prev_grade}%</span>
            </div>
            <input type="range" min="0" max="100" step="1" value={form.prev_grade}
              onChange={e => set('prev_grade', parseInt(e.target.value))}
              className="w-full h-2 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-secondary" />
          </div>

          {/* Sleep Hours */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[10px] sm:text-label-caps font-bold text-on-surface-variant tracking-widest">SLEEP HOURS / DAY</label>
              <span className="text-secondary font-bold text-sm">{form.sleep_hours}h</span>
            </div>
            <input type="range" min="3" max="12" step="0.5" value={form.sleep_hours}
              onChange={e => set('sleep_hours', parseFloat(e.target.value))}
              className="w-full h-2 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-secondary" />
          </div>

          {/* Toggle Buttons */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-[10px] sm:text-label-caps font-bold text-on-surface-variant tracking-widest block mb-2">EXTRACURRICULAR</label>
              <div className="flex p-1 bg-surface-container-high rounded-lg border border-outline-variant">
                {[['Yes', 1], ['No', 0]].map(([label, val]) => (
                  <button key={val} onClick={() => set('extracurricular', val)}
                    className={`flex-1 py-2 text-xs sm:text-sm rounded transition-all ${form.extracurricular === val ? 'bg-primary-container text-white font-medium' : 'text-on-surface-variant hover:text-on-surface'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] sm:text-label-caps font-bold text-on-surface-variant tracking-widest block mb-2">GENDER</label>
              <div className="flex p-1 bg-surface-container-high rounded-lg border border-outline-variant">
                {[['Male', 1], ['Female', 0]].map(([label, val]) => (
                  <button key={val} onClick={() => set('gender', val)}
                    className={`flex-1 py-2 text-xs sm:text-sm rounded transition-all ${form.gender === val ? 'bg-primary-container text-white font-medium' : 'text-on-surface-variant hover:text-on-surface'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Grades */}
      <div className="bg-surface-container border border-outline-variant rounded-xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
          <h3 className="text-base sm:text-h3 font-semibold text-on-surface">Subject Grades</h3>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {/* Track selector */}
          <div className="mb-3">
            <label className="text-[10px] sm:text-label-caps font-bold text-on-surface-variant tracking-widest block mb-2">TRACK</label>
            <div className="flex p-1 bg-surface-container-high rounded-lg border border-outline-variant">
              {[['Pre-Engineering', 'pre-engineering'], ['Pre-Medical', 'pre-medical']].map(([label, val]) => (
                <button key={val} onClick={() => set('track', val)}
                  className={`flex-1 py-2 text-xs sm:text-sm rounded transition-all ${form.track === val ? 'bg-primary-container text-white font-medium' : 'text-on-surface-variant hover:text-on-surface'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {subjectsForTrack(form.track).map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-body-md text-on-surface">{label}</span>
                <input type="number" min="0" max="100" value={form[key]}
                  onChange={e => set(key, Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-14 sm:w-16 bg-surface-container-high border border-outline-variant rounded-md text-right px-2 py-1 text-on-surface text-sm focus:ring-1 focus:ring-secondary outline-none" />
              </div>
              <div className="w-full h-2 bg-outline-variant rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${form[key]}%` }} />
              </div>
            </div>
          ))}

          <button
            onClick={() => onSubmit(form)}
            disabled={loading}
            className="w-full mt-2 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-primary-container to-secondary-container text-white font-bold text-base sm:text-lg hover:brightness-110 active:scale-95 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl">query_stats</span>
                Analyze & Recommend
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
