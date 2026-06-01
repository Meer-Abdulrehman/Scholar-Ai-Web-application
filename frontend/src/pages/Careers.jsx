import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CAREERS = [
  {
    name: 'Software Engineer',
    icon: 'code',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    desc: 'Design and build software systems, applications, and scalable backend services.',
    subjects: { Math: 70, Science: 65, English: 60, Computer: 90 },
    skills: ['Problem Solving', 'Algorithms', 'System Design', 'OOP'],
    minGrade: 65,
  },
  {
    name: 'Data Scientist',
    icon: 'query_stats',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    desc: 'Extract insights from data using statistics, ML models, and visualizations.',
    subjects: { Math: 85, Science: 75, English: 60, Computer: 85 },
    skills: ['Statistics', 'Machine Learning', 'Python', 'Data Visualization'],
    minGrade: 70,
  },
  {
    name: 'Doctor',
    icon: 'stethoscope',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    desc: 'Diagnose and treat patients, requiring deep knowledge of biology and science.',
    // Show Biology instead of Computer for medical careers
    subjects: { Math: 75, Science: 95, English: 65, Biology: 95 },
    skills: ['Biology', 'Critical Thinking', 'Patient Care', 'Research'],
    minGrade: 80,
  },
  {
    name: 'Business Analyst',
    icon: 'trending_up',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    desc: 'Bridge the gap between IT and business, analyzing processes and requirements.',
    subjects: { Math: 80, Science: 60, English: 80, Computer: 75 },
    skills: ['Communication', 'Data Analysis', 'Problem Solving', 'Documentation'],
    minGrade: 65,
  },
  {
    name: 'Teacher / Educator',
    icon: 'school',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20',
    desc: 'Inspire and educate students, designing curriculum and fostering learning.',
    subjects: { Math: 65, Science: 65, English: 90, Computer: 60 },
    skills: ['Communication', 'Patience', 'Curriculum Design', 'Leadership'],
    minGrade: 60,
  },
  {
    name: 'Mechanical Engineer',
    icon: 'settings',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    desc: 'Design mechanical systems, machinery, and manufacturing processes.',
    subjects: { Math: 90, Science: 85, English: 55, Computer: 65 },
    skills: ['CAD', 'Thermodynamics', 'Material Science', 'Physics'],
    minGrade: 70,
  },
  {
    name: 'Graphic Designer',
    icon: 'palette',
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
    desc: 'Create visual content — logos, UI, branding — using design tools and creativity.',
    subjects: { Math: 55, Science: 50, English: 70, Computer: 80 },
    skills: ['Creativity', 'Adobe Suite', 'Typography', 'Color Theory'],
    minGrade: 55,
  },
  {
    name: 'Journalist / Writer',
    icon: 'edit_note',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10 border-rose-500/20',
    desc: 'Research and write stories, reports, or content across media platforms.',
    subjects: { Math: 55, Science: 55, English: 95, Computer: 50 },
    skills: ['Writing', 'Research', 'Interviewing', 'Critical Thinking'],
    minGrade: 60,
  },
  {
    name: 'Accountant / Finance',
    icon: 'account_balance',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    desc: 'Manage financial records, audits, budgets, and investment strategies.',
    subjects: { Math: 90, Science: 60, English: 70, Computer: 65 },
    skills: ['Accounting', 'Financial Modeling', 'Excel', 'Taxation'],
    minGrade: 65,
  },
  {
    name: 'Cybersecurity Analyst',
    icon: 'security',
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    desc: 'Protect systems and networks from cyber threats, vulnerabilities, and attacks.',
    subjects: { Math: 70, Science: 65, English: 60, Computer: 95 },
    skills: ['Networking', 'Ethical Hacking', 'Cryptography', 'Risk Analysis'],
    minGrade: 65,
  },
]

const FILTERS = ['All', 'Tech', 'Science', 'Business', 'Creative']

