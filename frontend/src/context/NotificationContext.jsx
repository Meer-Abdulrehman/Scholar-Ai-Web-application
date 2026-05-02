import { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const push = useCallback((msg, type = 'info') => {
    const id = Date.now()
    setNotifications(prev => [{ id, msg, type, time: new Date() }, ...prev].slice(0, 20))
  }, [])

  const clear = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => setNotifications([]), [])

  const unread = notifications.length

  return (
    <NotificationContext.Provider value={{ notifications, push, clear, clearAll, unread }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
