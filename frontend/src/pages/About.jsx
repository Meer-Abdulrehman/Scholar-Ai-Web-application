const TEAM = [
  {
    name: 'Abdulrehman',
    roll: 'B-28721',
    role: 'ML + Backend Architect',
    desc: 'Responsible for the core predictive engine, SHAP implementation, and scalable FastAPI infrastructure.',
  },
  {
    name: 'Rana Gulzaib',
    roll: 'B-28506',
    role: 'UI + DB Architect',
    desc: 'Leading the visual strategy, dashboard engineering, and the optimized MongoDB data architecture.',
  },
]

const TECH = [
  { icon: 'code',              label: 'React' },
  { icon: 'bolt',              label: 'FastAPI' },
  { icon: 'database',          label: 'MongoDB' },
  { icon: 'query_stats',       label: 'SHAP' },
  { icon: 'link',              label: 'LangChain' },
  { icon: 'science',           label: 'MLflow' },
  { icon: 'memory',            label: 'Groq' },
  { icon: 'record_voice_over', label: 'Uplift TTS' },
  { icon: 'layers',            label: 'Docker' },
  { icon: 'hub',               label: 'MCP' },
]

export default function About() {
  return (
    <div className="bg-background min-h-screen">
      <main className="max-w-[1280px] mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 space-y-10 sm:space-y-16">

        {/* Hero */}
        <section className="relative py-8 sm:py-12 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/20 to-transparent rounded-3xl" />
          <div className="relative z-10 text-center space-y-3 sm:space-y-4 px-4">
            <span className="text-xs text-[#4cd7f6] tracking-[0.2em] font-bold uppercase anim-fade-in">Mission & Vision</span>
            <h1 className="text-2xl sm:text-3xl md:text-h1 font-bold text-on-surface font-inter anim-fade-up delay-100">About This Project</h1>
            <p className="text-sm sm:text-body-lg text-slate-400 max-w-2xl mx-auto anim-fade-up delay-200">
              ScholarAI Advisor is an advanced analytical ecosystem designed to bridge the gap between
              academic data and career potential, empowering students with AI-driven insights.
            </p>
          </div>
        </section>

        {/* Team */}
        <section className="space-y-6 sm:space-y-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-px flex-1 bg-outline-variant" />
            <h2 className="text-lg sm:text-h2 font-semibold text-on-surface font-inter whitespace-nowrap">The Development Team</h2>
            <div className="h-px flex-1 bg-outline-variant" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
            {TEAM.map((member, i) => (
              <div key={member.roll}
                className={`glass-card rounded-2xl p-5 sm:p-8 group hover:border-cyan-400/50 transition-colors duration-300 anim-fade-up`}
                style={{ animationDelay: `${i * 150}ms` }}>
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl bg-surface-container-high border-2 border-outline-variant group-hover:border-cyan-400 transition-colors flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-3xl sm:text-4xl text-on-surface-variant"
                      style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 min-w-0">
                    <h3 className="text-base sm:text-h3 font-semibold text-on-surface">{member.name}</h3>
                    <p className="text-[#4cd7f6] font-medium text-sm">{member.roll}</p>
                    <span className="text-on-surface-variant text-xs sm:text-body-sm bg-surface-container-high border border-outline-variant inline-block px-3 py-1 rounded-full">
                      {member.role}
                    </span>
                    <p className="text-on-surface-variant text-xs sm:text-sm mt-2 opacity-90">{member.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-h2 font-semibold text-on-surface font-inter">Technology Stack</h2>
            <p className="text-on-surface-variant text-sm sm:text-base">Built with cutting-edge tools for maximum performance and intelligence.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 max-w-4xl mx-auto">
            {TECH.map(({ icon, label }, i) => (
              <div key={label}
                className="bg-surface-container-high border border-outline-variant hover:border-cyan-400 hover:text-cyan-400 hover:-translate-y-1 transition-all duration-200 px-3 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 cursor-default text-on-surface anim-scale-in"
                style={{ animationDelay: `${i * 60}ms` }}>
                <span className="material-symbols-outlined text-cyan-400 text-base sm:text-xl">{icon}</span>
                <span className="font-bold text-xs sm:text-sm">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="md:col-span-2 glass-card rounded-3xl p-5 sm:p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-6xl sm:text-9xl">auto_awesome</span>
            </div>
            <h3 className="text-base sm:text-h3 font-semibold text-on-surface mb-3 sm:mb-4">Visionary Analysis</h3>
            <p className="text-on-surface-variant leading-relaxed text-sm sm:text-base max-w-lg">
              We leverage machine learning to identify patterns in academic performance that often go
              unnoticed. By utilizing SHAP (SHapley Additive exPlanations), we provide the "why"
              behind every prediction, ensuring students understand their trajectory.
            </p>
            <div className="mt-5 sm:mt-8 flex gap-3 flex-wrap">
              <div className="bg-primary-container/10 border border-primary-container/30 px-3 sm:px-4 py-2 rounded-lg text-primary text-xs sm:text-sm font-medium">
                94% Accuracy
              </div>
              <div className="bg-secondary-container/10 border border-secondary-container/30 px-3 sm:px-4 py-2 rounded-lg text-[#4cd7f6] text-xs sm:text-sm font-medium">
                Real-time Insights
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-5 sm:p-8 flex flex-col justify-between border-cyan-400/20">
            <span className="material-symbols-outlined text-cyan-400 text-3xl sm:text-4xl"
              style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            <div className="mt-4">
              <h3 className="text-base sm:text-h3 font-semibold text-on-surface mb-2">Institutional Root</h3>
              <p className="text-on-surface-variant text-sm">
                Born as a capstone project to revolutionize the student experience at the
                University of South Asia, Lahore.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low w-full py-8 sm:py-12 border-t border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="flex flex-col items-center md:items-start gap-1 sm:gap-2">
            <span className="font-bold text-on-surface">ScholarAI Advisor</span>
            <p className="font-inter text-xs text-on-surface-variant text-center md:text-left">© 2025 ScholarAI Advisor. Bridging data and human potential.</p>
            <p className="font-inter text-[10px] text-on-surface-variant uppercase tracking-widest text-center md:text-left opacity-80">
              University of South Asia, Lahore — Department of Computer Science
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {['Tech Stack', 'Team', 'Documentation', 'Contact'].map(link => (
              <a key={link} href="#"
                className="font-inter text-xs text-on-surface-variant hover:text-cyan-400 hover:underline transition-colors duration-200">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
