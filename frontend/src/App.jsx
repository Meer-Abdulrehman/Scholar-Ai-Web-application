import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider }        from './context/ThemeContext'
import { NotificationProvider } from './context/NotificationContext'
import { AuthProvider }         from './context/AuthContext'
import ProtectedRoute           from './components/ProtectedRoute'
import Navbar    from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Overview  from './pages/Overview'
import Careers   from './pages/Careers'
import History   from './pages/History'
import About     from './pages/About'
import Login     from './pages/Login'
import Signup    from './pages/Signup'

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-background transition-colors duration-300">
            <Routes>
              {/* Public routes */}
              <Route path="/login"  element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected routes */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Routes>
                      <Route path="/"         element={<Dashboard />} />
                      <Route path="/overview" element={<Overview />} />
                      <Route path="/careers"  element={<Careers />} />
                      <Route path="/history"  element={<History />} />
                      <Route path="/about"    element={<About />} />
                    </Routes>
                  </>
                </ProtectedRoute>
              } />
            </Routes>

            {/* Global Toast — theme-aware, top-right */}
            <ToastContainer
              position="top-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
              draggable
              theme="dark"
              toastStyle={{
                background: '#1d1f27',
                border: '1px solid #434655',
                borderRadius: '12px',
                fontSize: '14px',
                color: '#e1e2ed',
              }}
            />
          </div>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
