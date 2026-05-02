import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
})

// Automatically attach JWT token from localStorage to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('scholar_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const analyzeStudent   = (data)       => api.post('/analyze', data)
export const findSimilar      = (data)       => api.post('/similar', data)
export const fetchHistory     = (limit = 20) => api.get(`/history?limit=${limit}`)
export const fetchStats       = ()           => api.get('/stats')
export const fetchHistoryById = (id)         => api.get(`/history/${id}`)
export const getTTS           = (text)       => api.post('/tts', { text: String(text).slice(0, 4000) }, { responseType: 'blob' })

// Auth
export const loginUser  = (data)  => api.post('/auth/login', data)
export const signupUser = (data)  => api.post('/auth/signup', data)
export const getMe      = (token) => api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })

export default api
