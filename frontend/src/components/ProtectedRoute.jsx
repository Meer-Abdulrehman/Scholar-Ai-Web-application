import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuth } = useAuth()
  // Default unauthenticated landing is signup.
  return isAuth ? children : <Navigate to="/signup" replace />
}
