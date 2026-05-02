import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('scholar_user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('scholar_token') || null)

  const login = (userData, jwt) => {
    setUser(userData)
    setToken(jwt)
    localStorage.setItem('scholar_user', JSON.stringify(userData))
    localStorage.setItem('scholar_token', jwt)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('scholar_user')
    localStorage.removeItem('scholar_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
