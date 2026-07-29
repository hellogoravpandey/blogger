import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // send cookies (refreshToken)
})

// Attach accessToken from localStorage to every request
api.interceptors.request.use((config) => {
  // Backend has a typo: "acessToken" — we store it under 'accessToken' but send it correctly
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// On 401 → try to refresh token, then retry original request
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await axios.post('/api/auth/refresh-token', {}, { withCredentials: true })
        // Backend returns accessToken (not the typo one)
        const newToken = res.data.accessToken || res.data.acessToken
        localStorage.setItem('accessToken', newToken)
        api.defaults.headers.common.Authorization = `Bearer ${newToken}`
        processQueue(null, newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
