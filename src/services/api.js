import axios from 'axios'
import { getAccessToken, getRefreshToken, setSession, clearSession } from '../utils/tokenStorage'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// Attach the access token to every outgoing request
api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If a request comes back 401, try refreshing the token once, then retry.
// If refresh also fails, clear the session — the app will redirect to login.
let isRefreshing = false
let pendingQueue = []

function resolvePending(token) {
  pendingQueue.forEach((cb) => cb(token))
  pendingQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      clearSession()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingQueue.push((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          resolve(api(originalRequest))
        })
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    try {
      // NOTE: confirm this refresh endpoint + response shape with your senior
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}auth/refresh/`, {
        refresh: refreshToken,
      })
      setSession({ accessToken: data.access })
      resolvePending(data.access)
      originalRequest.headers.Authorization = `Bearer ${data.access}`
      return api(originalRequest)
    } catch (refreshError) {
      clearSession()
      resolvePending(null)
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api