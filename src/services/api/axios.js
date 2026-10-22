import axios from 'axios'
import { getAccessToken, getRefreshToken, setSession, clearSession } from '../../utils/tokenStorage.js'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

let isRefreshing = false
let pendingQueue = []

function processPendingQueue(error, token = null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
      return
    }

    resolve(token)
  })

  pendingQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

if (!originalRequest) {
  return Promise.reject(error)
}

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      clearSession()
      return Promise.reject(error)
    }

  if (isRefreshing) {
  return new Promise((resolve, reject) => {
    pendingQueue.push({
      resolve: (newToken) => {
        originalRequest.headers = originalRequest.headers ?? {}
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        resolve(api(originalRequest))
      },
      reject,
    })
  })
}

    originalRequest._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}auth/refresh/`, {
        refresh: refreshToken,
      })

      setSession({
  accessToken: data.access,
  refreshToken: data.refresh,
})

processPendingQueue(null, data.access)

originalRequest.headers = originalRequest.headers ?? {}
originalRequest.headers.Authorization = `Bearer ${data.access}`

return api(originalRequest)
    } catch (refreshError) {
      clearSession()
processPendingQueue(refreshError)
return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
