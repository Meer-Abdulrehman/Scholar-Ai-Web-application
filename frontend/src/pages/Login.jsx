import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { loginUser } from '../utils/api'
import { playVoicePrompt } from '../utils/voicePrompt'
import LoginRobot from '../components/LoginRobot'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()

  const [form,       setForm]       = useState({ email: '', password: '' })
  const [loading,    setLoading]    = useState(false)
  const [mood,       setMood]       = useState('idle')
  const [pwdFocused, setPwdFocused] = useState(false)
  const [showPwd,    setShowPwd]    = useState(false)
  const typingTimer = useRef(null)
  const introPlayed = useRef(false)

  // Play sign-in voice prompt when page opens
  useEffect(() => {
    if (introPlayed.current) return
    introPlayed.current = true
    return playVoicePrompt(
      'Please enter your credentials to sign in on this portal for growth tech career.',
    )
  }, [])

  // Reset mood after happy/sad
  useEffect(() => {
    if (mood === 'happy' || mood === 'sad') {
      const t = setTimeout(() => setMood('idle'), mood === 'happy' ? 2500 : 2000)
      return () => clearTimeout(t)
    }
  }, [mood])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

    // Password field typing detection
    if (e.target.name === 'password') {
      setMood('peek')
      clearTimeout(typingTimer.current)
      // Eyes open after 900ms of no typing
      typingTimer.current = setTimeout(() => {
        if (pwdFocused) setMood('idle')
      }, 900)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await loginUser({ email: form.email, password: form.password })
      login(res.data.user, res.data.token)
      setMood('happy')
      toast.success(`Welcome back, ${res.data.user.name?.split(' ')[0]}!`)
      setTimeout(() => navigate('/', { replace: true }), 1800)
    } catch (err) {
      setMood('sad')
      toast.error(err?.response?.data?.detail || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background">

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden
                      bg-gradient-to-br from-primary-container to-secondary-container
                      flex-col items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, #22d3ee 0%, transparent 50%), radial-gradient(circle at 70% 80%, #3b82f6 0%, transparent 50%)' }} />

        <div className="relative z-10 max-w-md text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-black tracking-tighter" style={{ color: '#ffffff' }}>
              Scholar<span className="text-cyan-300">AI</span>
            </h1>
            <p className="text-sm tracking-[4px] uppercase mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Advisor</p>
          </div>

          <p className="text-xl font-semibold mb-2" style={{ color: '#ffffff' }}>
            Your Intelligent Academic Companion
          </p>
          <p className="text-sm mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Predict grades, discover careers, and get personalized AI-powered study advice — all in one place.
          </p>

          <div className="space-y-4 text-left">
            {[
              { icon: 'query_stats',   title: 'Grade Prediction',    desc: 'ML-powered forecasting of your academic performance' },
              { icon: 'work_outline',  title: 'Career Matching',      desc: 'Discover paths aligned with your subject strengths' },
              { icon: 'psychology',    title: 'AI Study Advice',      desc: 'Personalized recommendations from an intelligent agent' },
              { icon: 'manage_search', title: 'Performance History',  desc: 'Track your progress over time with detailed records' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4 rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <span className="material-symbols-outlined text-cyan-300 text-2xl flex-shrink-0 mt-0.5"
                  style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#ffffff' }}>{title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          <div className="lg:hidden text-center mb-8 anim-fade-in">
            <h1 className="text-4xl font-black tracking-tighter text-on-surface">
              Scholar<span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-xs tracking-[3px] uppercase text-on-surface-variant mt-1">Advisor</p>
          </div>

          {/* Robot + Card stacked — robot behind, head peeking above */}
          <div className="relative">

            {/* Robot: z-0, positioned at top center, body hidden behind card */}
            <div className="absolute left-0 right-0 flex justify-center z-0 pointer-events-none" style={{ top: '-130px' }}>
              <LoginRobot mood={mood} />
            </div>

            {/* Card: z-10, pushed down so robot head shows above */}
            <div className="relative z-10 mt-[90px] rounded-2xl pt-10 pb-8 px-8 shadow-2xl border border-outline-variant anim-scale-in"
              style={{ background: 'var(--c-surface-container)', backdropFilter: 'none' }}>

            <h2 className="text-2xl font-bold text-on-surface mb-1">Welcome back</h2>
            <p className="text-sm text-on-surface-variant mb-6">Sign in to your ScholarAI account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-base text-on-surface-variant pointer-events-none">mail</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => { if (mood === 'idle') setMood('idle') }}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-on-surface
                               bg-surface-container border border-outline-variant
                               focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50
                               placeholder:text-on-surface-variant/50 transition-all"
                  />
                </div>
              </div>

              {/* Password — robot covers eyes */}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-base text-on-surface-variant pointer-events-none">lock</span>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => { setPwdFocused(true) }}
                    onBlur={() => { setPwdFocused(false); clearTimeout(typingTimer.current); setMood('idle') }}
                    required
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-on-surface
                               bg-surface-container border border-outline-variant
                               focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50
                               placeholder:text-on-surface-variant/50 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-cyan-400 transition-colors"
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined text-base">{showPwd ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm text-white
                           bg-gradient-to-r from-cyan-500 to-blue-600
                           hover:from-cyan-400 hover:to-blue-500
                           disabled:opacity-60 disabled:cursor-not-allowed
                           active:scale-[0.98] transition-all duration-200
                           shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">login</span>
                    Sign In
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-on-surface-variant mt-6">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="text-cyan-400 font-semibold hover:underline">Sign up</Link>
            </p>
          </div>{/* end card */}
          </div>{/* end robot+card wrapper */}

          <p className="text-center text-xs text-on-surface-variant mt-6 opacity-60">
            University of South Asia &mdash; Department of Computer Science
          </p>
        </div>
      </div>
    </div>
  )
}
