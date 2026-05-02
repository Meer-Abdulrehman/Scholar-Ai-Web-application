import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : true  // default: dark
  })

  useEffect(() => {
    const html = document.documentElement
    if (dark) {
      html.classList.add('dark')
      html.classList.remove('light')
    } else {
      html.classList.remove('dark')
      html.classList.add('light')
    }
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  // Apply on first render too
  useEffect(() => {
    const html = document.documentElement
    const saved = localStorage.getItem('theme') ?? 'dark'
    html.classList.add(saved)
    html.classList.remove(saved === 'dark' ? 'light' : 'dark')
  }, [])

  return (
    <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
