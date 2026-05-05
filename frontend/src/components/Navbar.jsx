import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { useNotifications } from '../context/NotificationContext'
import { useAuth } from '../context/AuthContext'

function timeAgo(date) {
  const secs = Math.floor((Date.now() - date) / 1000)
  if (secs < 60)  return 'just now'
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  return `${Math.floor(secs / 3600)}h ago`
}

const NOTIFICATION_COLORS = {
  success: 'text-emerald-400',
  error:   'text-red-400',
  warning: 'text-amber-400',
  info:    'text-cyan-400',
}

const NOTIFICATION_ICONS = {
  success: 'check_circle',
  error:   'error',
  warning: 'warning',
  info:    'info',
}

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const { notifications, clear, clearAll, unread } = useNotifications()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    setMobileOpen(false)
    navigate('/login')
  }

  const [notifOpen,   setNotifOpen]   = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  const notifRef   = useRef()
  const profileRef = useRef()

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const navBg     = dark ? 'bg-[#0B1120]/80' : 'bg-[#e0e7ff]/90'
  const borderCol = dark ? 'border-[#1F2937]' : 'border-[#c7d2fe]'
  const iconCol   = dark ? 'text-slate-400'   : 'text-slate-600'
  const hoverBg   = dark ? 'hover:bg-[#1F2937]/50' : 'hover:bg-[#c7d2fe]/50'
  const dropBg    = dark ? 'bg-[#1d1f27] border-[#434655]' : 'bg-white border-[#c7d2fe]'
  const textMain  = dark ? 'text-white'   : 'text-[#1a1c2e]'
  const textMuted = dark ? 'text-slate-400' : 'text-slate-500'
  const itemHover = dark ? 'hover:bg-[#282a32]' : 'hover:bg-[#eef1ff]'
  const mobileBg  = dark ? 'bg-[#0B1120] border-[#1F2937]' : 'bg-[#e0e7ff] border-[#c7d2fe]'

  const navLinks = [['/', 'Analyzer'], ['/overview', 'Overview'], ['/careers', 'Careers'], ['/history', 'Records'], ['/about', 'About']]

  return (
    <nav className={`sticky top-0 w-full z-50 ${navBg} backdrop-blur-xl border-b ${borderCol} transition-colors duration-300`}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex justify-between items-center h-16">

        {/* Brand */}
        <div className="flex items-center gap-3 sm:gap-8">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="ScholarAI" className="w-7 h-7 sm:w-8 sm:h-8 robot-logo" />
            <span className={`text-xl sm:text-2xl font-black tracking-tighter font-inter ${textMain}`}>ScholarAI</span>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex gap-4 lg:gap-6">
            {navLinks.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  isActive
                    ? 'font-inter text-sm font-medium text-cyan-400 border-b-2 border-cyan-400 pb-1'
                    : `font-inter text-sm font-medium ${textMuted} hover:text-cyan-400 transition-all`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-1 sm:gap-2">

          {/* Dark / Light Toggle */}
          <button
            onClick={toggle}
            className={`p-2 ${hoverBg} rounded-lg transition-all duration-200 active:scale-95`}
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <span className={`material-symbols-outlined text-xl ${iconCol}`} style={{ fontVariationSettings: "'FILL' 1" }}>
              {dark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(o => !o); setProfileOpen(false) }}
              className={`relative p-2 ${hoverBg} rounded-lg transition-all duration-200 active:scale-95`}
              title="Notifications"
            >
              <span className={`material-symbols-outlined text-xl ${iconCol}`}>notifications</span>
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div
                className={`fixed left-4 right-4 top-[72px] sm:top-auto sm:left-auto sm:right-0 sm:absolute sm:mt-2 sm:w-80 sm:max-w-sm rounded-2xl border shadow-2xl overflow-hidden z-[60] ${dropBg}`}
              >
                <div className={`flex items-center justify-between px-4 py-3 border-b ${borderCol}`}>
                  <span className={`font-semibold text-sm ${textMain}`}>Notifications</span>
                  {notifications.length > 0 && (
                    <button onClick={clearAll} className="text-xs text-cyan-400 hover:underline">Clear all</button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center py-8 gap-2">
                      <span className={`material-symbols-outlined text-3xl ${textMuted}`}>notifications_none</span>
                      <p className={`text-xs ${textMuted}`}>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`flex items-start gap-3 px-4 py-3 ${itemHover} transition-colors group`}>
                        <span className={`material-symbols-outlined text-lg mt-0.5 flex-shrink-0 ${NOTIFICATION_COLORS[n.type] ?? 'text-cyan-400'}`}
                          style={{ fontVariationSettings: "'FILL' 1" }}>
                          {NOTIFICATION_ICONS[n.type] ?? 'info'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${textMain} leading-snug`}>{n.msg}</p>
                          <p className={`text-[11px] ${textMuted} mt-0.5`}>{timeAgo(n.time)}</p>
                        </div>
                        <button onClick={() => clear(n.id)}
                          className={`opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded ${textMuted} hover:text-red-400`}>
                          <span className="material-symbols-outlined text-base">close</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => { setProfileOpen(o => !o); setNotifOpen(false) }}
              className={`w-9 h-9 rounded-full bg-primary-container flex items-center justify-center border-2 ${profileOpen ? 'border-cyan-400' : 'border-outline-variant'} transition-all duration-200 hover:border-cyan-400 active:scale-95`}
              title={user?.name?.split(' ')[0] ?? 'Profile'}
            >
              <span className="material-symbols-outlined text-white text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            </button>

            {profileOpen && (
              <div
                className={`fixed left-4 right-4 top-[72px] sm:top-auto sm:left-auto sm:right-0 sm:absolute sm:mt-2 sm:w-72 sm:max-w-xs rounded-2xl border shadow-2xl overflow-hidden z-[60] ${dropBg}`}
              >
                <div className={`px-5 py-4 border-b ${borderCol} flex items-center gap-3`}>
                  <div className="w-12 h-12 rounded-full bg-primary-container border-2 border-cyan-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                  </div>
                  <div className="min-w-0">
                    <p className={`font-semibold text-sm ${textMain} truncate`}>{user?.name ?? 'Profile'}</p>
                    <p className={`text-xs ${textMuted} truncate`}>{user?.email ?? ''}</p>
                    <p className="text-xs text-cyan-400">{user?.role ?? 'student'}</p>
                  </div>
                </div>

                <div className="py-1">
                  {[
                    { icon: 'query_stats',   label: 'Analyzer',  action: () => { navigate('/');         setProfileOpen(false) } },
                    { icon: 'bar_chart',     label: 'Overview',  action: () => { navigate('/overview'); setProfileOpen(false) } },
                    { icon: 'work',          label: 'Careers',   action: () => { navigate('/careers');  setProfileOpen(false) } },
                    { icon: 'manage_search', label: 'Records',   action: () => { navigate('/history');  setProfileOpen(false) } },
                    { icon: 'info',          label: 'About',     action: () => { navigate('/about');    setProfileOpen(false) } },
                  ].map(({ icon, label, action }) => (
                    <button key={label} onClick={action}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${textMain} ${itemHover} transition-colors`}>
                      <span className={`material-symbols-outlined text-base ${textMuted}`}>{icon}</span>
                      {label}
                    </button>
                  ))}

                  <div className={`border-t ${borderCol} my-1`} />

                  <button onClick={toggle}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${textMain} ${itemHover} transition-colors`}>
                    <span className={`material-symbols-outlined text-base ${textMuted}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {dark ? 'light_mode' : 'dark_mode'}
                    </span>
                    {dark ? 'Light Mode' : 'Dark Mode'}
                  </button>

                  <div className={`border-t ${borderCol} my-1`} />

                  <button onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 ${itemHover} transition-colors`}>
                    <span className="material-symbols-outlined text-base text-red-400">logout</span>
                    Logout
                  </button>

                  <div className={`border-t ${borderCol} my-1`} />

                  <div className="px-4 py-2">
                    <p className={`text-[11px] ${textMuted}`}>University of South Asia</p>
                    <p className={`text-[11px] ${textMuted}`}>Department of Computer Science</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            className={`md:hidden p-2 ${hoverBg} rounded-lg transition-all duration-200 active:scale-95`}
          >
            <span className={`material-symbols-outlined text-xl ${iconCol}`}>
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`md:hidden border-t ${borderCol} ${mobileBg} px-4 py-3 space-y-1`}>
          {navLinks.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'text-cyan-400 bg-cyan-400/10'
                    : `${textMuted} ${itemHover} hover:text-cyan-400`
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  )
}
