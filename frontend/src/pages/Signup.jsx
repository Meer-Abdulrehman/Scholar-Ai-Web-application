import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { signupUser } from '../utils/api'

export default function Signup() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [showPwd,  setShowPwd]  = useState(false)
  const [showCPwd, setShowCPwd] = useState(false)

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const res = await signupUser({ name: form.name, email: form.email, password: form.password })
      login(res.data.user, res.data.token)
      toast.success(`Account created! Welcome, ${res.data.user.name?.split(' ')[0]}! Check your email.`)
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Left branding panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden
                      bg-gradient-to-br from-primary-container to-secondary-container
                      flex-col items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #22d3ee 0%, transparent 50%), radial-gradient(circle at 30% 70%, #6366f1 0%, transparent 50%)' }} />

        <div className="relative z-10 max-w-md text-center">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-5xl font-black tracking-tighter text-on-surface">
              Scholar<span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-sm tracking-[4px] uppercase text-on-surface-variant mt-1">Advisor</p>
          </div>

          <p className="text-xl font-semibold text-on-surface mb-2">
            Join ScholarAI Advisor
          </p>
          <p className="text-on-surface-variant text-sm mb-10 leading-relaxed">
            Create your free account and start your journey to academic excellence with AI-powered insights.
          </p>

          {/* Steps */}
          <div className="space-y-4 text-left">
            {[
              { step: '01', title: 'Create your account',      desc: 'Sign up in seconds with your email' },
              { step: '02', title: 'Enter your academic data',  desc: 'Input your grades, study hours, and habits' },
              { step: '03', title: 'Get AI predictions',        desc: 'Receive personalised grade forecasts' },
              { step: '04', title: 'Follow the advice',         desc: 'Act on intelligent study recommendations' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-4 glass-card rounded-xl p-3">
                <span className="text-cyan-400 font-black text-lg flex-shrink-0 w-8 text-center">{step}</span>
                <div>
                  <p className="text-sm font-semibold text-on-surface">{title}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8 anim-fade-in">
            <h1 className="text-4xl font-black tracking-tighter text-on-surface">
              Scholar<span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-xs tracking-[3px] uppercase text-on-surface-variant mt-1">Advisor</p>
          </div>

          <div className="glass-card rounded-2xl p-8 shadow-2xl border border-outline-variant anim-scale-in">
            <h2 className="text-2xl font-bold text-on-surface mb-1">Create Account</h2>
            <p className="text-sm text-on-surface-variant mb-8">Join ScholarAI Advisor for free</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined
                                   text-base text-on-surface-variant pointer-events-none">
                    person
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-on-surface
                               bg-surface-container border border-outline-variant
                               focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50
                               placeholder:text-on-surface-variant/50 transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined
                                   text-base text-on-surface-variant pointer-events-none">
                    mail
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-on-surface
                               bg-surface-container border border-outline-variant
                               focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50
                               placeholder:text-on-surface-variant/50 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined
                                   text-base text-on-surface-variant pointer-events-none">
                    lock
                  </span>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Min. 6 characters"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined
                                   text-base text-on-surface-variant pointer-events-none">
                    lock_reset
                  </span>
                  <input
                    type={showCPwd ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Repeat your password"
                    className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm text-on-surface
                               bg-surface-container border transition-all
                               focus:outline-none focus:ring-1
                               placeholder:text-on-surface-variant/50
                               ${form.confirmPassword && form.password !== form.confirmPassword
                                 ? 'border-red-500/60 focus:border-red-400 focus:ring-red-400/50'
                                 : 'border-outline-variant focus:border-cyan-400 focus:ring-cyan-400/50'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCPwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-cyan-400 transition-colors"
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined text-base">{showCPwd ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-xs text-red-400 mt-1 ml-1">Passwords do not match</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-sm text-white mt-2
                           bg-gradient-to-r from-cyan-500 to-blue-500
                           hover:from-cyan-400 hover:to-blue-400
                           disabled:opacity-60 disabled:cursor-not-allowed
                           active:scale-[0.98] transition-all duration-200
                           shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                    Creating account...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">how_to_reg</span>
                    Create Account
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-on-surface-variant mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-on-surface-variant mt-6 opacity-60">
            University of South Asia &mdash; Department of Computer Science
          </p>
        </div>
      </div>
    </div>
  )
}