const FILTER_MAP = {
  Tech:     ['Software Engineer', 'Data Scientist', 'Cybersecurity Analyst'],
  Science:  ['Doctor', 'Mechanical Engineer'],
  Business: ['Business Analyst', 'Accountant / Finance', 'Teacher / Educator'],
  Creative: ['Graphic Designer', 'Journalist / Writer'],
}

function SubjectBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span className="text-on-surface-variant">{label}</span>
        <span className="text-on-surface font-medium">{value}%</span>
      </div>
      <div className="w-full h-1.5 bg-outline-variant rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary-container to-secondary rounded-full transition-all duration-500"
          style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function Careers() {
  const [filter,   setFilter]   = useState('All')
  const [search,   setSearch]   = useState('')
  const [expanded, setExpanded] = useState(null)
  const navigate = useNavigate()

  const visible = CAREERS.filter(c => {
    const matchFilter = filter === 'All' || (FILTER_MAP[filter]?.includes(c.name))
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="max-w-[1280px] mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-10 space-y-6 sm:space-y-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-h1 font-bold text-on-background font-inter">Career Explorer</h1>
          <p className="text-on-surface-variant mt-1 text-sm sm:text-base">Browse career profiles and see what it takes to get there.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-container text-on-primary-container rounded-xl font-semibold text-sm hover:brightness-110 active:scale-95 transition-all flex-shrink-0"
        >
          <span className="material-symbols-outlined text-sm">query_stats</span>
          Check My Fit
        </button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Category filter */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filter === f
                  ? 'bg-primary-container text-on-primary-container border-primary-container'
                  : 'text-on-surface-variant border-outline-variant hover:border-cyan-400 hover:text-cyan-400'
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative ml-auto">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input
            type="text"
            placeholder="Search careers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-outline-variant bg-surface-container text-on-surface text-sm placeholder:text-on-surface-variant focus:outline-none focus:ring-1 focus:ring-secondary w-full sm:w-52"
          />
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-on-surface-variant -mt-6">
        Showing {visible.length} of {CAREERS.length} careers
      </p>

      {/* Career grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {visible.map((career, i) => {
          const isOpen = expanded === career.name
          return (
            <div key={career.name}
              className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden anim-fade-up ${
                isOpen ? 'border-cyan-400/50' : 'hover:border-cyan-400/30'
              }`}
              style={{ animationDelay: `${i * 70}ms` }}>

              {/* Card header */}
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${career.bg}`}>
                    <span className={`material-symbols-outlined ${career.color}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}>{career.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-on-surface">{career.name}</h3>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{career.desc}</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {career.skills.map(s => (
                    <span key={s} className="text-[11px] px-2.5 py-1 rounded-full bg-surface-container-high border border-outline-variant text-on-surface-variant">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Min grade */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant">Min. recommended grade</span>
                  <span className={`text-sm font-bold ${career.color}`}>{career.minGrade}%+</span>
                </div>
              </div>

              {/* Expand toggle */}
              <button
                onClick={() => setExpanded(isOpen ? null : career.name)}
                className="w-full flex items-center justify-between px-6 py-3 border-t border-outline-variant text-xs text-on-surface-variant hover:text-cyan-400 hover:bg-surface-container-high transition-all"
              >
                <span>{isOpen ? 'Hide requirements' : 'View subject requirements'}</span>
                <span className={`material-symbols-outlined text-base transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
              </button>

              {/* Expanded subject bars */}
              {isOpen && (
                <div className="px-6 pb-6 pt-4 bg-surface-container-low space-y-3 border-t border-outline-variant">
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3">Ideal Subject Scores</p>
                  {Object.entries(career.subjects).map(([subj, val]) => (
                    <SubjectBar key={subj} label={subj} value={val} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {visible.length === 0 && (
        <div className="glass-card rounded-2xl p-16 text-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3 block">search_off</span>
          <p className="text-on-surface font-semibold">No careers found</p>
          <p className="text-on-surface-variant text-sm mt-1">Try a different filter or search term.</p>
        </div>
      )}

    </div>
  )
}
